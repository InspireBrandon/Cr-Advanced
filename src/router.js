import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login/Index.vue'
import Register from '@/components/Register/Index.vue'
import Main from '@/components/Main/Index.vue'
import Maint from '@/components/Maint/Index.vue'

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
import Testing from '@/components/Main/Testing.vue'
import Graphs from '@/components/Main/Graphs/Graphs.vue'

//Product maintainence
import DataPreparation from '@/components/Main/DataPreparation';
import DataPreparationViewSelection from '@/components/Main/DataPreparation/ViewSelection';

import PlanogramDetailTool from '@/components/Main/PlanogramImplementation/PlanogramDetailTool.vue'
import PlanogramImplementation from '@/components/Main/PlanogramImplementation/Index.vue'
import PlanogramDistribution from '@/components/Main/PlanogramImplementation/PlanogramOverView/StorePlanogramOverview.vue'
import RequestNewPlanogram from '@/components/Main/PlanogramImplementation/RequestNewPlanogram.vue'

// Images
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

import ProductImport from '@/components/Apps/DataImport/Types/Product Master/Index.vue'
import SalesImport from '@/components/Apps/DataImport/Types/Product Sales/Index.vue'
import NewProducts from '@/components/Apps/DataImport/Types/New Products/Index.vue'

import DataPrep from '@/components/Apps/DataPreparation/Index.vue'
import DataPrepSections from '@/components/Apps/DataPreparation/Sections.vue'
import ManufacturerMaint from '@/components/Apps/DataPreparation/Types/Manufacturer/Index.vue'
import BrandMaint from '@/components/Apps/DataPreparation/Types/Brand/Index.vue'
import Supergroup_AMaint from '@/components/Apps/DataPreparation/Types/Supergroup_A/Index.vue'
import Supergroup_BMaint from '@/components/Apps/DataPreparation/Types/Supergroup_B/Index.vue'
import DepartmentMaint from '@/components/Apps/DataPreparation/Types/Department/Index.vue'
import SupplierMaint from '@/components/Apps/DataPreparation/Types/Supplier/Index.vue'
import SegmentMaint from '@/components/Apps/DataPreparation/Types/Segment/Index.vue'
import Item_StatusMaint from '@/components/Apps/DataPreparation/Types/Item_Status/Index.vue'
import Active_Shop_CodeMaint from '@/components/Apps/DataPreparation/Types/Active_Shop_Code/Index.vue'
import Retail_ChainMaint from '@/components/Apps/DataPreparation/Types/Retail_Chain/Index.vue'
import PeriodMaint from '@/components/Apps/DataPreparation/Types/Period/Index.vue'
import StoreMaint from '@/components/Apps/DataPreparation/Types/Store/Index.vue'
import PlanogramMaintenance from '@/components/Apps/DataPreparation/Types/PlanogramMaintenance/Index.vue';
import ProductCatalogue from '@/components/Apps/DataPreparation/Types/ProductCatalogue/ProductCatalogue.vue';


//projectPlanning
import ProjectPlanning from '@/components/Apps/ProjectPlanning/Index.vue';
import Drawer from '@/components/Apps/ProjectPlanning/Drawer.vue';
import Allocation from '@/components/Apps/ProjectPlanning/Allocation.vue';
import MeetingsAndWorkshops from '@/components/Apps/ProjectPlanning/MeetingsAndWorkshops/Index.vue';

//reports
import AppsReportList from '@/components/Main/Reports/Apps/Index.vue'
import SystemReportList from '@/components/Main/Reports/System/Index.vue'

import SpacePlanningReportList from '@/components/Main/Reports/Apps/SpacePlanning/Index.vue'
import FixtureReport from '@/views/Reports/SPACE-PLANNING-REPORTS/FixtureReport/Index.vue'
import ProductFixtureReport from '@/views/Reports/SPACE-PLANNING-REPORTS/ProductFixtureReport/Index.vue'
import ProductReport from '@/views/Reports/SPACE-PLANNING-REPORTS/ProductReport/Index.vue'

import HelpFileView from '@/components/Main/HelpFile/Index.vue'
import Tasks from '@/components/Main/Tasks/Switcher.vue';

import ProductListing from '@/components/Apps/RangePlanning/ProductListing/Index.vue';

// Floor Planning
import FloorPlanning from '@/components/Main/FloorPlanning/index.vue'

import Fixture_Type from '@/components/Main/Fixture_type/Fixture_Type.vue'

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
      path: '/Maint',
      name: 'maint',
      component: Maint
    }, {
      path: '/SpacePlanning',
      name: 'space_planning',
      component: SpacePlanning
    }, {
      path: '/FloorPlanning',
      name: 'floor_planning',
      component: FloorPlanning
    }, {
      path: '/Menu',
      name: 'main',
      component: Main,
      children: [{
          path: '/ProductListing',
          name: 'ProductListing',
          component: ProductListing
        },
        {
          path: '/Fixture_Type',
          name: 'Fixture_Type',
          component: Fixture_Type
        },
        {
          path: '/Testing',
          name: 'Testing',
          component: Testing
        }, {
          path: '/Graphs',
          name: 'Graphs',
          component: Graphs
        }, {
          path: '/Home',
          name: 'home',
          component: Home
        }, {
          path: '/Apps',
          name: 'apps',
          component: Apps,
        }, {
          path: '/Tasks',
          name: 'tasks',
          component: Tasks
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
          path: '/RangePlanning/:rangeFileID',
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
          path: "/PlanogramImplementation/",
          name: "planogram_implementation",
          component: PlanogramImplementation
        }, {
          path: "/PlanogramDistribution/:ProjectID/:projectGroupID",
          name: "Planogram_distribution",
          component: PlanogramDistribution
        },
        {
          path: "/PlanogramDetailTool",
          name: "planogram_detail_tool",
          component: PlanogramDetailTool
        },
        {
          path: "/PlanogramImplementation/:projectTransactionID/:planogramID/:status",
          name: "planogram_implementation",
          component: PlanogramImplementation
        }, {
          path: "/PlanogramImplementation/RequestNewPlanogram/:IsNew",
          name: "request_new_planogram",
          component: RequestNewPlanogram
        },
        {
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
        },
        {
          path: "/Allocation/:projectID",
          name: "Allocation",
          component: Allocation
        },
        {
          path: "/MeetingsAndWorkshops",
          name: "meetings_and_workshops",
          component: MeetingsAndWorkshops
        },
        {
          path: "/ProjectPlanning",
          name: "project_planning",
          component: ProjectPlanning,
          children: [{
            path: "/Drawer",
            name: "Drawer",
            component: Drawer
          }]
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
            path: 'Product Master',
            name: 'Product',
            component: ProductImport
          }, {
            path: 'Product Sales',
            name: 'Sales',
            component: SalesImport
          }, {
            path: 'New Products',
            name: 'new products',
            component: NewProducts
          }]
        },
        {
          path: '/DataPreparation',
          name: 'DataPrep',
          component: DataPrep,
          children: [{
            path: '',
            name: 'DataPrep',
            component: DataPrepSections,
            children: [{
              path: 'Manufacturer',
              name: 'Manufacturer',
              component: ManufacturerMaint
            }, {
              path: 'Brand',
              name: 'Brand',
              component: BrandMaint
            }, {
              path: 'Supergroup_A',
              name: 'Supergroup_A',
              component: Supergroup_AMaint
            }, {
              path: 'Supergroup_B',
              name: 'Supergroup_B',
              component: Supergroup_BMaint
            }, {
              path: 'Department',
              name: 'Department',
              component: DepartmentMaint
            }, {
              path: 'Supplier',
              name: 'Supplier',
              component: SupplierMaint
            }, {
              path: 'Segment',
              name: 'Segment',
              component: SegmentMaint
            }, {
              path: 'Item_Status',
              name: 'Item_Status',
              component: Item_StatusMaint
            }, {
              path: 'Active_Shop_Code',
              name: 'Active_Shop_Code',
              component: Active_Shop_CodeMaint
            }, {
              path: 'Retail_Chain',
              name: 'Retail_Chain',
              component: Retail_ChainMaint
            }, {
              path: 'Period',
              name: 'Period',
              component: PeriodMaint
            }, {
              path: 'Store',
              name: 'Store',
              component: StoreMaint
            }, {
              path: "PlanogramMaintenance",
              name: "planogram_maintenance",
              component: PlanogramMaintenance
            }, {
              path: 'ProductCatalogue',
              name: 'ProductCatalogue',
              component: ProductCatalogue
            }]
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