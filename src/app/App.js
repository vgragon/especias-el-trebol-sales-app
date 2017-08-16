import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import SalesSummary from './components/sales/Sales.vue';
import SalesDetail from './components/sales/SalesDetail.vue';
import Employees from './components/employees/Employees.vue';
import EmployeeDetail from './components/employees/EmployeeDetail.vue';
import Clients from './components/clients/Clients.vue';
import ClientDetail from './components/clients/ClientDetail.vue';

const routes = [
    {
        path: '/',
        redirect: '/sales'
    },
    {
        path: '/sales',
        component: SalesSummary
    },
    {
        path: '/sales/:criteria/:dateTime',
        name: 'SalesDetail',
        component: SalesDetail
    },
    {
        path: '/employees',
        component: Employees,
    },
    {
        path: '/employees/:id',
        name: 'EmployeeDetail',
        component: EmployeeDetail
    },
    {
        path: '/clients',
        component: Clients
    },
    {
        path: '/clients/:id',
        name: 'ClientDetail',
        component: ClientDetail
    }
];

Vue.use(VueRouter);
const router = new VueRouter({
    routes
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
