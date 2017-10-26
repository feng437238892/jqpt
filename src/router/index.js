import Vue from 'vue'
import Router from 'vue-router'

import Default from '@/containers/default'
import Invoice from '@/containers/invoice'


Vue.use(Router)

const main = [
    {
      path: '/default',
      name: 'Default',
      component: Default
    },{
      path: '/invoice',
      name: 'Invoice',
      component: Invoice
    },{
      path: '*',
      redirect: '/default'
    }
  ]

const router = new Router({
  mode: 'history',
  routes: [...main]
})

export default router
