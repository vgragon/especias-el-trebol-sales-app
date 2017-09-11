<template>
    <div class="t-sales-filters padding--all--sm margin--bottom--sm">
        <h2 class="heading--h2 margin--bottom--sm" v-if="dateEnabled || personEnabled">Filters and views</h2>
        <div class="t-filter margin--bottom--md" v-if="dateEnabled">
            <div class="row">
                <div class="col-xs-2 col-sm-12 col-md-12 col-lg-12">
                    <label class="align--bottom margin--right--sm font-weight--bold">Date</label>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <t-date-picker :id="'DATE_1'" :linkedId="'DATE_2'"
                                           class="margin--right--sm"
                                           :placeholder="'Select date'"
                                           @selectedOption="receiveSelectedOption('DATE_RANGE_1', $event)"></t-date-picker>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <t-date-picker :id="'DATE_2'" :placeholder="'Select date (range)'"
                                           @selectedOption="receiveSelectedOption('DATE_RANGE_2', $event)"></t-date-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--<span class="t-separator&#45;&#45;big&#45;&#45;horizontal" v-if="dateEnabled"></span>-->
        <div class="t-filter margin--bottom--md" v-if="personEnabled">
            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label class="align--bottom margin--right--sm font-weight--bold">Person</label>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <t-dropdown :placeholder="'Select employee'" :data="employees"
                                        :displayProperty="['givenName', 'familyName']"
                                        class="margin--right--sm"
                                        @selectedOption="receiveSelectedOption('EMPLOYEE', $event)"
                                        :cleanSelectionEnabled="true"></t-dropdown>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <t-dropdown :placeholder="'Select client'" :data="clients" :displayProperty="'name'"
                                        @selectedOption="receiveSelectedOption('CLIENT', $event)"
                                        :cleanSelectionEnabled="true"></t-dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="t-view" v-if="viewEnabled">
            <label class="align--bottom margin--right--sm font-weight--bold">View as</label>
            <div class="t-view-button-container padding--top--sm padding--bottom--sm">
                <div class="t-view-button margin--right--md padding--all--sm"
                     :class="{'t-view-button--active': activeView === 'CONDENSED'}" @click="toggleView('CONDENSED')">
                    <span class="glyphicon glyphicon-th"></span>
                    <a href="javascript:void(0)">Condensed</a>
                </div>
                <div class="t-view-button margin--right--md padding--all--sm"
                     :class="{'t-view-button--active': activeView === 'REPORT'}" @click="toggleView('REPORT')">
                    <span class="glyphicon glyphicon-list-alt"></span>
                    <a href="javascript:void(0)">Report</a>
                </div>
                <div class="t-view-button margin--right--md padding--all--sm"
                     :class="{'t-view-button--active': activeView === 'TIMELINE'}" @click="toggleView('TIMELINE')">
                    <span class="glyphicon glyphicon-signal"></span>
                    <a href="javascript:void(0)">Timeline</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Dropdown from '../common/Dropdown.vue';
    import SalesService from './SalesService.js';
    import DatePicker from '../common/DatePicker.vue';
    import bus from '../../bus.js';

    // Test
    let importedEmployees = require('../../../../data/employees.json');
    let importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-filters", {
        props: ['data', 'dateEnabled', 'personEnabled', 'viewEnabled'],
        components: [
            Dropdown,
            DatePicker
        ],
        data() {
            return {
                activeView: "CONDENSED",
                appliedFilters: {},
                visibleSales: [],
            }
        },
        computed: {
            employees: function () {
                return importedEmployees;
            },
            years: function () {
                let years = [];
                this.data.map(sales => {
                    let salesYear = new Date(sales.dateTime).getFullYear();
                    if (!years.find(date => date === salesYear)) years.push(salesYear);
                });
                return years;
            },
            months: function () {
                let months = [];
                this.data.sort(SalesService.sortByMonth).map(sales => {
                    let salesMonth = SalesService.getNaturalMonth(new Date(sales.dateTime));
                    if (!months.find(date => date === salesMonth)) months.push(salesMonth);
                });
                return months;
            },
            clients: function () {
                return importedClients;
            }
        },
        methods: {
            toggleView(viewCode) {
                this.activeView = viewCode;
                this.$emit("viewSelect", viewCode);
            },
            receiveSelectedOption(criteria, option) {
                this.appliedFilters[criteria] = option;
                this.visibleSales = this.applyFilterLogic(this.appliedFilters, this.data);
                this.$emit("salesFiltered", this.visibleSales);
            },
            applyFilterLogic(filtersObject, sales) {
                let localSales = [...sales];
                for (let key in filtersObject) {
                    if (key === "DATE_RANGE_1" && typeof filtersObject["DATE_RANGE_1"] !== "undefined") {
                        localSales = localSales.filter(sale => new Date(sale.dateTime) >= filtersObject["DATE_RANGE_1"]);
                    }
                    if (key === "DATE_RANGE_2" && typeof filtersObject["DATE_RANGE_2"] !== "undefined") {
                        localSales = localSales.filter(sale => new Date(sale.dateTime) <= filtersObject["DATE_RANGE_2"]);
                    }
                    if (key === "EMPLOYEE" && typeof filtersObject["EMPLOYEE"] !== "undefined") {
                        localSales = localSales.filter(sale => sale.employeeID === filtersObject[key].id);
                    }
                    if (key === "CLIENT" && typeof filtersObject["CLIENT"] !== "undefined") {
                        localSales = localSales.filter(sale => sale.clientID === filtersObject[key].id);
                    }
                }

                return localSales;
            }
        },
        mounted() {
            this.visibleSales = this.data;
        }
    });
</script>

<style lang="scss">
    .t-sales-filters {
        border: 1px solid #f0f0f0;
    }

    .t-separator {
        display: inline-block;
        padding: 10px;
    }

    .t-filter {
        label {
            display: inline-block;
            max-width: 90px;
            min-width: 50px;
            width: 10%;
            font-weight: normal;
        }
    }

    .t-view-button-container {
        .t-view-button {
            cursor: pointer;
            display: inline-block;
            opacity: 0.5;
            font-weight: bold;

            &.t-view-button--active {
                opacity: 1;
                background-color: #f0f0f0;
            }
        }
    }
</style>
