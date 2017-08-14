<template>
    <div class="modal fade" id="t-sales-create" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h2 class="modal-title heading--h2">Add sales record</h2>
                </div>
                <div class="modal-body">
                    <div class="pull-right margin--bottom--sm">
                        <em class="font-size--xs">Fields marked with <strong class="t-indicator--mandatory">*</strong>
                            are required.</em>
                    </div>
                    <div class="clearfix"></div>
                    <form class="t-form--create--employee">
                        <div class="form-group margin--bottom--md">
                            <label class="margin--bottom--xs">Employee</label><sup
                                class="t-indicator t-indicator--mandatory">*</sup>
                            <t-dropdown class="block" :data="employees" :displayProperty="['givenName', 'familyName']"
                                        @selectedOption="receiveSelectedOption('EMPLOYEE', $event)"></t-dropdown>
                        </div>
                        <div class="form-group margin--bottom--md">
                            <label class="margin--bottom--xs">Client</label><sup
                                class="t-indicator t-indicator--mandatory">*</sup>
                            <t-dropdown class="block" :data="clients" :displayProperty="'name'"
                                        @selectedOption="receiveSelectedOption('CLIENT', $event)"></t-dropdown>
                        </div>
                        <div class="form-group margin--bottom--md">
                            <label class="margin--bottom--xs">Sales amount (MXN)</label><sup
                                class="t-indicator t-indicator--mandatory">*</sup>
                            <input type="number" class="t-input--text" title="Amount" placeholder="Enter amount"
                                   @change="sale.amount = $event.target.value"/>
                        </div>
                        <div class="form-group margin--bottom--md">
                            <label class="margin--bottom--xs">Date</label><sup
                                class="t-indicator t-indicator--mandatory">*</sup>
                            <t-date-picker class="block" :id="'DATE_3'" :placeholder="'Select date'"
                                           @selectedOption="receiveSelectedOption('DATE', $event)"></t-date-picker>
                        </div>
                        <div class="form-group margin--bottom--md">
                            <label class="margin--bottom--xs">Notes</label>
                            <textarea class="t-textarea"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="t-button t-button--default margin--right--sm" data-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="t-button t-button--primary">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    const importedEmployees = require('../../../../data/employees.json');
    const importedClients = require('../../../../data/clients.json');

    export default Vue.component("t-sales-create", {
        data() {
            return {
                sale: {},
                employees: importedEmployees,
                clients: importedClients
            }
        },
        methods: {
            receiveSelectedOption(criteria, option) {
                switch (criteria) {
                    case "EMPLOYEE":
                        this.sale.employeeID = option.id;
                        break;
                    case "CLIENT":
                        this.sale.clientID = option.id;
                        break;
                    case "DATE":
                        this.sale.dateTime = option.toISOString();
                        break;
                }
            }
        }
    });
</script>

<style lang="scss">
    #t-sales-create {
        .modal-header {
            border-bottom: none;
        }

        .modal-footer {
            border-top: none;
        }

        .t-input--text {
            width: 222px;
        }
    }
</style>
