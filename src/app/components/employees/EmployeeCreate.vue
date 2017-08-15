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
                                    <input type="file" id="t-person__image-input" class="t-input--file"
                                           style="display: none;"/>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf2u0RWmYALKJ431XNoTKjzu77ERLBIvXKlOEA-Q3DPo2h2rCB"
                                         id="t-person__image--form" class="t-person__image--form margin--bottom--sm"/>
                                    <a class="t-link" @click="toggleImageSelection">Change image</a>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Given name</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="employee.givenName = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Family name</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="employee.familyName = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Telephone number</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="employee.telephoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Cellphone number</label>
                                    <input type="text" class="t-input--text"
                                           @change="employee.cellphoneNumber = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Primary email</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="employee.primaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Secondary email</label>
                                    <input type="text" class="t-input--text"
                                           @change="employee.secondaryEmail = $event.target.value"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="form-group margin--bottom--md">
                                    <label class="margin--bottom--xs">Home address</label><sup
                                        class="t-indicator t-indicator--mandatory">*</sup>
                                    <input type="text" class="t-input--text"
                                           @change="employee.homeAddress = $event.target.value"/>
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
    import Cropper from 'cropperjs';

    export default Vue.component("t-employee-create", {
        data() {
            return {
                employee: {},
                imageElement: undefined,
                cropper: undefined
            }
        },
        methods: {
            toggleImageSelection() {
                $("#t-person__image-input").click();
            },
            handleFileSelect(ev) {
                let file = ev.target.files[0];
                if (!!file) {
                    this.imageElement = document.getElementById("t-person__image--form");
                    this.getBase64(file).then((base64) => {
                        this.employee.image = base64;
                        this.imageElement.src = base64;
                    });
                }
            },
            getBase64(file) {
                return new Promise(function (resolve, reject) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function (error) {
                        reject(error);
                    };
                });
            }
        },
        mounted() {
            document.getElementById('t-person__image-input').addEventListener('change', this.handleFileSelect, false);
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

        .t-person__image--form {
            max-width: 100%;
            position: relative;
            width: 170px;
            height: 170px;
            border-radius: 100%;
            display: block;
            margin: auto;
            border: 8px solid #F0F0F0;
        }
    }
</style>
