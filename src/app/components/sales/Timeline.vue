<template>
    <div class="t-timeline">
        <div :id="id"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SalesService from './SalesService';
    import * as d3 from 'd3';

    export default Vue.component("t-timeline", {
        props: ['id', 'data', 'employees', 'clients'],
        data() {
            return {
                canvas: undefined,
                mainContainer: undefined,
                margin: {top: 20, right: 20, bottom: 30, left: 50},
                width: 0,
                height: 0,
                path: undefined,
                circles: undefined,
                group: undefined,
                xAxis: undefined,
                yAxis: undefined
            }
        },
        watch: {
            data: function (value) {
                let dataFeed = this.prepareData(value);
                let axis = this.setTimelineAxis(dataFeed);
                let lineSetter = this.setLine(axis);
                this.updateAxis(axis, this.xAxis, this.yAxis);
                this.drawTimeline(this.group, dataFeed, lineSetter, this.path);
                let circles = this.drawCircles(this.group, dataFeed, axis);
                this.drawTooltip(circles, axis);
            }
        },
        methods: {
            createSVGContainer: function (d3ParentContainer) {
                let svg = d3ParentContainer.append("svg").attr("id", `${this.id}__canvas`);
                svg.style("width", this.width + this.margin.left + this.margin.right).style("height", this.height + this.margin.top + this.margin.bottom);
                return svg;
            },
            prepareData: function (data) {
                return data.map(d => {
                    let client = this.clients.find(client => client.id === d.clientID);
                    let employee = this.employees.find(employee => employee.id === d.employeeID);
                    return Object.assign({}, d, {
                        dateTime: new Date(d.dateTime)
                    }, {
                        clientName: client ? client.name : undefined
                    }, {
                        employeeName: employee ? employee.givenName + " " + employee.familyName : undefined
                    })
                }).sort((a, b) => a.dateTime - b.dateTime);
            },
            setTimelineAxis: function (data = []) {
                let x = d3.scaleTime()
                    .domain(d3.extent(data, d => d.dateTime))
                    .range([0, this.width]);

                let y = d3.scaleLinear()
                    .domain([d3.min(data, d => d.amount), d3.max(data, d => d.amount)])
                    .range([this.height, 0]);

                return {x, y};
            },
            setLine: function (axis) {
                let {x, y} = axis;
                return d3.line()
                    .x(d => x(d.dateTime))
                    .y(d => y(d.amount));
            },
            drawGroup: function (svg) {
                return svg.attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                    .append("g")
                    .attr("class", `${this.id}__canvas__group`)
                    .attr("transform",
                        "translate(" + this.margin.left + "," + this.margin.top + ")");
            },
            drawAxis: function (g, axis) {
                let {x, y} = axis;

                // Add the X Axis
                this.yAxis = g.append("g")
                    .attr("transform", "translate(0," + this.height + ")");

                let ticks = this.yAxis.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b, %Y")).ticks(6));

                // Add the Y Axis
                this.xAxis = g.append("g");

                this.xAxis.call(d3.axisLeft(y).ticks(4));

                d3.selectAll("text").attr("font-size", "14px");
            },
            drawTimeline: function (group, data = [], lineSetter, path) {
                if (typeof path !== "undefined") {
                    path.transition(this.transition)
                        .attr("d", lineSetter(data))
                        .attr("stroke", this.defineLineColor);
                }
                else {
                    this.path = group.append("path")
                        .attr("class", "line")
                        .attr("d", lineSetter(data))
                        .attr("stroke", this.defineLineColor);
                }
            },
            updateAxis: function (newAxis, previousX, previousY) {
                previousX.transition(this.transition).call(d3.axisLeft(newAxis.y).ticks(4));
                previousY.transition(this.transition).call(d3.axisBottom(newAxis.x).tickFormat(d3.timeFormat("%b, %Y")).ticks(6));
                d3.selectAll("text").attr("font-size", "14px");
            },
            setTransitions: function () {
                this.transition = d3.transition()
                    .duration(500)
                    .ease(d3.easeLinear);
            },
            defineLineColor: function (value) {
                switch (true) {
                    case value === 0:
                        return "#000";
                    case value > 0:
                        return "#337ab7";
                    case value < 0:
                        return "#DF3939";
                }
            },
            drawCircles: function (group, data, axis) {
                let {x, y} = axis;
                let circles = group.selectAll("g.t-shape--circle");

                let update = circles.data(data, d => d.id);

                let enter = update.enter()
                    .append("g").attr("class", "t-shape--circle");

                enter.attr("transform", d => `translate(${x(d.dateTime)}, ${y(d.amount)})`).append("circle").attr("cx", 0).attr("cy", 0)
                    .attr("r", 5)
                    .attr("fill", d => this.defineLineColor(d.amount));

                update.attr("transform", d => `translate(${x(d.dateTime)}, ${y(d.amount)})`).append("circle").attr("cx", 0).attr("cy", 0)
                    .attr("r", 5)
                    .attr("fill", d => this.defineLineColor(d.amount));

                update.exit().remove();

                return enter;
            },
            drawTooltip: function (elements, axis) {
                let _this = this;
                let {x, y} = axis;
                elements.on("mouseenter", function () {
                    let data = d3.select(this).data()[0];
                    let tooltipDiv = _this.mainContainer.append("div").attr("class", "t-tooltip t-tooltip--timeline");
                    _this.addTooltipInfo(tooltipDiv, "Date", SalesService.getFormattedDate("DAY", data.dateTime) || "No data");
                    _this.addTooltipInfo(tooltipDiv, "Employee", data.employeeName || "No data");
                    _this.addTooltipInfo(tooltipDiv, "Client", data.clientName || "No data");
                    _this.addTooltipInfo(tooltipDiv, "Amount", "$" + SalesService.formatNumber("CURRENCY", data.amount) || "No data");
                    let translateX = x(data.dateTime) - 150 / 2;
                    let translateY = y(data.amount) - 100;
                    tooltipDiv.style("transform", `translate(${translateX}px, ${translateY}px)`);
                }).on("mouseleave", function () {
                    d3.selectAll(".t-tooltip--timeline").remove();
                });
            },
            addTooltipInfo: function (parentDiv, label, info) {
                let clientDiv = parentDiv.append("div");
                clientDiv.append("strong").style("display", "inline-block").style("width", "70px").text(label + ": ");
                clientDiv.append("span").text(info);
            }
        },
        mounted() {
            this.mainContainer = d3.select(`#${this.id}`).style("height", "350px");
            this.width = SalesService.getPixelsNumber(this.mainContainer.style("width")) - this.margin.left - this.margin.right;
            this.height = SalesService.getPixelsNumber(this.mainContainer.style("height")) - this.margin.top - this.margin.bottom;
            this.canvas = this.createSVGContainer(this.mainContainer);
            let dataFeed = this.prepareData(this.data);
            let axis = this.setTimelineAxis(dataFeed);
            let lineSetter = this.setLine(axis);
            this.group = this.drawGroup(this.canvas);
            this.drawAxis(this.group, axis);
            this.setTransitions();
            this.drawTimeline(this.group, dataFeed, lineSetter);
            let circles = this.drawCircles(this.group, dataFeed, axis);
            this.drawTooltip(circles, axis);
        }
    });
</script>

<style lang="scss">
    @import '../../variables';

    .t-timeline {
        .line {
            fill: none;
            stroke: #858585;
            stroke-width: 2px;
        }
        .t-tooltip {
            top: 0;
            min-height: 100px;
            font-size: $font-size--small;
            position: absolute;
            min-width: 150px;
            background-color: $grey;
            padding: $spacing-sm;
        }
    }
</style>
