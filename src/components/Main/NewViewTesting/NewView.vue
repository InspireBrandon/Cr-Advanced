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
          <RecursiveItem class="pa-0 ma-0" parentID="0" />
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
      hasDatabases: false
    };
  },
  mounted() {
    let self = this;

    self.getData();
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

      console.log(statusHandler.getStatus());
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
          console.log("[tenenant]");
          console.log(r.data);

          self.userAccess = r.data.tenantLink_AccessTypeList[0].accessType;
          self.userAccessTypeID =
            r.data.tenantLink_AccessTypeList[0].tenantLink_AccessTypeID;
          if (self.userAccess == 3) {
            self.selectedStore = r.data.tenantLink_AccessTypeList[0].storeID;
            self.store_ID = r.data.tenantLink_AccessTypeList[0].storeID;
          }
        }
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
            filterList.push({
              text: "All",
              value: null
            });

            self.taskViewData = r.data.projectTXList;
            delete Axios.defaults.headers.common["TenantID"];

            if (self.userAccess == 2) {
              self.filterOutSupplierPlanograms(() => {
                if (callback != undefined) {
                  self.$refs.SplashLoader.close();
                  callback();
                }
              });
            } else {
              if (callback != undefined) {
                self.$refs.SplashLoader.close();
                callback();
              }
            }

            self.taskViewData.forEach(e => {
              if (!filterList.includes(e.planogram_ID)) {
                filterList.push({
                  text: e.planogram,
                  value: e.planogram_ID
                });
                self.$refs.SplashLoader.close();
              }
            });

            self.filterList = filterList;
            self.$refs.SplashLoader.close();
          })
          .catch(e => {
            self.$refs.SplashLoader.close();

            delete Axios.defaults.headers.common["TenantID"];
          });
      });
    }
  }
};
</script>

<style scoped>
.scroll {
  overflow-y: auto;
}
</style>
  