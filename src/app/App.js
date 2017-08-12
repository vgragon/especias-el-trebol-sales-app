import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import SalesSummary from './components/sales/Sales.vue';
import SalesDetail from './components/sales/SalesDetail.vue';
import Employees from './components/employees/Employees.vue';
import EmployeeDetail from './components/employees/EmployeeDetail.vue';
import Clients from './components/clients/Clients.vue';
import ClientDetail from './components/clients/ClientDetail.vue';

const routes = [{
        path: '/',
        redirect: '/sales'
    },
    {
        path: '/sales',
        component: SalesSummary,
        children: [{
            path: ':id',
            component: SalesDetail
        }]
    },
    {
        path: '/employees',
        component: Employees,
        children: [{
            path: ':id',
            component: EmployeeDetail
        }]
    },
    {
        path: '/clients',
        component: Clients,
        children: [{
            path: ':id',
            component: ClientDetail
        }]
    },
];

Vue.use(VueRouter);
const router = new VueRouter({
    routes
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
