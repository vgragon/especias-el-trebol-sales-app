<template>
    <div class="t-sales-filters margin--bottom--sm">
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Year</label>
            <t-dropdown :data="years" @selectedOption="emitFilter('YEAR', $event)"></t-dropdown>
        </div>
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Months</label>
            <t-dropdown :data="months" @selectedOption="emitFilter('DATE_RANGE1', $event)"
                        :placeholder="'From'"></t-dropdown>
            <span class="t-separator">-</span>
            <t-dropdown :data="months" @selectedOption="emitFilter('DATE_RANGE2', $event)"
                        :placeholder="'To'"></t-dropdown>
        </div>
        <div class="t-filter padding--top--sm padding--bottom--sm">
            <label class="align--bottom margin--right--sm">Person</label>
            <t-dropdown :placeholder="'Select employee'" :data="employees"
                        :displayProperty="['givenName', 'familyName']"
                        @selectedOption="emitFilter('EMPLOYEE', $event)"></t-dropdown>
            <span class="t-separator visibility--hidden">-</span>
            <t-dropdown :placeholder="'Select client'" :data="clients" :displayProperty="'name'"
                        @selectedOption="emitFilter('CLIENT', $event)"></t-dropdown>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Dropdown from '../common/Dropdown.vue';
    import bus from '../../bus.js';
    const SalesService = require('./SalesService.js');

    // Test
    let importedEmployees = require('../../../../data/employees.json');
    let importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-filters", {
        props: ['data', 'busEvent'],
        components: [
            Dropdown
        ],
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
            emitFilter(criteria, option) {
                bus.$emit(this.busEvent, criteria, option);
            }
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
