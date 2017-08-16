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
                margin: {top: 20, right: 20, bottom: 200, left: 50},
                width: 0,
                height: 0,
                path: undefined,
                group: undefined
            }
        },
        watch: {
            data: function (value) {
                let dataFeed = this.prepareData(value);
                let axis = this.setTimelineAxis(dataFeed);
                let line = this.setLine(axis);
                this.drawAxis(this.group, axis);
                this.updateTimeline(dataFeed, line);
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
                    .domain([0, d3.max(data, d => d.amount)])
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
                    .attr("transform",
                        "translate(" + this.margin.left + "," + this.margin.top + ")");
            },
            drawAxis: function (g, axis) {
                let {x, y} = axis;

                // Add the X Axis
                let ticks = g.append("g")
                    .attr("transform", "translate(0," + this.height + ")")
                    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b, %Y")).ticks(6));

                ticks.selectAll("text").attr("font-size", "14px");

                // Add the Y Axis
                ticks = g.append("g")
                    .call(d3.axisLeft(y).ticks(4));

                ticks.selectAll("text").attr("font-size", "14px");
            },
            drawTimeline: function (group, data = [], line) {
                this.path = group.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", line);
            },
            updateTimeline: function (data = [], line) {
                if (data.length > 0) {
                    this.path.data([data])
                        .attr("class", "line")
                        .attr("d", line);
                }
            }
        },
        mounted() {
            let mainContainer = d3.select(`#${this.id}`).style("height", "500px");
            this.width = SalesService.getPixelsNumber(mainContainer.style("width")) - this.margin.left - this.margin.right;
            this.height = SalesService.getPixelsNumber(mainContainer.style("height")) - this.margin.top - this.margin.bottom;
            this.canvas = this.createSVGContainer(mainContainer);
            let dataFeed = this.prepareData(this.data);
            let axis = this.setTimelineAxis(dataFeed);
            let line = this.setLine(axis);
            this.group = this.drawGroup(this.canvas);
            this.drawAxis(this.group, axis);
            this.drawTimeline(this.group, this.data, line);
        }
    });
</script>

<style lang="scss">
    .t-timeline {
        text {

        }

        .line {
            fill: none;
            stroke: steelblue;
            stroke-width: 2px;
        }
    }
</style>
