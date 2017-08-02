<template>
    <div class="app">
        <div class="t-body">
            <div class="t-navigation-container">
                <t-navigation></t-navigation>
            </div>
            <main class="t-main-container">
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
    @import '../../node_modules/uikit/dist/css/uikit.min.css';

    html {
        color: $black;
    }

    body {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        background-color: $white;
    }

    .app {
        width: 100%;
        height: 100%;
        position: relative;
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