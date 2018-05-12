<template>
    <section class="t-section">
        <t-client-create @clientCreate="addClientToList"></t-client-create>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                <div class="t-section__header margin--bottom--sm">
                    <h1 class="heading--h1 inline-block">Client catalog</h1>
                    <div class="pull-right">
                        <a href="javascript:void(0)" class="t-link" @click="toggleModal()">Add client</a>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="t-section__filter margin--bottom--lg">
                    <simple-text-filter :data="allClients" :propertyName="'name'" :placeholder="'Filter by name'"
                                        @textFiltered="showFilteredData($event)"></simple-text-filter>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="t-employee-grid-container margin--bottom--sm">
                    <t-client-grid :data="filteredClients"></t-client-grid>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue';
    import ClientGrid from './ClientGrid.vue';
    import SimpleTextFilter from './../common/SimpleTextFilter.vue';
    import ClientCreate from './ClientCreate.vue';
    const importedClients = require('./../../../../data/clients.json');

    export default Vue.component("t-clients", {
        components: [ClientGrid, SimpleTextFilter, ClientCreate],
        data() {
            return {
                allClients: [],
                filteredClients: []
            }
        },
        methods: {
            showFilteredData(filteredData = []) {
                this.filteredClients = filteredData;
            },
            toggleModal() {
                $("#t-client-create").modal("show");
            },
            addClientToList(newClient) {
                this.allClients = [...this.allClients, newClient];
                this.filteredClients = [...this.filteredClients, newClient];
            }
        },
        mounted() {
            this.allClients = importedClients;
            this.filteredClients = this.allClients;
        }
    });
</script>

<style lang="scss">

</style>