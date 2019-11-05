<template>
  <v-dialog persistent v-model="modalShow" width="500">
    <v-card>
      <v-toolbar flat dark color="primary">
        <v-toolbar-title>Access Type</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="close" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex lg12 md12 sm12 xs12>
            <v-select
              :items="types"
              v-model="form.accessType"
              label="Type"
              @change="accessTypeChange"
            ></v-select>
          </v-flex>
          <v-flex v-if="form.accessType == 2" lg12 md12 sm12 xs12>
            <v-autocomplete
              small-chips
              multiple
              deletable-chips
              :items="planograms"
              v-model="selectedPlanograms"
              prepend-icon="search"
              label="Planograms"
            ></v-autocomplete>
          </v-flex>
          <v-flex v-if="form.accessType == 3" lg12 md12 sm12 xs12>
            <v-autocomplete :items="stores" v-model="form.storeID" label="Store"></v-autocomplete>
          </v-flex>
          <v-flex v-if="form.accessType == 4" lg12 md12 sm12 xs12>
            <v-container fluid>
              <v-checkbox v-model="allowDistribution" label="Distribution" hide-details></v-checkbox>
              <v-checkbox v-model="allowApproval" label="Approval" hide-details></v-checkbox>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="submit" color="primary">save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      modalShow: false,
      afterClose: null,
      types: [
        {
          text: "Super User",
          value: 0
        },
        {
          text: "Operations",
          value: 4
        },
        {
          text: "Buyer",
          value: 1
        },
        {
          text: "Supplier",
          value: 2
        },
        {
          text: "Store",
          value: 3
        }
      ],
      type: null,
      stores: [],
      store: null,
      planograms: [],
      allowDistribution: false,
      allowApproval: false,
      selectedPlanograms: [],
      operationsSettings: null,
      form: {
        accessType: null,
        storeID: null
      },
      systemUserID: null,
      tenantID: null,
      tenantLink_AccessTypeID: null
    };
  },
  methods: {
    getAccessType(systemUserID, tenantID, callback) {
      let self = this;
      console.log(systemUserID);

      Axios.get(
        process.env.VUE_APP_API +
          `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`
      ).then(r => {
        if (r.data.tenantLink_AccessTypeList.length > 0) {
          self.form = r.data.tenantLink_AccessTypeList[0];

          console.log("Access Type 1", self.form);

          self.tenantLink_AccessTypeID = self.form.tenantLink_AccessTypeID;

          self.selectedPlanograms = [];

          if (self.form.accessType == 2) {
            self.form.supplierPlanogramList.forEach(element => {
                self.selectedPlanograms.push(element.planogram_ID);
            });
          }

          if (self.form.accessType == 3) {
            self.form.supplierPlanogramList.forEach(element => {
                self.selectedPlanograms.push(element.planogram_ID);
            });
          }

          if (self.form.accessType == 4) {
            self.getOperationsSettings();
          }
        } else {
          for (var prop in self.form) {
            self.form[prop] = null;
          }
        }
        self.getStores(callback);
      });
    },
    getStores(callback) {
      let self = this;

      Axios.get(process.env.VUE_APP_API + "Store?db=CR-HINTERLAND-LIVE").then(
        r => {
          self.stores = [];
          r.data.forEach(element => {
            self.stores.push({
              text: element.storeName,
              value: element.storeID
            });
          });
          console.log("self.stores");
          console.log(self.stores);

          self.getPlanograms(callback);
        }
      );
    },
    getPlanograms(callback) {
      let self = this;

      Axios.get(process.env.VUE_APP_API + "Planogram").then(r => {
        self.planograms = [];

        r.data.planogramList.forEach(element => {
          self.planograms.push({
            text: element.displayname,
            value: element.id
          });
        });
        callback();
      });
    },
    getOperationsSettings() {
      let self = this;

      console.log("passed data", self.tenantLink_AccessTypeID);
      Axios.get(
        process.env.VUE_APP_API +
          "OperationsSetting?tenantLink_AccessTypeID=" +
          self.tenantLink_AccessTypeID
      )
        .then(r => {
          // Return object
          // do a check to see if its null

          if (r.data == null) {
            self.operationsSettings = {
              id: -1,
              uid: ""
            };

            self.allowDistribution = false;
            self.allowApproval = false;
          } else if (r.data != null) {
            self.operationsSettings = {
              id: r.data.operationsSettingsID,
              uid: r.data.operationsSettingsUID
            };

            self.allowDistribution = r.data.distribution;
            self.allowApproval = r.data.approval;
          }
        })
        .catch(er => {
          console.log("Error", er);
        });
    },
    accessTypeChange() {
      let self = this;

      self.$nextTick(() => {
        if (self.form.accessType == 4) {
          self.getOperationsSettings();
        }
      });
    },
    submit() {
      let self = this;

      let tmp = [];
      self.$nextTick(() => {
        self.selectedPlanograms.forEach(selectedPlanogram => {
          var selected = false;
          self.planograms.forEach(planogram => {
            if (planogram.value == selectedPlanogram) selected = true;
          });

          if (selected) {
            tmp.push({
              planogram_ID: selectedPlanogram
            });
          }
        });

        self.form["supplierPlanogramList"] = tmp;

        Axios.post(
          process.env.VUE_APP_API +
            `TenantLink_AccessType?systemUserID=${self.systemUserID}&tenantID=${self.tenantID}`,
          self.form
        ).then(r => {
          let accessType = "";

          console.log("Access Type", self.form.accessType);

          switch (self.form.accessType) {
            case 0:
              {
                accessType = "Super User";
              }
              break;
            case 1:
              {
                accessType = "Buyer";
              }
              break;
            case 2:
              {
                accessType = "Supplier";
              }
              break;
            case 3:
              {
                accessType = "Store";
              }
              break;
            case 4:
              {
                accessType = "Operations";
                self.saveOperationSettings();
              }
              break;
          }

          self.afterClose(accessType);
          self.close();
        });
      });
    },
    close() {
      let self = this;
      self.modalShow = false;
    },
    open(systemUserID, tenantID, callback) {
      let self = this;

      self.getAccessType(systemUserID, tenantID, function() {
        self.type = null;
        self.store = null;
        self.systemUserID = systemUserID;
        self.tenantID = tenantID;
        self.afterClose = callback;
        self.modalShow = true;
      });
    },
    saveOperationSettings() {
      let self = this;

      let isAdd = self.operationsSettings.id == -1;

      let request = {
        operationsSettingsID: self.operationsSettings.id,
        operationsSettingsUID: self.operationsSettings.uid,
        tenantLink_AccessTypeID: self.tenantLink_AccessTypeID,
        distribution: self.allowDistribution,
        approval: self.allowApproval
      };

      Axios[isAdd ? "post" : "put"](
        process.env.VUE_APP_API + "OperationsSetting",
        request
      ).then(r => {});
    }
  }
};
</script>