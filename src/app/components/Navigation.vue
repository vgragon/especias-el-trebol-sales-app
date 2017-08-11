<template>
    <div class="t-navigation background--grey">
        <div class="t-navigation__items" v-for="item in items">
            <router-link :to="item.route">
                <span class="font-size--sm padding--bottom--xs padding--left--sm padding--right--sm color--black">{{item.name}}</span>
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
        max-height: 50px;
        width: 100%;
        height: 40%;
        text-align: center;
        box-shadow: 0 0 1px #000;

        .t-navigation__items {
            display: inline-block;
            width: 20%;
            height: 100%;
            max-width: 800px;

            span {
                cursor: pointer;
                opacity: 0.5;
                position: relative;
                top: 25%;
                border-bottom: 2px solid transparent;
                transition: opacity 0.2s ease-in, border-bottom 0.1s ease-in;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>