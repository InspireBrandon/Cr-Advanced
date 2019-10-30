<template>
  <v-container fluid class="pa-0 ma-0" grid-list-md>
    <v-layout class="pa-0 ma-0" row wrap>
      <v-flex md2 class="pa-0 ma-0">
        <v-card style="border-right: 1px solid grey" class="scroll" height="calc(100vh - 64px)" tile>
          <RecursiveItem v-if="routeController != null" :routeController="routeController" class="pa-0 ma-0"
            parentID="0" />
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

      // self.getData();
    },
    methods: {
      getData() {
        let self = this;
        self.getDatabases(() => {
          if (self.hasDatabases) {
            self.getLists(() => {
              self.checkAccessType(() => {
                self.getUsers(() => {
                  self.getStores(() => {
                    self.getTaskViewData(() => {
                      self.loading = false;
                    });
                  });
                });
              });
            });
          } else {
            self.loading = false;
          }
        });
      },
      getDatabases(callback) {
        let self = this;

        let encoded_details = jwt.decode(sessionStorage.accessToken);
        let systemUserID = encoded_details.USER_ID;

        Axios.get(
          process.env.VUE_APP_API + `TenantAccess?systemUserID=${systemUserID}`
        ).then(r => {
          if (r.data.length > 0) self.hasDatabases = true;
          callback();
        });
      },
      getLists(callback) {
        let self = this;
        let statusHandler = new StatusHandler();
        self.statusList = statusHandler.getStatus();
        self.typeList = statusHandler.getTypeList();
        callback();
      },
      checkAccessType(callback) {
        let self = this;

        let encoded_details = jwt.decode(sessionStorage.accessToken);
        let systemUserID = encoded_details.USER_ID;
        self.selectedUser = systemUserID;
        self.systemUserID = systemUserID;

        Axios.get(
          process.env.VUE_APP_API +
          `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${sessionStorage.currentDatabase}`
        ).then(r => {
          if (r.data.isDatabaseOwner == true) {
            self.userAccess = 0;
          } else {
            self.userAccess = r.data.tenantLink_AccessTypeList[0].accessType;
            self.userAccessTypeID =
              r.data.tenantLink_AccessTypeList[0].tenantLink_AccessTypeID;
            if (self.userAccess == 3) {
              self.selectedStore = r.data.tenantLink_AccessTypeList[0].storeID;
              self.store_ID = r.data.tenantLink_AccessTypeList[0].storeID;
            }
          }

          self.routeController = new RouteController({
            userType: self.userAccess
          });

          callback();
        });
      },
      getUsers(callback) {
        let self = this;
        let list = [];
        let encoded_details = jwt.decode(sessionStorage.accessToken);

        self.users = [];

        if (self.userAccess == 0) {
          Axios.get(process.env.VUE_APP_API + `SystemUser`).then(r => {
            r.data.forEach(e => {
              list.push({
                text: e.firstname + " " + e.lastname,
                value: e.systemUserID
              });
            });

            self.users = list;
          });
        } else {
          Axios.defaults.headers.common["TenantID"] =
            sessionStorage.currentDatabase;

          Axios.get(
            process.env.VUE_APP_API + `SystemUser/${encoded_details.USER_ID}`
          ).then(res => {
            list.push({
              text: res.data.firstname + " " + res.data.lastname,
              value: encoded_details.USER_ID
            });
          });

          Axios.get(
            process.env.VUE_APP_API +
            `ProjectSharedViewShared?userID=${encoded_details.USER_ID}`
          ).then(r => {
            r.data.projectSharedViewList.forEach(e => {
              list.push({
                text: e.userName,
                value: e.systemUserID
              });
            });

            delete Axios.defaults.headers.common["TenantID"];
            self.users = list;
          });
        }
        callback();
      },
      getStores(callback) {
        let self = this;
        let list = [];

        Axios.get(process.env.VUE_APP_API + `Store?db=Hinterland-Live`).then(
          r => {
            r.data.forEach(element => {
              list.push({
                text: element.storeName,
                value: element.storeID
              });
            });

            self.stores = list;
            callback();
          }
        );
      },
      getTaskViewData(callback) {
        let self = this;
        self.$refs.SplashLoader.show();
        let filterList = [];
        self.$nextTick(() => {
          self.taskViewData = [];

          Axios.defaults.headers.common["TenantID"] =
            sessionStorage.currentDatabase;

          Axios.get(
              process.env.VUE_APP_API + `UserProjectTX?userID=${self.selectedUser}`
            )
            .then(r => {
              r.data.projectTXList.forEach(el => {
                self.routeController.addRoute(self.processRoute(el));

                // self.routeController.addRoute(new RouteItem({
                //   showChildren: false,
                //   id: el.uid,
                //   parentID: "1.1",
                //   title: el.systemFileName,
                //   route: false,
                //   allowedAccessLevels: [
                //     accessTypes.SuperUser
                //   ],
                //   routeType: RouteType.File
                // }));
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
          case 0: {
            // button_1.set('secondary', 'assignment', cp.assign, "Assign")
          }
          break;
        case 1: {
          switch (item.type) {
            case 1: {
              // button_1.set('warning', 'visibility', cp.routeToView, "View")
              // button_2.set('error', 'check', cp.setComplete, "Complete")
            }
            break;
          case 2: {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            if (item.approvalUserID == null) {
              // button_2.set('error', 'check', cp.setComplete, "Complete")
            }
            if (item.approvalUserID != null) {
              // button_2.set('error', 'send', cp.sendToApprovalUser, "Send for Approval")
            }
          }
          break;
          case 3: {
            routeItem.parentID = "1.3";
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('error', 'check', cp.setPlanogramComplete, "Complete")
          }
          break;
          }
        }
        break;
        case 2: {
          switch (item.type) {
            case 1: {
              if (item.actionedByUserID == self.systemUserID) {
                // button_1.set('error', 'close', cp.closeTask, "Close")
              }

              if (item.systemUserID == self.systemUserID) {
                // button_1.set('secondary', 'assignment', cp.assign, "Assign")
                // button_2.set('warning', 'visibility', cp.routeToView, "View")
              }
            }
            break;
          case 2: {
            if (item.actionedByUserID == self.systemUserID) {
              // button_1.set('error', 'close', cp.closeTask, "Close")
            }

            if (item.systemUserID == self.systemUserID) {
              // button_1.set('secondary', 'assignment', cp.assign, "Assign")
              // button_2.set('warning', 'visibility', cp.routeToView, "View")
            }
          }
          break;
          case 3: {
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
        // case 3: {

        // }
        // break;
        // case 4: {

        // }
        // break;
        // case 5: {

        // }
        // break;
        case 6: {
          //button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }
        break;
        case 7: {
          // button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }
        break;
        case 8: {
          // button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
          routeItem.parentID = "1.4";
        }
        break;
        case 10: {
          // button_1.set('success', 'visibility', cp.setApprovalInProgress, "View")
        }
        break;
        case 11: {
          if (item.actionedByUserID == self.systemUserID) {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
          if (item.systemUserID == self.systemUserID && item.type == 2) {
            // button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
          }
        }
        break;
        case 12: {
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
        case 13: {
          // button_1.set('success', 'visibility', cp.setImplementationInProgress, "View")
        }
        break;
        case 14: {
          // button_1.set('success', 'visibility', cp.setVariationInProgressandView, "View")
        }
        break;
        case 16: {
          if (item.actionedByUserID == self.systemUserID) {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }

          if (item.systemUserID == self.systemUserID) {
            // button_1.set('error', 'close', cp.closeTask, "Close")
          }
        }
        break;
        // distribution
        case 19: {
          // button_1.set('success', 'visibility', cp.setDistributionViewed, "View")
          // button_2.set('primary', 'send', cp.goToDistributionView, "Distribute")
          // button_2.set('error', 'local_parking', cp.setParked, "Park")
        }
        break;
        case 20: {
          switch (item.type) {
            case 1: {
              // button_1.set('warning', 'visibility', cp.routeToView, "View")
            }
            break;
          case 2: {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
            // button_2.set('primary', 'check', cp.setApproved, "Approve")
            // button_3.set('error', 'close', cp.setDeclined, "Decline")
          }
          break;
          case 3: {
            // button_1.set('warning', 'visibility', cp.routeToView, "View")
          }
          break;
          }
        }
        break;
        case 21: {
          // button_1.set('warning', 'visibility', cp.routeToImplementation, "View")
          // button_2.set('primary', 'send', cp.goToDistributionView, "Distribute")
          // button_3.set('error', 'close', cp.closeTask, "Close")
          // button_3.set('success', 'settings_backup_restore', cp.recall, "Recall")
          // button_4.set('error', 'local_parking', cp.setParked, "Park")
        }
        break;
        case 24: {
          // button_1.set('warning', 'visibility', cp.routeToView, "View")
        }
        break;
        case 26: {
          // button_1.set('primary', 'visibility', cp.routeToView, "View")
        }
        break;
        case 28: {
          // if (item.rollingUserID != item.systemUserID)
          // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 29: {
          // if (item.rollingUserID != item.systemUserID)
          // button_1.set('error', 'check', cp.completeSubtask, "Complete")
        }
        break;
        case 30: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 31: {
          // if (item.rollingUserID != self.systemUserID)
          // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 32: {
          // if (item.rollingUserID != self.systemUserID)
          // button_1.set('error', 'check', cp.completeSubtask, "Complete")
        }
        break;
        case 33: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 34: {
          // if (item.rollingUserID != self.systemUserID)
          // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 35: {
          // if (item.rollingUserID != self.systemUserID)
          // button_1.set('error', 'check', cp.completeSubtask, "Complete")
        }
        break;
        case 36: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 37: {
          // if (item.rollingUserID != self.systemUserID)
          // button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 38: {
          if (item.rollingUserID != self.systemUserID) {
            // button_1.set('warning', 'visibility', cp.goToSubtaskView, "View")
            // button_2.set('error', 'check', cp.completeSubtask, "Complete")
          }
        }
        break;
        case 39: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 40: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 42: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 43: {
          // button_1.set('info', 'visibility', cp.openNotesObj, "Read")
          // button_2.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 44: {
          // button_1.set('success', 'visibility', cp.routeToView, "View") //implementation
          // button_2.set('primary', 'send', cp.setDistributionInProgress, "Distribute")
          // button_3.set('error', 'local_parking', cp.setParked, "Park")
        }
        break;
        case 45: {
          // button_1.set('success', 'check', cp.setDiscontinued, "set Discontinued")
        }

        break;
        case 46: {
          // button_1.set('warning', 'visibility', cp.routeToView, "View")
          // button_2.set('success', 'check', cp.setVariationComplete, "Complete")
        }
        break;
        case 47: {
          // button_1.set('warning', 'visibility', cp.routeToView, "View")
          // button_2.set('primary', 'send', cp.submitForApproval, "Send Variation")
          // button_3.set('success', 'share', cp.goToDistributionView, "Distribute")
        }
        break;
        case 48: {
          // button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 49: {
          // button_1.set('success', 'visibility', cp.setRecallInProgressandView, "View")
        }
        break;
        case 50: {
          // button_1.set('warning', 'visibility', cp.routeToView, "View")
          // button_2.set('success', 'check', cp.setRecalledComplete, "Complete")
        }
        break;
        case 51: {
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