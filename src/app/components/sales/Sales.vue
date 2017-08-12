<template>
<section class="t-section">
    <div class="t-section__header margin--bottom--sm">
        <h1 class="heading--h1">Sales summary</h1>
    </div>
    <t-sales-filters :data="sales" :busEvent="'salesFilterSelected'" v-if="!isLoading"></t-sales-filters>
    <t-sales-grid :data="groupedSales"></t-sales-grid>
</section>
</template>

<script>
import Vue from 'vue';
import SalesFilters from './SalesFilters.vue';
import SalesGrid from './SalesGrid.vue';
import bus from '../../bus.js';
const SalesService = require('./SalesService.js');

// Test
let importedSales = require('../../../../data/sales.json');
let importedEmployees = require('../../../../data/employees.json');

export default Vue.component("t-sales", {
    components: [
        SalesFilters,
        SalesGrid
    ],
    data() {
        return {
            isLoading: false,
            sales: [],
            visibleSales: [],
            appliedFilters: {},
            employees: [],
            groupedSales: []
        }
    },
    methods: {
        findSalesGroupBy(criteria, record, salesGroup) {
            let salesGroupDate = new Date(salesGroup.dateTime);
            let recordDate = new Date(record.dateTime);
            switch (criteria) {
                case "MONTH_YEAR":
                    let salesGroupDateMonthNumber = salesGroupDate.getMonth();
                    let salesGroupDateYearNumber = salesGroupDate.getFullYear();
                    let recordDateMonthNumber = recordDate.getMonth();
                    let recordDateYearNumber = recordDate.getFullYear();
                    return salesGroupDateMonthNumber === recordDateMonthNumber && salesGroupDateYearNumber === recordDateYearNumber;
            }
        },
        groupSales(records) {
            let recordsClone = [...records];
            let groupedSales = [];
            let isDateFound = false;
            let foundSalesGroup;

            for (let salesRecord of recordsClone) {
                foundSalesGroup = groupedSales.find(this.findSalesGroupBy.bind(this, "MONTH_YEAR", salesRecord));
                if (!foundSalesGroup) {
                    groupedSales.push({
                        dateTime: salesRecord.dateTime,
                        records: [salesRecord]
                    });
                } else {
                    foundSalesGroup.records.push(salesRecord);
                }
            }

            return groupedSales;
        },
        applyFilterLogic(filtersObject, sales) {
            let localSales = [...sales];
            for (let key in filtersObject) {
                if (key === "YEAR" && typeof filtersObject["YEAR"] !== "undefined") {
                    localSales = localSales.filter(sale => new Date(sale.dateTime).getFullYear() === filtersObject[key]);
                }
                if (key === "DATE_RANGE1" && typeof filtersObject["DATE_RANGE1"] !== "undefined") {
                    let monthNumberJS = SalesService.getMonthNumberJS(filtersObject[key])
                    localSales = localSales.filter(sale => new Date(sale.dateTime).getMonth() >= monthNumberJS);
                }
                if (key === "DATE_RANGE2" && typeof filtersObject["DATE_RANGE2"] !== "undefined") {
                    let monthNumberJS = SalesService.getMonthNumberJS(filtersObject[key])
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
        },
        applyFilter(criteria, option) {
            this.appliedFilters[criteria] = option;
            this.visibleSales = this.applyFilterLogic(this.appliedFilters, this.sales);
            this.groupedSales = this.groupSales(this.visibleSales);
        }
    },
    mounted() {
        this.sales = importedSales.sort(SalesService.sortByDate);
        this.visibleSales = this.sales;
        this.employees = importedEmployees;
        this.groupedSales = this.groupSales(this.sales);
        this.isLoading = false;

        bus.$on('salesFilterSelected', this.applyFilter.bind(this));
        // let request = new XMLHttpRequest();
        // request.onreadystatechange = function() {
        //     var DONE = this.DONE || 4;
        //     if (this.readyState === DONE) {
        //         this.sales = [];
        //         this.isLoading = true;
        //     }
        // };
        // request.open('GET', 'data/sales.json', true);
        // request.send(null);
    }
});
</script>

<style lang="scss">
p {
    color: inherit;
}
</style>
