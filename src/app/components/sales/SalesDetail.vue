<template>
    <div class="t-sales-detail">
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
                <div class="t-table">
                    <div class="t-table__row t-table__row--header">
                        <div class="row">
                            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <span class="font-weight--bold">Employee</span>
                            </div>
                            <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                <span class="font-weight--bold">Client</span>
                            </div>
                            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                <span class="font-weight--bold">Amount</span>
                            </div>
                        </div>
                    </div>
                    <div class="t-table__row" v-for="record in visibleSales">
                        <div class="row">
                            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <span>{{ getPropertyValue(record.employeeInstance, ['givenName', 'familyName'], 'Undefined name')}}</span>
                            </div>
                            <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                <span>{{ getPropertyValue(record.clientInstance, ['name'], 'Undefined name')}}</span>
                            </div>
                            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                <span class="t-number--money"
                                      :class="{'t-number--positive': record.amount > 0, 't-number--neutral': record.amount === 0, 't-number--negative': record.amount < 0}">{{formatNumber('CURRENCY', record.amount)}}</span>
                            </div>
                            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                                <div class="pull-right">
                                    <span class="glyphicon glyphicon-trash"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SalesService from './SalesService';
    import SalesCreate from './SalesCreate.vue';
    import SalesFilters from './SalesFilters.vue';
    const importedSales = require('../../../../data/sales.json');
    const importedEmployees = require('../../../../data/employees.json');
    const importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-detail", {
        components: [SalesCreate, SalesFilters],
        data() {
            return {
                salesDateTime: undefined,
                formattedSalesDate: undefined,
                sales: [],
                visibleSales: [],
                employees: [],
                clients: [],
                salesTotal: 0
            };
        },
        methods: {
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
            getPropertyValue(obj, propertyNameArr, defaultValue) {
                if (typeof obj === "undefined") return "Not found";
                let value = "";
                for (let propertyName of propertyNameArr) {
                    value += obj[propertyName] + " ";
                }

                value = value.trim();
                return !value ? defaultValue : value;
            },
            filterByCriteria(criteria, salesRecords = [], valueToCompare) {
                return salesRecords.filter(record => {
                    if (criteria === "MONTH") return valueToCompare.getMonth() === new Date(record.dateTime).getMonth();
                    else if (criteria === "DAY") return record.dateTime === SalesService.toISOString(valueToCompare);
                });
            }
        },
        mounted() {
            this.salesDateTime = new Date(this.$route.params.dateTime);
            this.employees = importedEmployees;
            this.clients = importedClients;
            let criteria = this.$route.params.criteria;
            this.formattedSalesDate = SalesService.getFormattedDate(criteria, this.salesDateTime);
            this.sales = this.filterByCriteria(criteria, importedSales, this.salesDateTime).map(record => {
                this.salesTotal += record.amount;
                Object.defineProperties(record, {
                    "employeeInstance": {
                        enumerable: false,
                        writable: true,
                        value: importedEmployees.find(employee => employee.id == record.employeeID)
                    },
                    "clientInstance": {
                        enumerable: false,
                        writable: true,
                        value: importedClients.find(client => client.id == record.clientID)
                    }
                });

                return record;
            });

            this.visibleSales = this.sales;
        }
    });
</script>

<style lang="scss">
    @import '../../variables';

    .t-table {
        .t-table__row {
            padding: $spacing-xs $spacing-sm;
            border-bottom: 1px solid $grey;

            &:hover {
                background-color: #f8f8f8;
            }

            &.t-table__row--header {
                background-color: $grey;
            }
        }
    }
</style>