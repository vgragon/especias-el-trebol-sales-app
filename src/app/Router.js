import Vue from 'vue';
import VueRouter from 'vue-router';

import SalesSummary from './components/sales/Sales.vue';
import SalesDetail from './components/sales/SalesDetail.vue';
import Employees from './components/employees/Employees.vue';
import EmployeeDetail from './components/employees/EmployeeDetail.vue';
import Clients from './components/clients/Clients.vue';
import ClientDetail from './components/clients/ClientDetail.vue';

Vue.use(VueRouter);

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

const router = new VueRouter({
    routes
});

export default router;