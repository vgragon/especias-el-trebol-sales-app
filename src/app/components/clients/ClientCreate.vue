<template>
    <div class="modal fade" id="t-client-create" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h2 class="modal-title heading--h2">Add client</h2>
                </div>
                <div class="modal-body">
                    <div class="pull-right margin--bottom--sm">
                        <em class="font-size--xs">Fields marked with <strong class="t-indicator--mandatory">*</strong>
                            are required.</em>
                    </div>
                    <div class="clearfix"></div>
                    <form class="t-form--create--employee">
                        <div class="row">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Company name</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="client.name = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Primary telephone number</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="client.primaryTelephoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Secondary telephone number</label>
                                    <input type="text" class="t-input--text"
                                           @change="client.secondaryTelephoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Primary email</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="client.primaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Secondary email</label>
                                    <input type="text" class="t-input--text"
                                           @change="client.secondaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Home address</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="client.workAddress = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <label class="margin--bottom--xs">Notes</label>
                                <textarea class="t-textarea"></textarea>
                            </div>
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

    export default Vue.component("t-client-create", {
        data() {
            return {
                client: {},
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
                        this.sale.dateTime = option.startOf("day").toISOString();
                        break;
                }
            }
        }
    });
</script>

<style lang="scss">
    #t-client-create {
        .modal-header {
            border-bottom: none;
        }

        .modal-footer {
            border-top: none;
        }

        .t-input--text {
            width: 100%;
        }
    }
</style>
