<template>
    <div class="modal fade" id="t-employee-create" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h2 class="modal-title heading--h2">Add employee</h2>
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
                                <div class="align-center margin--bottom--lg">
                                    <t-image-select :id="'t-employee-image--new'" :clean="[cleanFields]"
                                                    :defaultImage="defaultImage"
                                                    @imageSelect="receiveSelectedImage($event)"></t-image-select>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">First name</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input t-input--text" title="First name"
                                           @change="employee.givenName = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Last name</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input t-input--text" title="Last name"
                                           @change="employee.familyName = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Telephone number</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="tel" class="t-input t-input--text" title="Telephone number"
                                           @change="employee.telephoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Cellphone number</label>
                                    <input type="tel" class="t-input t-input--text" title="Cellphone number"
                                           @change="employee.cellphoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Primary email</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="email" class="t-input t-input--text" title="Primary email"
                                           @change="employee.primaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Secondary email</label>
                                    <input type="email" class="t-input t-input--text" title="Secondary email"
                                           @change="employee.secondaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Home address</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input t-input--text" title="Home address"
                                           @change="employee.homeAddress = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Notes</label>
                                    <textarea class="t-input t-textarea" title="Notes"
                                              @change="employee.notes = $event.target.value"></textarea>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="t-message t-message--error" v-if="errorMessages.length > 0">
                                    <div class="t-message--error__list">
                                        <div class="t-message--error__list__element" v-for="message in errorMessages">
                                            <span>{{message}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="t-button t-button--default margin--right--sm" data-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="t-button t-button--primary" @click="createEmployee">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import ImageSelect from '../common/ImageSelect.vue';

    export default Vue.component("t-employee-create", {
        components: [ImageSelect],
        data() {
            return {
                employee: {},
                defaultImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf2u0RWmYALKJ431XNoTKjzu77ERLBIvXKlOEA-Q3DPo2h2rCB",
                cleanFields: [false],
                errorMessages: []
            }
        },
        methods: {
            resetForm() {
                this.employee = {};
                this.cleanFields = [true];
                $("#t-employee-create").find(".t-input").val("");
            },
            receiveSelectedImage(base64) {
                if (typeof base64 !== "undefined") {
                    this.employee.image = base64;
                }
            },
            isStringEmptyOrUndefined(string) {
                return !string || (!!string && !string.trim());
            },
            isEmployeeValid: function (employee) {
                let response = {};
                response.messages = [];
                if (this.isStringEmptyOrUndefined(employee.givenName)) {
                    response.isError = true;
                    response.messages.push("Please enter the first name");
                }
                if (this.isStringEmptyOrUndefined(employee.familyName)) {
                    response.isError = true;
                    response.messages.push("Please enter the last name");
                }
                if (this.isStringEmptyOrUndefined(employee.telephoneNumber)) {
                    response.isError = true;
                    response.messages.push("Please enter a telephone number");
                }
                if (this.isStringEmptyOrUndefined(employee.primaryEmail)) {
                    response.isError = true;
                    response.messages.push("Please enter a primary email");
                }
                if (this.isStringEmptyOrUndefined(employee.homeAddress)) {
                    response.isError = true;
                    response.messages.push("Please enter a home address");
                }

                return response;
            },
            createEmployee() {
                let response = this.isEmployeeValid(this.employee);
                if (response.isError) {
                    this.errorMessages = response.messages;
                    return;
                }
                this.employee.id = Math.random().toFixed(5) * 100000;
                this.employee.image = this.employee.image || this.defaultImage;
                this.errorMessages = [];
                this.$emit("employeeCreate", this.employee);
                this.resetForm();
                $("#t-employee-create").modal("hide");
            }
        }
    });
</script>

<style lang="scss">
    @import '../../variables';

    #t-employee-create {
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
