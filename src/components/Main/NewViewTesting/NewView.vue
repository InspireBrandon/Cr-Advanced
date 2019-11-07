<template>
  <v-container fluid class="pa-0 ma-0" grid-list-md>
    <v-layout class="pa-0 ma-0" row wrap>
      <v-flex md2 class="pa-0 ma-0" style="z-index: 1;">
        <v-card style="border-right: 1px solid lightgrey" class="scroll pa-1" height="calc(100vh - 64px)" tile>
          <v-text-field v-model="searchText" hide-details placeholder="Search..." append-icon="search" solo>
          </v-text-field>
          <RecursiveItem v-show="searchText.length == 0" v-if="routeController != null"
            :routeController="routeController" class="pa-0 ma-0 mt-2" parentID="0" />
          <SearchItems v-show="searchText.length > 0" :filterItems="filteredItems" />
        </v-card>
      </v-flex>
      <v-flex md10 class="pa-0 ma-0">
        <v-card flat tile height="calc(100vh - 64px)">
          <router-view :key="$route.fullPath" />
        </v-card>
      </v-flex>
    </v-layout>
    <SplashLoader ref="SplashLoader" />
  </v-container>
</template>

<script>
  import RouteController from "@/components/Main/NewViewTesting/RoutesForTesting/route-controller";
  import RecursiveItem from "../NewViewTesting/RoutesForTesting/RecursiveItem";
  import SearchItems from './RoutesForTesting/SearchItems'
  import RouteItem from "./RoutesForTesting/route-item";

  import SplashLoader from "@/components/Common/SplashLoader.vue";
  import jwt from "jsonwebtoken";
  import Axios from "axios";
  import StatusHandler from "@/libs/system/projectStatusHandler";

  export default {
    components: {
      RecursiveItem,
      SplashLoader,
      SearchItems
    },
    data() {
      return {
        hasDatabases: false,
        routeController: null,
        systemUserID: -1,
        searchText: '',
        allRouteItems: [],
        statusList: [],
        typeList: [],
        accessType: -1
      };
    },
    mounted() {
      let self = this;

      let statusHandler = new StatusHandler();
      self.statusList = statusHandler.getStatus()
      self.typeList = statusHandler.getTypeList()

      self.routeController = new RouteController({
        userType: 0
      });

      self.allRouteItems = self.routeController.getAllRouteItems();

      // self.getTaskViewData();
      // self.getStoreData();
      self.getAccessType();
      self.getStorePlanogramSimple();
    },
    computed: {
      filteredItems() {
        let self = this;

        if (self.searchText == '') {
          return self.allRouteItems;
        } else {
          return self.allRouteItems.filter(e => {
            return e.title.toUpperCase().indexOf(self.searchText.toUpperCase()) > -1;
          });
        }
      }
    },
    methods: {
      getAccessType() {
        let self = this;
        let encoded_details = jwt.decode(sessionStorage.accessToken);
        let systemUserID = encoded_details.USER_ID;

        Axios.get(
          process.env.VUE_APP_API +
          `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=1`
        ).then(r => {
          if (r.data.tenantLink_AccessTypeList != null && r.data.tenantLink_AccessTypeList.length > 0) {
            let accessType = r.data.tenantLink_AccessTypeList[0].accessType;
            let planoList = r.data.tenantLink_AccessTypeList[0].supplierPlanogramList;

            sessionStorage.accessType = accessType;

            self.accessType = accessType;
            self.planoList = planoList;
          } else if (r.data.isDatabaseOwner) {
            sessionStorage.accessType = 0;
            self.accessType = 0;
          }

          setTimeout(() => {
            self.getTaskViewData();
          }, 1000);

          self.$nextTick(() => {})
        });
      },
      getTaskViewData() {
        let self = this;

        self.$refs.SplashLoader.show();

        Axios.get(process.env.VUE_APP_API + "OutstandingTasks")
          .then(r => {
            r.data.projectTXList.forEach(el => {
              self.routeController.addRoute(self.processRoute(el));
            });
            self.$refs.SplashLoader.close()
          })
          .catch(e => {
            self.$refs.SplashLoader.close()
            alert("Failed to get outstanding tasks");
            console.error("Failed to get outstanding tasks. " + e);
          })
      },
      getStoreData() {
        let self = this;
        self.$nextTick(() => {
          Axios.defaults.headers.common["TenantID"] =
            sessionStorage.currentDatabase;

          Axios.get(
              process.env.VUE_APP_API + `Store_Planogram/Store?Store_ID=124526`
            )
            .then(r => {
              let currentStorePlanograms = [];
              currentStorePlanograms = r.data.queryResult;

              r.data.queryResult.forEach(e => {
                e.currentStatusText = self.routeController.addRoute(
                  self.processStoreRoute(e)
                );
              });
            })
            .catch(e => {
              console.log(e);
            });
        });
      },
      getStorePlanogramSimple() {
        let self = this;

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + "Store_Planogram_Simple")
          .then(r => {
            delete Axios.defaults.headers.common["TenantID"];
            r.data.forEach(el => {
              self.routeController.addRoute(self.processSPRoute(el));
              console.log(el);
            });
          })
          .catch(e => {
            console.error("Failed to get outstanding tasks. " + e);
          })
      },
      processSPRoute(item) {
        let self = this;

        let routeItem = new RouteItem({
          showChildren: false,
          id: item.storePlanogramID,
          parentID: "",
          title: item.name,
          route: `/StorePlanogram/${item.storeID}`,
          allowedAccessLevels: [
            accessTypes.SuperUser,
            accessTypes.Buyer
          ],
          routeType: RouteType.File
        });

        if (item.planogramStoreStatus == 2) {
          routeItem.parentID = "PLANOGRAM_AWAITING IMPLEMENTATION";
        }

        if (item.planogramStoreStatus == 3) {
          routeItem.parentID = "PLANOGRAM_AWAITING IMPLEMENTATION";
        }

        if (item.planogramStoreStatus == 4) {
          routeItem.parentID = "PLANOGRAM_AWAITING IMPLEMENTATION";
        }

        return routeItem;
      },
      processRoute(item) {
        let self = this;

        let routeItem = new RouteItem({
          showChildren: false,
          id: item.uid,
          parentID: "",
          title: "",
          route: `/TestingView/PlanogramImplementationNew/${item.planogram_ID}/${item.systemFileID}/1`,
          allowedAccessLevels: [
            accessTypes.SuperUser,
            accessTypes.Buyer
          ],
          routeType: RouteType.File
        });

        let type = self.typeList[item.type == -1 ? 5 : item.type].text.toUpperCase();
        let status = self.statusList[item.status == -1 ? 18 : item.status].text.toUpperCase();
        let type_status = type + "_" + status;
        routeItem.parentID = type_status;

        if (type == "PLANOGRAM") {
          routeItem.title = item.systemFileName;
          routeItem.route = `/PlanogramImplementationNew/${item.planogram_ID}/${item.systemFileID}/1`;

          if (status == "APPROVED") {
            routeItem.route = `/PlanogramDistribution/${item.project_Group_ID}/${item.project_ID}`;
          }
        }

        if (type == "RANGING") {
          routeItem.title = item.rangeFileName;
          routeItem.route = `/RangePlanningView/${item.rangeFileID}`;
        }

        return routeItem;
      },
      processStoreRoute(item) {
        let self = this;

        let routeItem = new RouteItem({
          showChildren: false,
          id: item.uid,
          parentID: "limbo",
          title: item.storeCluster + " - " + item.projectName,
          route: `/Tasks`,
          allowedAccessLevels: [
            accessTypes.SuperUser,
            accessTypes.Buyer
          ],
          routeType: RouteType.File
        });

        switch (item.planogramStoreStatus) {
          case 0: {}
          break;
        case 1: {}
        break;
        case 2: {
          routeItem.parentID = "PLANOGRAM_AWAITING_IMPLEMENTATION";
        }
        break;
        case 3: {
          routeItem.parentID = "PLANOGRAM_IMPLEMENTATION_IN_PROGRESS";
        }
        break;
        case 4: {
          routeItem.parentID = "PLANOGRAM_IMPLEMENTED";
        }
        break;
        }

        return routeItem;
      },
      processSharedRoutes(item) {
        let self = this;

        let routeItem = new RouteItem({
          showChildren: false,
          id: item.id,
          parentID: "limbo",
          title: item.displayname,
          route: `/Shared`,
          allowedAccessLevels: [accessTypes.SuperUser],
          routeType: RouteType.File
        });

        routeItem.parentID = "PLANOGRAM_SHARED";

        return routeItem;
      }
    }
  };

  const accessTypes = {
    SuperUser: 0,
    Buyer: 1,
    Supplier: 2,
    Store: 3,
  }

  const RouteType = {
    Folder: 0,
    File: 1,
    Software: 2
  };
</script>

<style scoped>
  .scroll {
    overflow-y: auto;
  }
</style>