<template>
    <div class="t-person-detail" v-if="person">
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
        <div class="align-center">
            <t-image-select :id="'t-employee-image--existing'" :clean="[cleanFields]" v-if="isEditModeEnabled"
                            :defaultImage="defaultImage"
                            @imageSelect="receiveSelectedImage($event)"></t-image-select>
            <div class="t-person-detail__image" v-if="!isEditModeEnabled"
                 :style="{'background-image': 'url(' + (person.image || defaultImage) + ')'}">
            </div>
            <div class="t-person-detail__alias margin--top--sm margin--bottom--lg font-size--md">
                <span v-if="!isEditModeEnabled" class="font-size--md">{{person.alias}}</span>
                <input type="text" class="t-input--text font-size--md" title="Alias"
                       placeholder="Define an alias here" @change="person.alias = $event.target.value"
                       v-if="isEditModeEnabled" :value="person.alias"/>
            </div>
        </div>
        <div class="t-person-detail__info margin--bottom--md">
            <div class="t-person-detail__info__name margin--bottom--md">
                <label>Company name</label>
                <input type="text" class="t-input--text" title="Company name"
                       @change="person.name = $event.target.value" :readonly="!isEditModeEnabled"
                       :value="person.name"/>
            </div>
            <div class="t-person-detail__info__phone margin--bottom--md">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Telephone number</label>
                        <input type="text" class="t-input--text" title="Telephone number"
                               :readonly="!isEditModeEnabled"
                               @change="person.primaryTelephoneNumber = $event.target.value"
                               :value="person.primaryTelephoneNumber"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Cellphone number</label>
                        <input type="text" class="t-input--text" title="Cellphone number"
                               :readonly="!isEditModeEnabled"
                               @change="person.secondaryTelephoneNumber = $event.target.value"
                               :value="person.secondaryTelephoneNumber"/>
                    </div>
                </div>
            </div>
            <div class="t-person-detail__info__email margin--bottom--md">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Primary email</label>
                        <input type="text" class="t-input--text" title="Primary email"
                               :readonly="!isEditModeEnabled" @change="person.primaryEmail = $event.target.value"
                               :value="person.primaryEmail"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Secondary email</label>
                        <input type="text" class="t-input--text" title="Secondary email"
                               :readonly="!isEditModeEnabled" @change="person.secondaryEmail = $event.target.value"
                               :value="person.secondaryEmail"/>
                    </div>
                </div>
            </div>
            <div class="t-person-detail__info__address margin--bottom--md">
                <label>Address</label>
                <input type="text" class="t-input--text" title="Address" :readonly="!isEditModeEnabled"
                       :value="person.workAddress" @change="person.workAddress = $event.target.value"/>
            </div>
            <div class="t-person-detail__info__notes">
                <label>Notes</label>
                <textarea class="t-textarea" title="Notes" :readonly="!isEditModeEnabled"
                          :value="person.notes" @change="person.notes = $event.target.value"></textarea>
            </div>
        </div>
        <div class="pull-left">
            <button class="t-button t-button--danger margin--right--sm" v-if="isEditModeEnabled" @click="deleteClient">
                Delete
            </button>
        </div>
        <div class="pull-right">
            <button class="t-button t-button--primary margin--right--sm" v-if="isEditModeEnabled" @click="resetForm">
                Reset
            </button>
            <button class="t-button t-button--primary" v-if="isEditModeEnabled">Save</button>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import PersonService from '../common/PersonService';
    const importedClients = require('./../../../../data/clients.json');

    export default Vue.component("t-client-detail", {
        data() {
            return {
                person: undefined,
                defaultImage: "http://cdn.onlinewebfonts.com/svg/img_242128.svg",
                originalPerson: undefined,
                cleanFields: [false],
                isEditModeEnabled: false
            };
        },
        methods: {
            receiveSelectedImage(base64) {
                if (typeof base64 !== "undefined") {
                    this.person.image = base64;
                }
            },
            deleteClient() {
                this.$router.replace("/clients/");
            },
            saveClient() {
                let response = PersonService.isClientValid(this.employee);
                if (response.isError) {
                    this.errorMessages = response.messages;
                    return;
                }

                this.originalPerson = Object.assign({}, this.person);
                this.isEditModeEnabled = false;
            },
            resetForm() {
                this.person = Object.assign({}, this.originalPerson);
            }
        },
        mounted() {
            let id = Number.parseInt(this.$route.params.id);
            this.originalPerson = importedClients.find(client => client.id === id);
            this.person = Object.assign({}, this.originalPerson);
        }
    });
</script>