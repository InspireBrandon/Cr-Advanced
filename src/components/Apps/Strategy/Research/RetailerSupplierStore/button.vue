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
                    item-text="name"
                    item-value="id"
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
      location: null,
      Locations: [
        {
          id: "",
          name: ""
        }
      ]
    };
  },
  components: {
    YesNoModal
  },
  methods: {
    getLocations() {
      let self = this;
      Axios.get(process.env.VUE_APP_API + `RetailerStore`).then(r => {
        self.Locations = r.data.retailerStoreList;
        console.log(r.data);
      });
    },
    setLocationID() {
      let self = this;

      self.$nextTick(() => {
        self.editForm.location_ID = self.location.id;
      });
    },
    openEdit(item) {
      let self = this;

      console.log(item)

      self.EditDialog = true;
      self.editForm = item.data;
      self.getLocations();
    },
    saveForm(item) {
      let self = this;
      let tmp = item.data;
      let node = item.node;

      tmp = self.editForm;

      Axios.defaults.headers.common["TenantID"] =
        sessionStorage.currentDatabase;

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