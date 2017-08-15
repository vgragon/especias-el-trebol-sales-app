<template>
    <section class="t-section">
        <t-employee-create></t-employee-create>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                <div class="t-section__header margin--bottom--sm">
                    <h1 class="heading--h1 inline-block">Employee catalog</h1>
                    <div class="pull-right">
                        <a href="javascript:void(0)" class="t-link" @click="toggleModal()">Add employee</a>
                    </div>
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
    import EmployeeCreate from './EmployeeCreate.vue';
    const importedEmployees = require('./../../../../data/employees.json');
    import Bootstrap from 'bootstrap-sass';

    export default Vue.component("t-employees", {
        components: [
            EmployeeGrid, SimpleTextFilter, EmployeeCreate
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
            },
            toggleModal() {
                $("#t-employee-create").modal("show");
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