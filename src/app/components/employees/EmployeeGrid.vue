<template>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4" v-for="person in data">
                    <div class="t-person margin--bottom--sm">
                        <div class="t-person__info">
                            <div class="t-person__info__name">
                                <router-link :to="{ name: 'EmployeeDetail', params: { id: person.id }}">
                                    <span>{{person.givenName}}</span>
                                    <span>{{person.familyName}}</span>
                                </router-link>
                            </div>
                            <div class="t-person__action">
                                <router-link :to="{ name: 'EmployeeDetail', params: { id: person.id }}">
                                    <a class="t-link">See detail</a>
                                </router-link>
                            </div>
                        </div>
                        <router-link :to="{ name: 'EmployeeDetail', params: { id: person.id }}">
                            <div class="t-person__image"
                                 :style="{'background-image': 'url(' + (person.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf2u0RWmYALKJ431XNoTKjzu77ERLBIvXKlOEA-Q3DPo2h2rCB') + ')'}"></div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.component("t-employee-grid", {
        props: ['data']
    });
</script>