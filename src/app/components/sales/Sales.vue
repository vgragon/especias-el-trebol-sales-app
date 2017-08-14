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
    import SalesService from './SalesService.js';

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
            applySalesGrouping(data) {
                this.groupedSales = this.groupSales(data);
            }
        },
        mounted() {
            this.sales = importedSales.sort(SalesService.sortByDate);
            this.employees = importedEmployees;
            this.groupedSales = this.groupSales(this.sales);
            this.isLoading = false;
            bus.$on('salesFilterSelected', this.applySalesGrouping.bind(this));
        }
    });
</script>
