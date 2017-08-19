<template>
    <div class="t-table">
        <div class="t-table__row t-table__row--header">
            <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" v-if="showDate">
                    <span class="font-weight--bold">Date</span>
                </div>
                <div :class="{'col-xs-3 col-sm-3 col-md-3 col-lg-3': showDate, 'col-xs-4 col-sm-4 col-md-4 col-lg-4': !showDate}">
                    <span class="font-weight--bold">Employee</span>
                </div>
                <div :class="{'col-xs-4 col-sm-4 col-md-4 col-lg-4': showDate, 'col-xs-5 col-sm-5 col-md-5 col-lg-5': !showDate}">
                    <span class="font-weight--bold">Client</span>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                    <span class="font-weight--bold">Amount</span>
                </div>
            </div>
        </div>
        <div class="t-table__row" v-for="record in sales">
            <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" v-if="showDate">
                    <span>{{getFormattedDate("DAY", record.dateTime)}}</span>
                </div>
                <div :class="{'col-xs-3 col-sm-3 col-md-3 col-lg-3': showDate, 'col-xs-4 col-sm-4 col-md-4 col-lg-4': !showDate}">
                    <span>{{ getPropertyValue(record.employeeInstance, ['givenName', 'familyName'], 'Undefined name')}}</span>
                </div>
                <div :class="{'col-xs-4 col-sm-4 col-md-4 col-lg-4': showDate, 'col-xs-5 col-sm-5 col-md-5 col-lg-5': !showDate}">
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
</template>

<script>
    import Vue from 'vue';
    import SalesService from './SalesService.js';

    export default Vue.component("t-sales-report", {
        props: ['data', 'employees', 'clients', 'showDate'],
        data() {
            return {
                sales: []
            }
        },
        watch: {
            data: function (data) {
                debugger;
                this.sales = this.prepareData(data);
            }
        },
        methods: {
            getPropertyValue(obj, propertyNameArr, defaultValue) {
                if (typeof obj === "undefined") return "Not found";
                let value = "";
                for (let propertyName of propertyNameArr) {
                    value += obj[propertyName] + " ";
                }

                value = value.trim();
                return !value ? defaultValue :
                    value;
            },
            prepareData(data = []) {
                return data.map(record => {
                    this.salesTotal += record.amount;
                    Object.defineProperties(record, {
                        "employeeInstance": {
                            enumerable: false,
                            writable: true,
                            value: this.employees.find(employee => employee.id === record.employeeID)
                        },
                        "clientInstance": {
                            enumerable: false,
                            writable: true,
                            value: this.clients.find(client => client.id === record.clientID)
                        }
                    });

                    return record;
                });
            },
            getFormattedDate: SalesService.getFormattedDate.bind(SalesService),
            formatNumber: SalesService.formatNumber
        },
        mounted() {
            this.sales = this.prepareData(this.data);
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
