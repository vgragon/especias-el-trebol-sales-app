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
                    <form class="t-form--create--client">
                        <div class="row">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div class="align-center margin--bottom--lg">
                                        <t-image-select :id="'t-client-image--new'" :clean="cleanFields"
                                                        :defaultImage="defaultImage"
                                                        @imageSelect="receiveSelectedImage($event)"></t-image-select>
                                    </div>
                                </div>
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Company name</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input t-input--text" title="Company name"
                                           @change="client.name = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Primary telephone number</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="tel" class="t-input t-input--text" title="Primary telephone number"
                                           @change="client.primaryTelephoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Secondary telephone number</label>
                                    <input type="tel" class="t-input t-input--text" title="Secondary telephone number"
                                           @change="client.secondaryTelephoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Primary email</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="email" class="t-input t-input--text" title="Primary email"
                                           @change="client.primaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Secondary email</label>
                                    <input type="email" class="t-input t-input--text" title="Secondary email"
                                           @change="client.secondaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Work address</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input t-input--text" title="Work address"
                                           @change="client.workAddress = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <label class="margin--bottom--xs">Notes</label>
                                <textarea class="t-input t-textarea" title="Notes"></textarea>
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
                    <button type="button" class="t-button t-button--primary" @click="createClient">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import PersonService from '../common/PersonService';
    import ImageSelect from '../common/ImageSelect.vue';

    export default Vue.component("t-client-create", {
        components: [ImageSelect],
        data() {
            return {
                client: {},
                defaultImage: "http://cdn.onlinewebfonts.com/svg/img_242128.svg",
                cleanFields: [false],
                errorMessages: []
            }
        },
        methods: {
            resetForm() {
                this.client = {};
                this.cleanFields = [true];
                $("#t-client-create").find(".t-input").val("");
            },
            receiveSelectedImage(base64) {
                if (typeof base64 !== "undefined") {
                    this.client.image = base64;
                }
            },
            isStringEmptyOrUndefined(string) {
                return !string || (!!string && !string.trim());
            },
            createClient() {
                let response = PersonService.isClientValid(this.client);
                if (response.isError) {
                    this.errorMessages = response.messages;
                    return;
                }
                this.client.id = Math.random().toFixed(5) * 100000;
                this.client.image = this.client.image || this.defaultImage;
                this.errorMessages = [];
                this.$emit("clientCreate", this.client);
                this.resetForm();
                $("#t-client-create").modal("hide");
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
