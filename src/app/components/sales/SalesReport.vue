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
                    <span v-if="!isEditModeEnabled">{{ getPropertyValue(record.employeeInstance, ['givenName', 'familyName'], 'Undefined name')}}</span>
                    <t-dropdown class="block" :data="employees" :displayProperty="['givenName', 'familyName']"
                                :clean="cleanFields" v-if="isEditModeEnabled"
                                :predefinedValue="record.employeeInstance"
                                @selectedOption="receiveSelectedOption('EMPLOYEE', record, $event)"></t-dropdown>
                </div>
                <div :class="{'col-xs-4 col-sm-4 col-md-4 col-lg-4': showDate, 'col-xs-5 col-sm-5 col-md-5 col-lg-5': !showDate}">
                    <span v-if="!isEditModeEnabled">{{ getPropertyValue(record.clientInstance, ['name'], 'Undefined name')}}</span>
                    <t-dropdown class="block" :data="clients" :displayProperty="'name'"
                                :clean="cleanFields" v-if="isEditModeEnabled" :predefinedValue="record.clientInstance"
                                @selectedOption="receiveSelectedOption('EMPLOYEE', record, $event)"></t-dropdown>
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                    <span class="t-number--money" v-if="!isEditModeEnabled"
                          :class="{'t-number--positive': record.amount > 0, 't-number--neutral': record.amount === 0, 't-number--negative': record.amount < 0}">{{formatNumber('CURRENCY', record.amount)}}</span>
                    <input type="number" v-if="isEditModeEnabled" class="t-input t-input--text t-input--small"
                           title="Amount" placeholder="Enter amount" :value="record.amount"
                           @change="updateRecordAmount(record, $event.target.value)"/>
                </div>
                <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" v-if="showDelete && isEditModeEnabled">
                    <div class="pull-right">
                        <span class="glyphicon glyphicon-trash t-table__button"
                              @click="toggleModal('delete', record)"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="pull-right margin--top--sm">
            <button type="button" v-if="isEditModeEnabled" class="t-button t-button--primary"
                    @click="saveSalesRecords">Save
            </button>
        </div>
        <t-sales-delete :record="salesRecordToDelete" @salesDelete="deleteSale($event)"></t-sales-delete>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SalesDelete from './SalesDelete.vue';
    import SalesService from './SalesService.js';

    export default Vue.component("t-sales-report", {
        props: ['data', 'employees', 'clients', 'showDate', 'showDelete', 'isEditModeEnabled'],
        components: [SalesDelete],
        data() {
            return {
                salesRecordToDelete: undefined,
                sales: [],
                originalSalesRecords: [],
                cleanFields: [false]
            }
        },
        watch: {
            data: function (data) {
                this.sales = this.prepareData(data);
            },
            isEditModeEnabled: function (value) {
                if (value) this.originalSalesRecords = this.sales.map(record => Object.assign({
                    employeeInstance: record["employeeInstance"],
                    clientInstance: record["clientInstance"]
                }, record));
                else if (value === false) this.sales = this.originalSalesRecords.map(record => Object.assign({
                    employeeInstance: record["employeeInstance"],
                    clientInstance: record["clientInstance"]
                }, record));
            }
        },
        methods: {
            updateRecordAmount(record, val) {
                record.amount = Number.parseFloat(val);
                record["hasChanged"] = true;
            },
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
            toggleModal(modalType, record) {
                this.salesRecordToDelete = record;
                if (modalType === "delete") $("#t-sales-delete").modal("show");
                else if (modalType === "edit") $("#t-sales-edit").modal("show");
            },
            saveSalesRecords() {
                this.$emit("salesSave", this.sales);
            },
            deleteSale() {
                this.$emit("salesDelete", this.salesRecordToDelete);
                $("#t-sales-delete").modal("hide");
            },
            receiveSelectedOption(criteria, record, option) {
                record["hasChanged"] = true;
                switch (criteria) {
                    case "EMPLOYEE":
                        record.employeeID = option ? option.id : undefined;
                        break;
                    case "CLIENT":
                        record.clientID = option ? option.id : undefined;
                        break;
                    case "DATE":
                        record.dateTime = option ? SalesService.toISOString(option) : undefined;
                        break;
                }
            },
            prepareData(data = []) {
                return data.map(d => {
                    let record = Object.assign({}, d);
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
            padding: $spacing-sm;
            height: 44px;
            border-bottom: 1px solid $grey;

            .t-dropdown, input {
                top: -7px;
                position: relative;
            }

            &:hover {
                background-color: #f8f8f8;
            }

            &.t-table__row--header {
                background-color: $grey;
            }
        }

        .t-table__button {
            cursor: pointer;
        }
    }
</style>
