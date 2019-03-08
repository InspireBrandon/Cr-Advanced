import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login/Index.vue'
import Register from '@/components/Register/Index.vue'
import Main from '@/components/Main/Index.vue'

// Main
import Home from '@/components/Main/Home/Index.vue'
import Apps from '@/components/Main/Apps/Index.vue'
import User from '@/components/Main/User/Index.vue'
import Store from '@/components/Main/Store/Index.vue'
import Settings from '@/components/Main/Settings/Index.vue'
import ReportShell from '@/views/Reports/Index.vue'
import Account from '@/components/Main/Account/Index.vue'

// Apps
import RangePlanning from '@/components/Apps/RangePlanning/Index.vue'

// App Details
import Space_Planning_Details from '@/views/App_Details/SPACE_PLANNING.vue'
import Range_Planning_Details from '@/views/App_Details/RANGE_PLANNING.vue'

//reports
import spaceReport1 from '@/views/Reports/SPACE-PLANNING-REPORTS/Report1/Report1.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/Login',
    name: 'login',
    component: Login
  }, {
    path: '/Register',
    name: 'register',
    component: Register
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
      path: '/Store',
      name: 'store',
      component: Store,
    }, {
      path: '/Settings',
      name: 'settings',
      component: Settings,
    }, {
      path: '/User',
      name: 'user',
      component: User,
    }, {
      path: '/RangePlanning',
      name: 'range_planning',
      component: RangePlanning,
    }, {
      path: '/SpacePlanning_Details',
      name: 'space_planning_details',
      component: Space_Planning_Details
    }, {
      path: '/RangePlanning_Details',
      name: 'range_planning_details',
      component: Range_Planning_Details
    }]
  }, {
    path: '/Reports',
    name: 'Reports',
    component: ReportShell,
    children: [{
      path: '/Reports/SpacePlanning/Report1',
      name: 'spaceReport1',
      component: spaceReport1
    }]

  }, ]
})