<template>
    <div class="t-sales-filters margin--bottom--sm">
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Year</label>
            <t-dropdown :data="years" @selectedOption="applyFilter('YEAR', $event)"></t-dropdown>
        </div>
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Months</label>
            <t-dropdown :data="months" @selectedOption="applyFilter('DATE_RANGE1', $event)"
                        :placeholder="'From'"></t-dropdown>
            <span class="t-separator">-</span>
            <t-dropdown :data="months" @selectedOption="applyFilter('DATE_RANGE2', $event)"
                        :placeholder="'To'"></t-dropdown>
        </div>
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Person</label>
            <t-dropdown :placeholder="'Select employee'" :data="employees"
                        :displayProperty="['givenName', 'familyName']"
                        @selectedOption="applyFilter('EMPLOYEE', $event)"></t-dropdown>
            <span class="t-separator visibility--hidden">-</span>
            <t-dropdown :placeholder="'Select client'" :data="clients" :displayProperty="'name'"
                        @selectedOption="applyFilter('CLIENT', $event)"></t-dropdown>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Dropdown from '../common/Dropdown.vue';
    import bus from '../../bus.js';
    import SalesService from './SalesService.js';

    // Test
    let importedEmployees = require('../../../../data/employees.json');
    let importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-filters", {
        props: ['data', 'busEvent'],
        components: [
            Dropdown
        ],
        data() {
            return {
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
            applyFilter(criteria, option) {
                this.appliedFilters[criteria] = option;
                this.visibleSales = this.applyFilterLogic(this.appliedFilters, this.data);
                bus.$emit(this.busEvent, this.visibleSales);
            },
            applyFilterLogic(filtersObject, sales) {
                let localSales = [...sales];
                for (let key in filtersObject) {
                    if (key === "YEAR" && typeof filtersObject["YEAR"] !== "undefined") {
                        localSales = localSales.filter(sale => new Date(sale.dateTime).getFullYear() === filtersObject[key]);
                    }
                    if (key === "DATE_RANGE1" && typeof filtersObject["DATE_RANGE1"] !== "undefined") {
                        let monthNumberJS = SalesService.getMonthNumberJS(filtersObject[key]);
                        localSales = localSales.filter(sale => new Date(sale.dateTime).getMonth() >= monthNumberJS);
                    }
                    if (key === "DATE_RANGE2" && typeof filtersObject["DATE_RANGE2"] !== "undefined") {
                        let monthNumberJS = SalesService.getMonthNumberJS(filtersObject[key]);
                        localSales = localSales.filter(sale => new Date(sale.dateTime).getMonth() <= monthNumberJS);
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
</style>
