<template>
    <section class="t-section">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                <div class="t-section__header margin--bottom--sm">
                    <h1 class="heading--h1 inline-block">Sales summary</h1>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <t-sales-create @saleCreate="onSaleCreate"></t-sales-create>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="pull-left margin--bottom--lg">
                            <i class="glyphicon glyphicon-cog" aria-hidden="true"></i>
                            <a href="javascript:void(0)" class="t-link" @click="toggleModal()">Configure filters and view</a>
                        </div>
                        <div class="clearfix"></div>
                        <t-sales-grid :data="groupedSales" v-if="activeView === 'CONDENSED'"></t-sales-grid>
                        <div class="t-sales-report-container" v-if="activeView === 'REPORT'">
                            <div class="t-sales-report-container__section margin--bottom--md"
                                 v-for="salesGroup in groupedSales">
                                <div class="t-sales-report-container__section__title font-weight--bold margin--bottom--sm">
                                    <span>{{getTimeValue("MONTH", salesGroup.dateTime)}}, {{getTimeValue("YEAR", salesGroup.dateTime)}}</span>
                                </div>
                                <t-sales-report :data="getAllRecordsFromGroup(salesGroup)"
                                                :employees="employees"
                                                :clients="clients" :showDate="true"></t-sales-report>
                            </div>
                        </div>
                        <t-timeline :id="'t-sales-timeline'" :data="visibleSales"
                                    :employees="employees" :clients="clients"
                                    v-if="activeView === 'TIMELINE'"></t-timeline>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="t-sales-create" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h2 class="modal-title heading--h2">Configure filter settings</h2>
                    </div>
                    <div class="modal-body">
                        <t-sales-filters :data="sales" @salesFiltered="applySalesGrouping" v-if="!isLoading"
                                         :dateEnabled="true" :personEnabled="true" :viewEnabled="true"
                                         @viewSelect="activeView = $event"></t-sales-filters>
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
    import SalesReport from './SalesReport.vue';
    import Timeline from './Timeline.vue';
    import SalesService from './SalesService.js';
    import SalesCreate from './SalesCreate.vue';

    // Test
    let importedSales = require('../../../../data/sales.json');
    let importedEmployees = require('../../../../data/employees.json');
    let importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales", {
        components: [
            SalesFilters,
            SalesGrid,
            Timeline,
            SalesCreate
        ],
        data() {
            return {
                activeView: "CONDENSED",
                isLoading: false,
                visibleSales: [],
                employees: [],
                clients: [],
                sales: [],
                groupedSales: []
            }
        },
        methods: {
            onSaleCreate(newSale) {
                this.sales = [...this.sales, newSale].sort(SalesService.sortByDate);
                this.visibleSales = this.sales;
                this.groupedSales = this.groupSales(this.visibleSales);
            },
            getAllRecordsFromGroup(salesGroup = []) {
//                return salesGroup.dailyRecords.reduce(function (a, b) {
//                    return a.records.concat(b.records);
//                }, []);

                return [].concat.apply([], salesGroup.dailyRecords.map(group => group.records));
            },
            toggleModal() {
                $("#t-sales-create").modal("show");
            },
            getTimeValue: SalesService.getTimeValue.bind(SalesService),
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
                this.visibleSales = data;
                this.groupedSales = this.groupSales(this.visibleSales);
            }
        },
        mounted() {
            this.sales = importedSales.sort(SalesService.sortByDate);
            this.employees = importedEmployees;
            this.clients = importedClients;
            this.visibleSales = [...this.sales];
            this.groupedSales = this.groupSales(this.visibleSales);
            this.isLoading = false;
        }
    });
</script>
