<template>
    <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Share with users</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-autocomplete multiple v-model="selectedUsers" :items="users" label="Select a user">
                </v-autocomplete>
            </v-card-text>
            <v-card-actions style="text-align: right;">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click.native="dialog = false">Cancel</v-btn>
                <v-btn color="primary darken-1" @click.native="returnValue(true)">Continue</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                users: [],
                selectedUsers: [],
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.users = [];

                self.getUsers(() => {
                    self.getSharedUsers(() => {
                        self.afterRuturn = afterRuturn;
                        self.selectedUser = null;
                        self.notes = null;
                        self.dialog = true;
                    });
                })
            },
            returnValue(value) {
                let self = this;
                self.afterRuturn(self.selectedUsers);
                self.dialog = false;
            },
            getUsers(callback) {
                let self = this;

                let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;
                let userID = jwt.decode(sessionStorage.accessToken).USER_ID;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {
                        r.data.forEach(element => {

                            if (element.systemUserID != userID) {
                                self.users.push({
                                    text: element.firstname + ' ' + element.lastname,
                                    value: element.systemUserID
                                })
                            }
                        });
                        callback();
                    })
                    .catch(e => {

                    })
            },
            getSharedUsers(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let userID = jwt.decode(sessionStorage.accessToken).USER_ID;
                self.selectedUsers = [];

                Axios.get(process.env.VUE_APP_API + `ProjectSharedView?userID=${userID}`)
                    .then(r => {

                        r.data.projectSharedViewList.forEach(element => {
                            self.selectedUsers.push(element.sharedWithUserID);
                        });

                        callback();
                    })
            }
        }
    }
</script>