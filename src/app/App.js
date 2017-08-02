import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import SalesSummary from './components/Sales.vue';

const routes = [
    {path: '/', redirect: '/sales'},
    {path: '/sales', component: SalesSummary},
];

Vue.use(VueRouter);
const router = new VueRouter({routes});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');