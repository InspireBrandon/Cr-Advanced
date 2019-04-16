<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Select users to share with</v-card-title>
          <v-card>
            <v-list>
              <v-list-tile v-for="(user, idx) in userList" :key="idx" @click="user.selected = !user.selected">
                <v-list-tile-action>
                  <v-checkbox v-model="user.selected"></v-checkbox>
                </v-list-tile-action>

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
            <v-btn color="primary darken-1" flat @click.native="returnSelectedUsers">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import AAxios from '../../../static/libs/service-caller.js';
  import jwt from 'jsonwebtoken';

  export default {
    data() {
      return {
        userList: [],
        dialog: false,
        afterRuturn: null
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
        self.dialog = true;
      },
      getUsers() {
        let self = this;
        
        let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

        AAxios.get(process.env.VUE_APP_API + `SystemUser?accountID=${accountID}`)
          .then(r => {
            for(var i = 0; i < r.data.length; i++) {
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
        let tmpList = [];
        self.userList.forEach(el => {
          if (el.selected)
            tmpList.push(el);
        })
        self.afterRuturn(tmpList);
        self.dialog = false;
      }
    }
  }

</script>
