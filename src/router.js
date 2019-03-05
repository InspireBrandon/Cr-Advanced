import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login/Index.vue'
import Main from '@/components/Main/Index.vue'

// Main
import Home from '@/components/Main/Home/Index.vue'
import Apps from '@/components/Main/Apps/Index.vue'
import User from '@/components/Main/User/Index.vue'

// Apps
import RangePlanning from '@/components/Apps/RangePlanning/Index.vue'

// App Details
import Space_Planning_Details from '@/views/App_Details/SPACE_PLANNING.vue'
import Range_Planning_Details from '@/views/App_Details/RANGE_PLANNING.vue'



Vue.use(Router)

export default new Router({
  routes: [{
    path: '/Login',
    name: 'login',
    component: Login
  }, {
    path: '/Menu',
    name: 'main',
    component: Main,
    children: [{
      path: '/Home',
      name: 'home',
      component: Home
    }, {
      path: '/Apps',
      name: 'apps',
      component: Apps,
    }, {
      path: '/User',
      name: 'user',
      component: User,
    }, {
      path: '/SPACE_PLANNING_DETAILS',
      name: 'space_planning_details',
      component: Space_Planning_Details
    }, {
      path: '/RANGE_PLANNING_DETAILS',
      name: 'range_planning_details',
      component: Range_Planning_Details
    }]
  }, {
    path: '/RangePlanning',
    name: 'range_planning',
    component: RangePlanning,
  }]
})