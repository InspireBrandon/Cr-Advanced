<template>
  <div style="text-align: center; cursor: pointer;">
    <v-btn @click="openEdit(params)" class="ma-0" small icon>
      <v-icon color="secondary">edit</v-icon>
    </v-btn>
    <YesNoModal ref="yesNo"></YesNoModal>

    <v-dialog v-model="EditDialog" persistent max-width="600px" height="500px">
      <v-card>
        <v-toolbar dark flat color="blue darken-2" scroll-off-screen>
          <v-toolbar-title>Configuration Edit</v-toolbar-title>
        </v-toolbar>
        <v-form @submit.prevent="saveForm(params)">
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    label="First name"
                    maxlength="40"
                    counter="40"
                    disabled
                    v-model="editForm.storeName"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-autocomplete
                    return-object
                    @change="setLocationID"
                    v-model="location"
                    :items="Locations"
                    prepend-icon="search"
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="EditDialog = false">Close</v-btn>
            <v-btn color="primary" type="submit">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import YesNoModal from "@/components/Common/YesNoModal";
import Axios from "axios";

export default {
  data() {
    return {
      EditDialog: false,
      editForm: {
        id: 0,
        storeName: "",
        name: "",
        location_ID: -1
      },
      location: {
        id: 0,
        storeName: "",
        name: "",
        location_ID: -1
      },
      Locations: []
    };
  },
  components: {
    YesNoModal
  },
  methods: {
    getLocations() {
      let self = this;
      Axios.get(process.env.VUE_APP_API + `RetailerStore`).then(r => {
        self.Locations = [];
        console.log(r.data);

        r.data.retailerStoreList.forEach(item => {
          self.Locations.push({
            value: item.id,
            text: item.name
          });
        });
      });
    },
    setLocationID() {
      let self = this;

      self.$nextTick(() => {
        self.editForm.location_ID = self.location.value;
        self.editForm.name = self.location.text;
      });
    },
    openEdit(item) {
      let self = this;
      let tmp = item.data;

      self.editForm = tmp;
      self.location = tmp.location_ID;
      self.getLocations();
      self.EditDialog = true;
    },
    saveForm(item) {
      let self = this;
      let tmp = item.data;
      let node = item.node;

      Axios.defaults.headers.common["TenantID"] =
        sessionStorage.currentDatabase;

      tmp = self.editForm;

      Axios.put(
        process.env.VUE_APP_API + `SupplierRetailerStore`,
        self.editForm
      ).then(r => {
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;
        node.setData(tmp);
        self.EditDialog = false;
      });
    }
  }
};
</script>