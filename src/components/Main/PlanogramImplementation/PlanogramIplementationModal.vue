<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="1200">
        <v-card>
          <v-toolbar dark dense flat color="primary">
            <v-toolbar-title>
              {{ title }}

            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>
                close
              </v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title style="text-align: center; display: block;" class="headline">
            <v-textarea v-model="modalNotes" label="Notes"></v-textarea>
            <v-flex md6 v-if="type==4">
              <v-autocomplete style="max-width: 400px;" dense v-model="selectedStore" :items="Stores"
                label="Select A Store"></v-autocomplete>
            </v-flex>
            <v-flex md6 v-if="type==4">
              <v-autocomplete style="max-width: 400px;" dense v-model="selectedUser" :items="users"
                label="Select A User"></v-autocomplete>
            </v-flex>

          </v-card-title>

          <v-flex md9>

          </v-flex>
          <v-card-actions>
            <!-- <v-btn color="error darken-1" @click.native="returnValue(false)">Cancel</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" @click.native="returnValue(true)">Submit</v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import Axios from 'axios';
  import jwt from 'jsonwebtoken';

  export default {
    data() {
      return {
        selectedStore: null,
        Stores: [],
        type: null,
        dialog: false,
        afterRuturn: null,
        title: '',
        modalNotes: null,
        spaceData: null,
        users: [],
        selectedUser: null,
        databaseUsers: [],
        disableStoreSelection: false,
        storeCluster: null
      }
    },
    methods: {
      getUsers(callback) {
        let self = this;

        let encoded_details = jwt.decode(sessionStorage.accessToken);

        Axios.get(process.env.VUE_APP_API + `SystemUser`)
          .then(r => {

            self.userDetails = r.data;

            self.users.push({
              text: r.data[0].username.toString(),
              value: r.data[0].systemUserID
            })

            r.data.forEach(element => {

              if (element.emailAddress != null) {
                let isDatabaseUser = false;

                self.databaseUsers.forEach((dbu, idx) => {

                  if (dbu.systemUserID == element.systemUserID) {
                    isDatabaseUser = true;
                  }
                })

                if (isDatabaseUser) {
                  self.users.push({
                    text: element.username.toString(),
                    value: element.systemUserID
                  })
                }
              }
            });

            self.showLoader = false;
            self.AssignedUser = self.users[0].value;
          })
      },
      getSpacePlans(callback) {
        let self = this;

        self.spaceData = [];

        Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
          .then(r => {
            self.spaceData = r.data;

            callback();
          })
          .catch(e => {
            // alert("Failed to get data...");
          })
      },
      show(title, type, storeCluster, storeID, afterRuturn) {
        let self = this;
        self.type = type

        self.title = title;
        self.dialog = true;
        self.getStores()

        self.storeCluster = storeCluster;
        self.selectedStore = storeID;

        self.afterRuturn = afterRuturn;
        self.getSpacePlans()
        self.getDatabaseUsers()

      },
      getDatabaseUsers() {
        let self = this;
        let encoded_details = jwt.decode(sessionStorage.accessToken);
        let tmp = sessionStorage.currentDatabase
        Axios.get(process.env.VUE_APP_API + `TenantAccess/User?tenantID=${tmp}`)
          .then(r => {
            self.databaseUsers = r.data;
            self.getUsers();
          })
      },
      getStores() {
        let self = this
        Axios.get(process.env.VUE_APP_API + "Store?db=CR-Devinspire").then(r => {

          r.data.forEach(s => {
            let storeCluster = "";

            console.log(self.storeCluster)

            if (self.storeCluster != undefined) {
              storeCluster = self.storeCluster.toUpperCase();
            }

            if (s.storeClusterName.toUpperCase() == (storeCluster == "" ? s.storeClusterName.toUpperCase() :
                storeCluster)) {
              self.Stores.push({
                text: s.storeName,
                value: s.storeID
              })
            }
          })
        })

      },
      returnValue(value) {
        let self = this;
        let tmp = {
          value: value,
          stores: self.selectedStore,
          users: self.selectedUser,
          notes: self.modalNotes
        }
        self.afterRuturn(tmp);
        self.dialog = false;
      }
    }

  }
</script>