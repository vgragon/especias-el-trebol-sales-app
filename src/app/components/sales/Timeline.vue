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
        props: ['id', 'data'],
        data() {
            return {
                canvas: undefined,
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
                this.drawCircles(this.group, dataFeed, axis);
            }
        },
        methods: {
            createSVGContainer: function (d3ParentContainer) {
                let svg = d3ParentContainer.append("svg").attr("id", `${this.id}__canvas`);
                svg.style("width", this.width + this.margin.left + this.margin.right).style("height", this.height + this.margin.top + this.margin.bottom);
                return svg;
            },
            prepareData: function (data) {
                return data.map(d => Object.assign({}, d, {dateTime: new Date(d.dateTime)})).sort((a, b) => a.dateTime - b.dateTime);
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
                let circles = group.selectAll("circle.t-shape--circle");

                let update = circles.data(data, d => d.id);

                let enter = update.enter()
                    .append("circle").attr("class", "t-shape--circle");

                enter.transition(this.transition).attr("cx", d => x(d.dateTime)).attr("cy", d => y(d.amount))
                    .attr("r", 5)
                    .attr("fill", d => this.defineLineColor(d.amount));

                update.transition(this.transition).attr("cx", d => x(d.dateTime)).attr("cy", d => y(d.amount))
                    .attr("r", 5)
                    .attr("fill", d => this.defineLineColor(d.amount));

                update.exit().remove();
            }
        },
        mounted() {
            let mainContainer = d3.select(`#${this.id}`).style("height", "350px");
            this.width = SalesService.getPixelsNumber(mainContainer.style("width")) - this.margin.left - this.margin.right;
            this.height = SalesService.getPixelsNumber(mainContainer.style("height")) - this.margin.top - this.margin.bottom;
            this.canvas = this.createSVGContainer(mainContainer);
            let dataFeed = this.prepareData(this.data);
            let axis = this.setTimelineAxis(dataFeed);
            let lineSetter = this.setLine(axis);
            this.group = this.drawGroup(this.canvas);
            this.drawAxis(this.group, axis);
            this.setTransitions();
            this.drawTimeline(this.group, dataFeed, lineSetter);
            this.drawCircles(this.group, dataFeed, axis);
        }
    });
</script>

<style lang="scss">
    .t-timeline {
        .line {
            fill: none;
            stroke: #858585;
            stroke-width: 4px;
        }
    }
</style>
