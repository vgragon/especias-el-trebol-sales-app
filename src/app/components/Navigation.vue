<template>
    <div class="t-navigation background--almost-black">
        <div class="t-navigation__items" v-for="item in items">
            <router-link :to="item.route">
                <span class="font-size--md padding--bottom--xs padding--left--sm padding--right--sm color--white">{{item.name}}</span>
            </router-link>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.component("t-navigation", {
        data() {
            return {
                items: [
                    {name: 'Sales', route: '/sales'},
                    {name: 'Employees', route: '/employees'},
                    {name: 'Clients', route: '/clients'}
                ]
            }
        }
    });
</script>

<style lang="scss">
    .t-navigation {
        position: relative;
        width: 100%;
        border-bottom: 5px solid #2FC841;
        height: 100%;
        text-align: center;
        box-shadow: 0 0 1px #000;

        .t-navigation__items {
            display: inline-block;
            width: 20%;
            top: 25%;
            position: relative;
            max-width: 800px;

            span {
                cursor: pointer;
                opacity: 0.5;
                position: relative;
                transition: opacity 0.2s ease-in;
                letter-spacing: 1px;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>
