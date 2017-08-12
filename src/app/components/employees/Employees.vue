<template>
    <section class="t-section">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div class="t-section__header margin--bottom--sm">
                    <h1 class="heading--h1 inline-block">Employee catalog</h1>
                    <div class="pull-right"><a class="t-link">Add employee</a></div>
                    <div class="clearfix"></div>
                </div>
                <div class="t-section__filter margin--bottom--lg">
                    <simple-text-filter :data="allEmployees" :propertyName="'fullName'" :placeholder="'Filter by name'"
                                        @textFiltered="showFilteredData($event)"></simple-text-filter>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="t-employee-grid-container margin--bottom--sm">
                    <t-employee-grid :data="filteredEmployees"></t-employee-grid>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue';
    import EmployeeGrid from './../common/SimpleTextFilter.vue';
    import SimpleTextFilter from './EmployeeGrid.vue';
    const importedEmployees = require('./../../../../data/employees.json');

    export default Vue.component("t-employees", {
        components: [
            EmployeeGrid, SimpleTextFilter
        ],
        data() {
            return {
                allEmployees: [],
                filteredEmployees: []
            }
        },
        methods: {
            showFilteredData(filteredData = []) {
                this.filteredEmployees = [...filteredData];
            }
        },
        mounted() {
            this.allEmployees = importedEmployees.map(employee => {
                employee["fullName"] = employee.givenName + " " + employee.familyName;
                return employee;
            });

            this.filteredEmployees = this.allEmployees;
        }
    });
</script>

<style lang="scss">

</style>
