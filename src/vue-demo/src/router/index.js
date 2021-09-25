import Vue from 'vue'
import VueRouter from 'vue-router'

import Table from '../views/table.vue'
import List from '../views/list.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'table',
    component: Table,
  },
  {
    path: '/List',
    name: 'list',
    component: List,
  }
]

const router = new VueRouter({
  routes
})

export default router
