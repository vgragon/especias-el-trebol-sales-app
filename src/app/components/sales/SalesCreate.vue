<template>
    <!--<div class="modal fade" id="t-sales-create" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">-->
    <!--<div class="modal-dialog" role="document">-->
    <!--<div class="modal-content">-->
    <!--<div class="modal-header">-->
    <!--<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span-->
    <!--aria-hidden="true">&times;</span></button>-->
    <!--<h2 class="modal-title heading&#45;&#45;h2">Add sales record</h2>-->
    <!--</div>-->
    <!--<div class="modal-body">-->
    <!--<div class="pull-right margin&#45;&#45;bottom&#45;&#45;sm">-->
    <!--<em class="font-size&#45;&#45;xs">Fields marked with <strong class="t-indicator&#45;&#45;mandatory">*</strong>-->
    <!--are required.</em>-->
    <!--</div>-->
    <!--<div class="clearfix"></div>-->
    <form class="t-form--create--sale padding--all--sm">
        <h2 class="heading--h2 margin--bottom--sm">Create new sale</h2>
        <div class="form-group margin--bottom--md">
            <label class="margin--bottom--xs">Date</label><sup
                class="t-indicator t-indicator--mandatory">*</sup>
            <t-date-picker class="block" :id="'DATE_3'" :placeholder="'Select date'"
                           :clean="[cleanFields]"
                           @selectedOption="receiveSelectedOption('DATE', $event)"></t-date-picker>
        </div>
        <div class="form-group margin--bottom--md">
            <label class="margin--bottom--xs">Employee</label><sup
                class="t-indicator t-indicator--mandatory">*</sup>
            <t-dropdown class="block" :data="employees" :displayProperty="['givenName', 'familyName']"
                        :clean="[cleanFields]"
                        @selectedOption="receiveSelectedOption('EMPLOYEE', $event)"></t-dropdown>
        </div>
        <div class="form-group margin--bottom--md">
            <label class="margin--bottom--xs">Client</label><sup
                class="t-indicator t-indicator--mandatory">*</sup>
            <t-dropdown class="block" :data="clients" :displayProperty="'name'" :clean="[cleanFields]"
                        @selectedOption="receiveSelectedOption('CLIENT', $event)"></t-dropdown>
        </div>
        <div class="form-group margin--bottom--md">
            <label class="margin--bottom--xs">Sales amount (MXN)</label><sup
                class="t-indicator t-indicator--mandatory">*</sup>
            <input type="number" class="t-input t-input--text t-input--small" title="Amount" placeholder="Enter amount"
                   @change="sale.amount = $event.target.value"/>
        </div>
        <div class="form-group margin--bottom--md">
            <label class="margin--bottom--xs">Notes</label>
            <textarea class="t-input t-textarea" title="Sales notes"
                      @change="sale.notes = $event.target.value"></textarea>
        </div>
        <div class="t-message t-message--error" v-if="errorMessages.length > 0">
            <div class="t-message--error__list">
                <div class="t-message--error__list__element" v-for="message in errorMessages">
                    <span>{{message}}</span>
                </div>
            </div>
        </div>
        <div class="form-group pull-right">
            <button type="button" class="t-button t-button--default margin--right--sm" @click="resetForm">
                Reset
            </button>
            <button type="button" class="t-button t-button--primary" @click="createSale">Save</button>
        </div>
        <div class="clearfix"></div>
    </form>
    <!--</div>-->
    <!--<div class="modal-footer">-->
    <!--<button type="button" class="t-button t-button&#45;&#45;default margin&#45;&#45;right&#45;&#45;sm" @click="resetForm"-->
    <!--data-dismiss="modal">-->
    <!--Cancel-->
    <!--</button>-->
    <!--<button type="button" class="t-button t-button&#45;&#45;primary" @click="createSale">Save</button>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
</template>

<script>
    import Vue from 'vue';
    import SalesService from './SalesService';
    const importedEmployees = require('../../../../data/employees.json');
    const importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-create", {
        data() {
            return {
                sale: {},
                employees: importedEmployees,
                clients: importedClients,
                errorMessages: [],
                cleanFields: [false]
            }
        },
        methods: {
            receiveSelectedOption(criteria, option) {
                switch (criteria) {
                    case "EMPLOYEE":
                        this.sale.employeeID = option ? option.id : undefined;
                        break;
                    case "CLIENT":
                        this.sale.clientID = option ? option.id : undefined;
                        break;
                    case "DATE":
                        this.sale.dateTime = option ? SalesService.toISOString(option) : undefined;
                        break;
                }
            },
            isSaleValid: function (sale) {
                let response = {};
                response.messages = [];
                if (typeof sale.employeeID === "undefined") {
                    response.isError = true;
                    response.messages.push("Please select an employee");
                }
                if (typeof sale.clientID === "undefined") {
                    response.isError = true;
                    response.messages.push("Please select a client");
                }
                if (typeof sale.amount === "undefined") {
                    response.isError = true;
                    response.messages.push("Please enter an amount");
                }
                if (typeof sale.dateTime === "undefined") {
                    response.isError = true;
                    response.messages.push("Please pick a date");
                }

                return response;
            },
            resetForm() {
                this.sale = {};
                this.cleanFields = [true];
                $(".t-form--create--sale").find(".t-input").val("");
//                $("#t-sales-create").find(".t-input").val();
            },
            createSale() {
                let response = this.isSaleValid(this.sale);
                if (response.isError) {
                    this.errorMessages = response.messages;
                    return;
                }
                this.errorMessages = [];
                this.sale.amount = Number.parseInt(this.sale.amount);

                this.sale.id = Math.random().toFixed(5) * 100000;
                this.$emit("saleCreate", this.sale);
                this.resetForm();
                $("#t-sales-create").modal("hide");
            }
        }
    });
</script>

<style lang="scss">
    .t-form--create--sale {
        border: 1px solid #f0f0f0;
    }

    #t-sales-create {
        .modal-header {
            border-bottom: none;
        }

        .modal-footer {
            border-top: none;
        }

        .t-input--text {
            width: 200px;
        }
    }
</style>
