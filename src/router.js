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
import Notifications from '@/components/Main/Notifications/Index.vue'
// Apps
import RangePlanning from '@/components/Apps/RangePlanning/Index.vue'
//import SpacePlanning from '@/components/Main/Planogram/spaceplanning/src/views/Main.vue'
import Fixtures from '@/components/Apps/SpacePlanning/Fixtures/Index.vue'

//Product maintainence
import DataPreparation from '@/components/Main/DataPreparation';
import DataPreparationViewSelection from '@/components/Main/DataPreparation/ViewSelection';

import PlanogramMaintenance from '@/components/Main/PlanogramMaintenance/Index.vue';
import PlanogramImplementation from '@/components/Main/PlanogramImplementation/Index.vue'
import RequestNewPlanogram from '@/components/Main/PlanogramImplementation/RequestNewPlanogram.vue'

// Images
import ProductCatalogue from '@/components/Main/DataPreparation/Views/ImagePreparation/ProductCatalogue';
import Tray from '@/components/Main/DataPreparation/Views/ImagePreparation/Tray';
import Shrink from '@/components/Main/DataPreparation/Views/ImagePreparation/Shrink';

// App Details
import Space_Planning_Details from '@/views/App_Details/SPACE_PLANNING.vue'
import Range_Planning_Details from '@/views/App_Details/RANGE_PLANNING.vue'
import Product_Maintainance_Details from '@/views/App_Details/PRODUCT_MAINTAINANCE.vue'
//spacePLanning
import SpacePlanning from '@/components/Main/Planogram/spaceplanning/src/views/Main'

import DataImport from '@/components/Apps/DataImport/Index.vue'
import DataImportSections from '@/components/Apps/DataImport/Sections.vue'
import ProductImport from '@/components/Apps/DataImport/Types/Product/Index.vue'
import SalesImport from '@/components/Apps/DataImport/Types/Sales/Index.vue'

import DataPrep from '@/components/Apps/DataPreparation/Index.vue'
import DataPrepSections from '@/components/Apps/DataPreparation/Sections.vue'
import ManufacturerMaint from '@/components/Apps/DataPreparation/Types/Manufacturer/Index.vue'

//reports
import AppsReportList from '@/components/Main/Reports/Apps/Index.vue'
import SystemReportList from '@/components/Main/Reports/System/Index.vue'

import SpacePlanningReportList from '@/components/Main/Reports/Apps/SpacePlanning/Index.vue'
import FixtureReport from '@/views/Reports/SPACE-PLANNING-REPORTS/FixtureReport/Index.vue'
import ProductFixtureReport from '@/views/Reports/SPACE-PLANNING-REPORTS/ProductFixtureReport/Index.vue'
import ProductReport from '@/views/Reports/SPACE-PLANNING-REPORTS/ProductReport/Index.vue'

import HelpFileView from '@/components/Main/HelpFile/Index.vue'
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
      path: '/SpacePlanning',
      name: 'space_planning',
      component: SpacePlanning
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
          path: '/Notifications',
          name: 'notifications',
          component: Notifications,
        }, {
          path: '/Account',
          name: 'account',
          component: Account,
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
          path: '/Fixtures',
          name: 'fixtures',
          component: Fixtures
        }, {
          path: '/SpacePlanning_Details',
          name: 'space_planning_details',
          component: Space_Planning_Details
        }, {
          path: '/RangePlanning_Details',
          name: 'range_planning_details',
          component: Range_Planning_Details
        }, {
          path: '/ProductMaintenance_Details',
          name: 'product_maintainance_details',
          component: Product_Maintainance_Details
        }, {
          path: '/HelpfileView',
          name: 'help_file_view',
          component: HelpFileView
        }, {
          path: '/AppsReportList',
          name: 'apps_report_list',
          component: AppsReportList
        }, {
          path: "/PlanogramImplementation",
          name: "planogram_implementation",
          component: PlanogramImplementation
        }, {
          path: "/PlanogramImplementation/RequestNewPlanogram/:IsNew",
          name: "request_new_planogram",
          component: RequestNewPlanogram
        },
        {
          path: "/PlanogramMaintenance",
          name: "planogram_maintenance",
          component: PlanogramMaintenance
        }, {
          path: '/SystemReportList',
          name: 'system_report_list',
          component: SystemReportList
        }, {
          path: '/SpacePlanningReportList',
          name: 'space_planning_report_list',
          component: SpacePlanningReportList
        }, {
          path: '/Reports/SpacePlanning/FixtureReport/:SystemFileID',
          name: 'fixture_Report',
          component: FixtureReport
        }, {
          path: '/Reports/SpacePlanning/ProductFixtureReport/:SystemFileID',
          name: 'product_fixture_report',
          component: ProductFixtureReport
        }, {
          path: '/Reports/SpacePlanning/ProductReport/:SystemFileID',
          name: 'product_report',
          component: ProductReport
        }, {
          path: '/ProductCatalogue',
          name: 'ProductCatalogue',
          component: ProductCatalogue
        },
        {
          path: '/DataImport',
          name: 'DataImport',
          component: DataImport,
          children: [{
            path: '',
            name: 'DataImportSections',
            component: DataImportSections,
          }, {
            path: 'Product',
            name: 'Product',
            component: ProductImport
          }, {
            path: 'Sales',
            name: 'Sales',
            component: SalesImport
          }]
        },        {
          path: '/DataPreparation',
          name: 'DataPrep',
          component: DataPrep,
          children: [{
            path: '',
            name: 'DataPrep',
            component: DataPrepSections,
          }, {
            path: 'Manufacturer',
            name: 'Manufacturer',
            component: ManufacturerMaint
          }]
        }
      ]
    },
    // {
    //   path: '/SpacePlanning',
    //   name: 'space_planning',
    //   component: SpacePlanning,
    // }
  ]
})