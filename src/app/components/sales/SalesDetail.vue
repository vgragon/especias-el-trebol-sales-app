<template>
    <div class="t-sales-detail">
        <div class="pull-right">
            <label>Edit mode</label>
            <div class="t-mode t-mode--edit">
                <div class="t-mode__option" :class="{'t-mode__option--enabled': isEditModeEnabled}"
                     @click="isEditModeEnabled = true">
                    <span>ON</span>
                </div>
                <div class="t-mode__option" :class="{'t-mode__option--enabled': !isEditModeEnabled}"
                     @click="isEditModeEnabled = false">
                    <span>OFF</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="t-section__header margin--bottom--sm">
                    <h1 class="heading--h1 inline-block">Sales records of {{formattedSalesDate}}</h1>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <t-sales-filters :data="sales" :busEvent="'salesFilterSelected'"
                                 @salesFiltered="applySalesFilter($event)"
                                 :dateEnabled="false" :personEnabled="true" :viewEnabled="false"></t-sales-filters>
                <div class="margin--bottom--sm font-size--md pull-right">
                    <strong>Total amount:</strong>
                    <span class="t-number--money"
                          :class="{'t-number--positive': salesTotal > 0, 't-number--negative': salesTotal < 0}">{{formatNumber('CURRENCY', salesTotal)}}</span>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <t-sales-report :data="visibleSales" :employees="employees" :clients="clients"
                                @salesDelete="removeSalesRecordFromArray($event)"
                                :isEditModeEnabled="isEditModeEnabled"
                                :showDelete="true" :showDate="true"></t-sales-report>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SalesService from './SalesService';
    import SalesCreate from './SalesCreate.vue';
    import SalesReport from './SalesReport.vue';
    import SalesFilters from './SalesFilters.vue';
    const importedSales = require('../../../../data/sales.json');
    const importedEmployees = require('../../../../data/employees.json');
    const importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-detail", {
        components: [SalesCreate, SalesFilters, SalesReport],
        data() {
            return {
                salesDateTime: undefined,
                formattedSalesDate: undefined,
                sales: [],
                visibleSales: [],
                employees: [],
                clients: [],
                salesTotal: 0,
                isEditModeEnabled: false
            };
        },
        methods: {
            removeSalesRecordFromArray(salesRecord) {
                this.salesTotal = 0;
                this.sales = this.sales.filter(record => salesRecord.id !== record.id);
                this.visibleSales = this.visibleSales.filter(record => salesRecord.id !== record.id).map(record => {
                    this.salesTotal += record.amount;
                    return record;
                });
            },
            applySalesFilter(sales) {
                this.salesTotal = 0;
                this.visibleSales = sales.map(record => {
                    this.salesTotal += record.amount;
                    return record;
                });
            },
            formatNumber: SalesService.formatNumber,
            toggleModal() {
                $("#t-sales-create").modal("show");
            },
            filterByCriteria(criteria, salesRecords = [], valueToCompare) {
                return salesRecords.filter(record => {
                    if (criteria === "MONTH") return valueToCompare.getMonth() === SalesService.createDateObject(record.dateTime).getMonth();
                    else if (criteria === "DAY") return SalesService.createDateObject(record.dateTime).toISOString() === valueToCompare.toISOString();
                });
            }
        },
        mounted() {
            this.salesDateTime = SalesService.createDateObject(this.$route.params.dateTime);
            this.employees = importedEmployees;
            this.clients = importedClients;
            let criteria = this.$route.params.criteria;
            this.formattedSalesDate = SalesService.getFormattedDate(criteria, this.salesDateTime);
            this.sales = this.filterByCriteria(criteria, importedSales, this.salesDateTime);
            this.visibleSales = this.sales.map(sale => {
                this.salesTotal += sale.amount;
                return sale;
            });
        }
    });
</script>

<style lang="scss">

</style>