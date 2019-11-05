<template>
  <v-container fluid class="pa-0 ma-0" grid-list-md>
    <v-layout class="pa-0 ma-0" row wrap>
      <v-flex md2 class="pa-0 ma-0">
        <v-card
          style="border-right: 1px solid grey"
          class="scroll"
          height="calc(100vh - 64px)"
          tile
        >
          <RecursiveItem
            v-if="routeController != null"
            :routeController="routeController"
            class="pa-0 ma-0"
            parentID="0"
          />
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
import RouteItem from "./RoutesForTesting/route-item";

import SplashLoader from "@/components/Common/SplashLoader.vue";
import jwt from "jsonwebtoken";
import Axios from "axios";
import StatusHandler from "@/libs/system/projectStatusHandler";

export default {
  components: {
    RecursiveItem,
    SplashLoader
  },
  data() {
    return {
      hasDatabases: false,
      routeController: null,
      systemUserID: -1
    };
  },
  mounted() {
    let self = this;

    self.routeController = new RouteController({
      userType: 0
    });

    self.getTaskViewData();
    self.getStoreData();
    self.getAccessType();
  },
  methods: {
    getAccessType() {
      let self = this;
      let encoded_details = jwt.decode(sessionStorage.accessToken);
      let systemUserID = encoded_details.USER_ID;

      Axios.get(
        process.env.VUE_APP_API +
          `TenantLink_AccessType?systemUserID=26&tenantID=1`
      ).then(r => {
        console.log(r.data);

        if (r.data.tenantLink_AccessTypeList.length > 0) {
          let planoList = r.data.tenantLink_AccessTypeList[0];

          planoList.supplierPlanogramList.forEach(element => {
            self.getPlanograms(element.planogram_ID);
          });
        }
      });
    },
    getPlanograms(planogram_ID) {
      let self = this;

      Axios.get(
        process.env.VUE_APP_API + `Planogram?planogramID=${planogram_ID}`
      ).then(r => {
        console.log("planogram", r.data);
        self.routeController.addRoute(self.processSharedRoutes(r.data[0]));
      });
    },
    getTaskViewData() {
      let self = this;
      let encoded_details = jwt.decode(sessionStorage.accessToken);
      let systemUserID = encoded_details.USER_ID;
      self.$refs.SplashLoader.show();
      self.$nextTick(() => {
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        Axios.get(
          process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`
        )
          .then(r => {
            r.data.projectTXList.forEach(el => {
              self.routeController.addRoute(self.processRoute(el));
            });

            // self.routeController.refreshRoutes();

            delete Axios.defaults.headers.common["TenantID"];
            self.$refs.SplashLoader.close();
          })
          .catch(e => {
            self.$refs.SplashLoader.close();
            delete Axios.defaults.headers.common["TenantID"];
          });
      });
    },
    getStoreData() {
      let self = this;
      self.$refs.SplashLoader.show();
      self.$nextTick(() => {
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        Axios.get(
          process.env.VUE_APP_API + `Store_Planogram/Store?Store_ID=124526`
        )
          .then(r => {
            console.log("StoreData", r.data);
            let currentStorePlanograms = [];
            currentStorePlanograms = r.data.queryResult;

            r.data.queryResult.forEach(e => {
              e.currentStatusText = self.routeController.addRoute(
                self.processStoreRoute(e)
              );
            });

            // self.storeData = currentStorePlanograms;
            self.$refs.SplashLoader.close();
          })
          .catch(e => {
            console.log(e);
          });
      });
    },
    processRoute(item) {
      let self = this;

      let routeItem = new RouteItem({
        showChildren: false,
        id: item.uid,
        parentID: "limbo",
        title: item.planogram + " " + item.storeCluster,
        route: `/TestingView/PlanogramImplementationNew/${item.planogram_ID}/${item.systemFileID}/12`,
        allowedAccessLevels: [accessTypes.SuperUser],
        routeType: RouteType.File
      });

      switch (item.status) {
        case 0:
          {
          }
          break;
        case 1:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                }
                break;
            }
          }
          break;
        case 2:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                }
                break;
            }
          }
          break;
        case 6:
          {
          }
          break;
        case 7:
          {
          }
          break;
        case 8:
          {
          }
          break;
        case 10:
          {
          }
          break;
        case 11:
          {
          }
          break;
        case 12:
          {
          }
          break;
        case 13:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                  routeItem.parentID = "PLANOGRAM_AWAITING_IMPLEMENTATION";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "PLANOGRAM_AWAITING_IMPLEMENTATION";
                }
                break;
            }
          }
          break;
        case 14:
          {
          }
          break;
        case 15:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                  routeItem.parentID = "PLANOGRAM_IMPLEMENTED";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "PLANOGRAM_IMPLEMENTED";
                }
                break;
            }
          }
          break;
        case 16:
          {
          }
          break;
        case 19:
          {
          }
          break;
        case 20:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                }
                break;
            }
          }
          break;
        case 21:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                  routeItem.parentID = "PLANOGRAM_VIEW";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "PLANOGRAM_VIEW";
                }
                break;
            }
          }
          break;
        case 24:
          {
          }
          break;
        case 26:
          {
          }
          break;
        case 28:
          {
          }
          break;
        case 29:
          {
          }
          break;
        case 30:
          {
          }
          break;
        case 31:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                  routeItem.parentID = "PLANOGRAM_IMPLEMENTATION_IN_PROGRESS";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "PLANOGRAM_IMPLEMENTATION_IN_PROGRESS";
                }
                break;
            }
          }
          break;
        case 32:
          {
          }
          break;
        case 33:
          {
          }
          break;
        case 34:
          {
          }
          break;
        case 35:
          {
          }
          break;
        case 36:
          {
          }
          break;
        case 37:
          {
            switch (item.type) {
              case 1:
                {
                }
                break;
              case 2:
                {
                }
                break;
              case 3:
                {
                  routeItem.parentID = "PLANOGRAM_AWAITING_IMPLEMENTATION";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "PLANOGRAM_AWAITING_IMPLEMENTATION";
                }
                break;
            }
          }
          break;
        case 38:
          {
          }
          break;
        case 39:
          {
          }
          break;
        case 40:
          {
          }
          break;
        case 42:
          {
          }
          break;
        case 43:
          {
          }
          break;
        case 44:
          {
          }
          break;
        case 45:
          {
          }

          break;
        case 46:
          {
          }
          break;
        case 47:
          {
          }
          break;
        case 48:
          {
          }
          break;
        case 49:
          {
          }
          break;
        case 50:
          {
          }
          break;
        case 51:
          {
          }
          break;
        case 52: {
        }
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
        allowedAccessLevels: [accessTypes.SuperUser],
        routeType: RouteType.File
      });

      switch (item.planogramStoreStatus) {
        case 0:
          {
          }
          break;
        case 1:
          {
          }
          break;
        case 2:
          {
            routeItem.parentID = "PLANOGRAM_AWAITING_IMPLEMENTATION";
          }
          break;
        case 3:
          {
            routeItem.parentID = "PLANOGRAM_IMPLEMENTATION_IN_PROGRESS";
          }
          break;
        case 4:
          {
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
  Operations: 1,
  Buyer: 2,
  Supplier: 3,
  Store: 4
};

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