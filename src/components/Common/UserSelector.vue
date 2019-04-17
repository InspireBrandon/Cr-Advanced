<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Select users to share with</v-card-title>
          <v-card style="height: 400px; overflow: auto;">
            <v-list>
              <v-list-tile :class="{ 'selected-user': selectedUser == user }" @click="selectUser(user)" v-for="(user, idx) in userList" :key="idx">
                <v-list-tile-content>
                  <v-list-tile-title>{{user.firstname + ' ' + user.lastname}}</v-list-tile-title>
                  <!-- <v-list-tile-sub-title>Notify when receiving invites</v-list-tile-sub-title> -->
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" flat @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary darken-1" flat @click.native="returnSelectedUsers" :disabled="selectedUser == null">Continue</v-btn>
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
        userList: [],
        dialog: false,
        afterRuturn: null,
        selectedUser: null
      }
    },
    created() {
      this.getUsers();
    },
    methods: {
      show(afterRuturn) {
        let self = this;
        self.userList.forEach(el => {
          el.selected = false;
        })
        self.afterRuturn = afterRuturn;
        self.selectedUser = null;
        self.dialog = true;
      },
      getUsers() {
        let self = this;

        let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

        Axios.get(process.env.VUE_APP_API + `SystemUser`)
          .then(r => {
            for (var i = 0; i < r.data.length; i++) {
              let item = r.data[i];
              item['selected'] = false;
              self.userList.push(item);
            }
          })
          .catch(e => {

          })
      },
      returnSelectedUsers() {
        let self = this;
        self.afterRuturn(self.selectedUser);
        self.dialog = false;
      },
      selectUser(user) {
        let self = this;
        self.selectedUser = user;
      }
    }
  }
</script>

<style>
  .selected-user {
    background: #1976d2;
    color: white;
  }
</style>