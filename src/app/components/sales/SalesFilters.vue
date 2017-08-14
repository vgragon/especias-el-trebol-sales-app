<template>
    <div class="t-sales-filters margin--bottom--sm">
        <h2 class="heading--h2">Filter by</h2>
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Date</label>
            <t-date-picker :id="'DATE_1'" :linkedId="'DATE_2'" class="margin--right--sm" :placeholder="'Select date'"
                           @selectedOption="receiveSelectedOption('DATE_RANGE_1', $event)"></t-date-picker>
            <t-date-picker :id="'DATE_2'" :placeholder="'Select date (range)'"
                           @selectedOption="receiveSelectedOption('DATE_RANGE_2', $event)"></t-date-picker>
        </div>
        <span class="t-separator--big--horizontal"></span>
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Person</label>
            <t-dropdown :placeholder="'Select employee'" :data="employees"
                        :displayProperty="['givenName', 'familyName']" class="margin--right--sm"
                        @selectedOption="receiveSelectedOption('EMPLOYEE', $event)"
                        :cleanSelectionEnabled="true"></t-dropdown>
            <t-dropdown :placeholder="'Select client'" :data="clients" :displayProperty="'name'"
                        @selectedOption="receiveSelectedOption('CLIENT', $event)"
                        :cleanSelectionEnabled="true"></t-dropdown>
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
        props: ['data', 'busEvent'],
        components: [
            Dropdown,
            DatePicker
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
            receiveSelectedOption(criteria, option) {
                this.appliedFilters[criteria] = option;
                this.visibleSales = this.applyFilterLogic(this.appliedFilters, this.data);
                bus.$emit(this.busEvent, this.visibleSales);
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
        padding: 1em;
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
</style>
