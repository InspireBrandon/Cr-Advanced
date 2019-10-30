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
            // button_1.set('secondary', 'assignment', cp.assign, "Assign")
          }
          break;
        case 1:
          {
            switch (item.type) {
              case 1:
                {
                  // button_1.set('warning', 'visibility', cp.routeToView, "View")
                  // button_2.set('error', 'check', cp.setComplete, "Complete")
                }
                break;
              case 2:
                {
                  // button_1.set('warning', 'visibility', cp.routeToView, "View")
                  if (item.approvalUserID == null) {
                    // button_2.set('error', 'check', cp.setComplete, "Complete")
                  }
                  if (item.approvalUserID != null) {
                    // button_2.set('error', 'send', cp.sendToApprovalUser, "Send for Approval")
                  }
                }
                break;
              case 3:
                {
                  // button_1.set('warning', 'visibility', cp.routeToView, "View")
                  // button_2.set('error', 'check', cp.setPlanogramComplete, "Complete")
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
                  if (item.actionedByUserID == self.systemUserID) {
                    // button_1.set('error', 'close', cp.closeTask, "Close")
                  }

                  if (item.systemUserID == self.systemUserID) {
                    // button_1.set('secondary', 'assignment', cp.assign, "Assign")
                    // button_2.set('warning', 'visibility', cp.routeToView, "View")
                  }
                }
                break;
              case 2:
                {
                  if (item.actionedByUserID == self.systemUserID) {
                    // button_1.set('error', 'close', cp.closeTask, "Close")
                  }

                  if (item.systemUserID == self.systemUserID) {
                    // button_1.set('secondary', 'assignment', cp.assign, "Assign")
                    // button_2.set('warning', 'visibility', cp.routeToView, "View")
                  }
                }
                break;
              case 3:
                {
                  if (item.actionedByUserID == self.systemUserID) {
                    // button_2.set('error', 'close', cp.closeTask, "Close")
                  }

                  routeItem.parentID = "1.2";

                  if (item.systemUserID == self.systemUserID) {
                    // button_1.set('primary', 'send', cp.submitForApproval, "Send")
                    // button_2.set('warning', 'visibility', cp.routeToView, "View")
                    // button_3.set('success', 'share', cp.goToDistributionView, "Distribute")
                  }
                }
                break;
            }
          }
          break;
          case 3: {
            routeItem.parentID = "PLANOGRAM_VIEW";
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('error', 'check', cp.setPlanogramComplete, "Complete")
          }
          break;
        case 7:
          {
            // button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
          }
          break;
        case 8:
          {
            // button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
          }
          break;
        case 10:
          {
            // button_1.set('success', 'visibility', cp.setApprovalInProgress, "View")
          }
          break;
        case 11:
          {
            if (item.actionedByUserID == self.systemUserID) {
              // button_1.set('error', 'close', cp.closeTask, "Close")
            }
            if (item.systemUserID == self.systemUserID && item.type == 2) {
              // button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
            }
          }
          break;
        case 12:
          {
            if (item.actionedByUserID == self.systemUserID) {
              // button_1.set('error', 'close', cp.closeTask, "Close")
            }

            if (item.systemUserID == self.systemUserID && item.type == 3) {
              // button_1.set('primary', 'send', cp.submitForDistribution, "Send")
              // button_2.set('success', 'share', cp.goToDistributionView, "Distribute")
            }
            if (item.systemUserID == self.systemUserID && item.type == 2) {
              // button_1.set('primary', 'send', cp.submitForDistribution, "Send")
              // button_2.set('success', 'share', cp.goToDistributionView, "Distribute")
            }
          }
          break;
        case 13:
          {
            // button_1.set('success', 'visibility', cp.setImplementationInProgress, "View")
            routeItem.parentID = "AWAITING_IMPLEMENTATION_PLANOGRAM";
          }
          break;
        case 14:
          {
            // button_1.set('success', 'visibility', cp.setVariationInProgressandView, "View")
          }
          break;
        case 15:
          {
            routeItem.parentID = "IMPLEMENTED_PLANOGRAM";
            // button_1.set('success', 'visibility', cp.setVariationInProgressandView, "View")
          }
          break;
        case 16:
          {
            if (item.actionedByUserID == self.systemUserID) {
              // button_1.set('error', 'close', cp.closeTask, "Close")
            }

            if (item.systemUserID == self.systemUserID) {
              // button_1.set('error', 'close', cp.closeTask, "Close")
            }
          }
          break;
        // distribution
        case 19:
          {
            // button_1.set('success', 'visibility', cp.setDistributionViewed, "View")
            // button_2.set('primary', 'send', cp.goToDistributionView, "Distribute")
            // button_2.set('error', 'local_parking', cp.setParked, "Park")
          }
          break;
        case 20:
          {
            switch (item.type) {
              case 1:
                {
                  // button_1.set('warning', 'visibility', cp.routeToView, "View")
                }
                break;
              case 2:
                {
                  // button_1.set('warning', 'visibility', cp.routeToView, "View")
                  // button_2.set('primary', 'check', cp.setApproved, "Approve")
                  // button_3.set('error', 'close', cp.setDeclined, "Decline")
                }
                break;
              case 3:
                {
                  // button_1.set('warning', 'visibility', cp.routeToView, "View")
                }
                break;
            }
          }
          break;
        case 21:
          {
            // button_1.set('warning', 'visibility', cp.routeToImplementation, "View")
            // button_2.set('primary', 'send', cp.goToDistributionView, "Distribute")
            // button_3.set('error', 'close', cp.closeTask, "Close")
            // button_3.set('success', 'settings_backup_restore', cp.recall, "Recall")
            routeItem.parentID = "VIEW_PLANOGRAM";
            // button_4.set('error', 'local_parking', cp.setParked, "Park")
          }
          break;
        case 24:
          {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
          }
          break;
        case 26:
          {
            // button_1.set('primary', 'visibility', cp.routeToView, "View")
          }
          break;
        case 28:
          {
            // if (item.rollingUserID != item.systemUserID)
            // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
          }
          break;
        case 29:
          {
            // if (item.rollingUserID != item.systemUserID)
            // button_1.set('error', 'check', cp.completeSubtask, "Complete")
          }
          break;
        case 30:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 31:
          {
            routeItem.parentID = "IMPLEMENTATION_IN_PROGRESS_PLANOGRAM";
            // if (item.rollingUserID != self.systemUserID)
            // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
          }
          break;
        case 32:
          {
            // if (item.rollingUserID != self.systemUserID)
            // button_1.set('error', 'check', cp.completeSubtask, "Complete")
          }
          break;
        case 33:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 34:
          {
            // if (item.rollingUserID != self.systemUserID)
            // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
          }
          break;
        case 35:
          {
            // if (item.rollingUserID != self.systemUserID)
            // button_1.set('error', 'check', cp.completeSubtask, "Complete")
          }
          break;
        case 36:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 37:
          {
            // if (item.rollingUserID != self.systemUserID)
            // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
          }
          break;
        case 38:
          {
            if (item.rollingUserID != self.systemUserID) {
              // button_1.set('warning', 'visibility', cp.goToSubtaskView, "View")
              // button_2.set('error', 'check', cp.completeSubtask, "Complete")
            }
          }
          break;
        case 39:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 40:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 42:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 43:
          {
            // button_1.set('info', 'visibility', cp.openNotesObj, "Read")
            // button_2.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 44:
          {
            // button_1.set('success', 'visibility', cp.routeToView, "View") //implementation
            // button_2.set('primary', 'send', cp.setDistributionInProgress, "Distribute")
            // button_3.set('error', 'local_parking', cp.setParked, "Park")
          }
          break;
        case 45:
          {
            // button_1.set('success', 'check', cp.setDiscontinued, "set Discontinued")
          }

          break;
        case 46:
          {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('success', 'check', cp.setVariationComplete, "Complete")
          }
          break;
        case 47:
          {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('primary', 'send', cp.submitForApproval, "Send Variation")
            // button_3.set('success', 'share', cp.goToDistributionView, "Distribute")
          }
          break;
        case 48:
          {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          break;
        case 49:
          {
            // button_1.set('success', 'visibility', cp.setRecallInProgressandView, "View")
          }
          break;
        case 50:
          {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('success', 'check', cp.setRecalledComplete, "Complete")
          }
          break;
        case 51:
          {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('primary', 'send', cp.sendRecall, "Send")
          }
          break;
        case 52: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
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