<template>
    <div class="app">
        <div class="t-body">
            <div class="t-navigation-container">
                <t-navigation></t-navigation>
            </div>
            <main class="t-main-container container padding--all--lg">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Navigation from './components/Navigation.vue';
    window.jQuery = window.$ = require('jquery');

    export default Vue.component("app", {
        components: {
            't-navigation': Navigation
        }
    });
</script>

<style lang="scss">
    @import './global';

    .t-navigation-container {
        width: 100%;
        height: 60px;
    }
</style>
