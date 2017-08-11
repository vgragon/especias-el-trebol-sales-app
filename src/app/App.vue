<template>
    <div class="app">
        <div class="t-body">
            <div class="t-navigation-container">
                <t-navigation></t-navigation>
            </div>
            <main class="t-main-container uk-grid padding--all--lg">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Navigation from './components/Navigation.vue';

    export default Vue.component("app", {
        components: {
            't-navigation': Navigation
        }
    });
</script>

<style lang="scss">
    @import './helpers';
    $bootstrap-sass-asset-helper: false;
    $icon-font-path: '../../node_modules/bootstrap-sass/assets/fonts/bootstrap/';
    @import '../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap';

    html {
        color: $black;
    }

    body {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        font-weight: lighter;
        background-color: $white;
    }

    .app {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .t-main-container {
        max-width: 1200px;
        margin: auto;
    }

    .router-link-active {
        opacity: 1;

        span {
            opacity: 1 !important;
            border-bottom: 3px solid $green !important;
        }
    }

    a {
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }
</style>
