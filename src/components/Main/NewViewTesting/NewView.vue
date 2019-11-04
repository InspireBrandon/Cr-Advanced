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
  },
  methods: {
    getTaskViewData(callback) {
      let self = this;
      let encoded_details = jwt.decode(sessionStorage.accessToken);
      let systemUserID = encoded_details.USER_ID;
      self.$refs.SplashLoader.show();
      let filterList = [];
      self.$nextTick(() => {
        self.taskViewData = [];

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
                  routeItem.parentID = "AWAITING_IMPLEMENTATION_PLANOGRAM";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "AWAITING_IMPLEMENTATION_PLANOGRAM";
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
                  routeItem.parentID = "IMPLEMENTED_PLANOGRAM";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "IMPLEMENTED_PLANOGRAM";
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
                  routeItem.parentID = "VIEW_PLANOGRAM";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "VIEW_PLANOGRAM";
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
                  routeItem.parentID = "IMPLEMENTATION_IN_PROGRESS_PLANOGRAM";
                }
                break;
              case 6:
                {
                  routeItem.parentID = "IMPLEMENTATION_IN_PROGRESS_PLANOGRAM";
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