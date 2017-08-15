<template>
    <section class="t-section">
        <t-sales-create></t-sales-create>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                <div class="t-section__header margin--bottom--sm">
                    <h1 class="heading--h1 inline-block">Sales summary</h1>
                    <div class="pull-right">
                        <a href="javascript:void(0)" class="t-link" @click="toggleModal()">Add sales</a>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <t-sales-filters :data="sales" :busEvent="'salesFilterSelected'" v-if="!isLoading"></t-sales-filters>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <t-sales-grid :data="groupedSales"></t-sales-grid>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue';
    import SalesFilters from './SalesFilters.vue';
    import SalesGrid from './SalesGrid.vue';
    import SalesService from './SalesService.js';
    import SalesCreate from './SalesCreate.vue';
    import bus from '../../bus.js';

    // Test
    let importedSales = require('../../../../data/sales.json');
    let importedEmployees = require('../../../../data/employees.json');

    export default Vue.component("t-sales", {
        components: [
            SalesFilters,
            SalesGrid,
            SalesCreate
        ],
        data() {
            return {
                isLoading: false,
                sales: [],
                groupedSales: []
            }
        },
        methods: {
            toggleModal() {
                $("#t-sales-create").modal("show");
            },
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
                    case "DAY":
                        return salesGroupDate.toISOString() === recordDate.toISOString();
                }
            },
            groupSales(records) {
                let recordsArrayClone = [...records];
                let groupedMonthlySales = [];
                let foundMonthlySalesGroup;
                let foundDailySalesGroup;

                for (let salesRecord of recordsArrayClone) {
                    foundMonthlySalesGroup = groupedMonthlySales.find(this.findSalesGroupBy.bind(this, "MONTH_YEAR", salesRecord));
                    if (typeof foundMonthlySalesGroup === "undefined") {
                        groupedMonthlySales.push({
                            dateTime: salesRecord.dateTime,
                            dailyRecords: [{
                                dateTime: salesRecord.dateTime,
                                sumAmount: salesRecord.amount,
                                records: [salesRecord]
                            }]
                        });
                    } else {
                        foundDailySalesGroup = foundMonthlySalesGroup.dailyRecords.find(this.findSalesGroupBy.bind(this, "DAY", salesRecord));
                        if (typeof foundDailySalesGroup === "undefined") {
                            foundMonthlySalesGroup.dailyRecords.push({
                                dateTime: salesRecord.dateTime,
                                sumAmount: salesRecord.amount,
                                records: [salesRecord]
                            });
                        }
                        else {
                            foundDailySalesGroup.sumAmount += salesRecord.amount;
                            foundDailySalesGroup.records.push(salesRecord);
                        }
                    }
                }

                return groupedMonthlySales;
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
