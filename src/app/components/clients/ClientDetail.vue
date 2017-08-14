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
        <div class="t-person-detail__image"
             :style="{'background-image': 'url(' + (person.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf2u0RWmYALKJ431XNoTKjzu77ERLBIvXKlOEA-Q3DPo2h2rCB') + ')'}"></div>
        <div class="t-person-detail__alias margin--top--sm margin--bottom--lg font-size--md">
            <span v-if="!isEditModeEnabled">{{person.alias}}</span>
            <input type="text" class="t-input--text font-size--md" title="Alias"
                   v-if="isEditModeEnabled" :value="person.alias"/>
        </div>
        <div class="t-person-detail__info margin--bottom--md">
            <div class="t-person-detail__info__name margin--bottom--md">
                <label>Company name</label>
                <input type="text" class="t-input--text" title="Company name" :readonly="!isEditModeEnabled"
                       :value="person.name"/>
            </div>
            <div class="t-person-detail__info__phone margin--bottom--md">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Telephone number</label>
                        <input type="text" class="t-input--text" title="Telephone number"
                               :readonly="!isEditModeEnabled"
                               :value="person.primaryTelephoneNumber"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Cellphone number</label>
                        <input type="text" class="t-input--text" title="Cellphone number"
                               :readonly="!isEditModeEnabled"
                               :value="person.secondaryTelephoneNumber"/>
                    </div>
                </div>
            </div>
            <div class="t-person-detail__info__email margin--bottom--md">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Primary email</label>
                        <input type="text" class="t-input--text" title="Primary email"
                               :readonly="!isEditModeEnabled"
                               :value="person.primaryEmail"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>Secondary email</label>
                        <input type="text" class="t-input--text" title="Secondary email"
                               :readonly="!isEditModeEnabled"
                               :value="person.secondaryEmail"/>
                    </div>
                </div>
            </div>
            <div class="t-person-detail__info__address margin--bottom--md">
                <label>Address</label>
                <input type="text" class="t-input--text" title="Address" :readonly="!isEditModeEnabled"
                       :value="person.workAddress"/>
            </div>
            <div class="t-person-detail__info__notes">
                <label>Notes</label>
                <textarea class="t-textarea" title="Notes" :readonly="!isEditModeEnabled"
                          :value="person.notes"></textarea>
            </div>
        </div>
        <div class="pull-right">
            <button class="t-button t-button--primary" v-if="isEditModeEnabled">Save</button>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    const importedEmployees = require('./../../../../data/clients.json');

    export default Vue.component("t-client-detail", {
        data() {
            return {
                person: undefined,
                isEditModeEnabled: false
            };
        },
        mounted() {
            let id = this.$route.params.id;
            this.person = importedEmployees.find(employee => employee.id === id);
            console.log(this.person);
        }
    });
</script>