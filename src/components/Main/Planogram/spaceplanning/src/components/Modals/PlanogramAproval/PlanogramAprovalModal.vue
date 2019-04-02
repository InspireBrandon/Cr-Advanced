<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="1200">
        <v-card>
          <v-card-title style="text-align: center; display: block;" class="headline">{{ title }}
            <v-textarea v-model="modalNotes" label="Notes"></v-textarea>
            <v-flex md3>
              <v-autocomplete style="max-width: 400px;" dense v-model="selectedUser" :items="users" label="find a user"></v-autocomplete>
            </v-flex>
          </v-card-title>

          <v-flex md9>

          </v-flex>
          <v-card-actions style="text-align: center; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" @click.native="returnValue(true)">Yes</v-btn>
            <v-btn color="error darken-1" @click.native="returnValue(false)">No</v-btn>
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
        dialog: false,
        afterRuturn: null,
        title: '',
        modalNotes: null,
        spaceData: null,
        users: [],
        selectedUser: null,
        databaseUsers: [],
      }
    },
    methods: {
      getUsers(callback) {
        let self = this;

        let encoded_details = jwt.decode(sessionStorage.accessToken);

        Axios.get(process.env.VUE_APP_API + `SystemUser`)
          .then(r => {


            self.userDetails = r.data;

            r.data.forEach(element => {

              if (element.emailAddress != null) {
                let isDatabaseUser = false;

                self.databaseUsers.forEach((dbu, idx) => {
                  if (dbu.systemUserID == element.systemUserID) {
                    isDatabaseUser = true;
                  }

                  if (dbu.systemUserID == encoded_details.USER_ID) {
                    self.databaseUsers.splice(idx, 1);
                  }
                })

                if (!isDatabaseUser) {
                  if (element.systemUserID != encoded_details.USER_ID) {

                    self.users.push({
                      text: element.emailAddress.toString(),
                      value: element.systemUserID
                    })
                  }
                }
              }
            });
            console.log(self.users);


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

      show(title, afterRuturn) {
        let self = this;
        self.title = title;
        self.dialog = true;
        self.afterRuturn = afterRuturn;

        self.getUsers()


      },

      returnValue(value) {
        let self = this;

        self.afterRuturn(value, self.modalNotes, self.selectedUser);
        self.dialog = false;
      }
    }

  }
</script>