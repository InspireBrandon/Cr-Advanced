<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="600">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>
                            <div>Select users to share with</div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card flat style="height: 400px; overflow: auto;">
                        <v-list>
                            <v-list-tile @click="selectUser(user)" v-for="(user, idx) in userList" :key="idx" v-if="user.systemUserID != systemUserID">
                                <v-list-tile-action>
                                    <v-checkbox @click.prevent="doNothing" v-model="user.selected"></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{user.firstname + ' ' + user.lastname}}</v-list-tile-title>
                                    <!-- <v-list-tile-sub-title>Notify when receiving invites</v-list-tile-sub-title> -->
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                    <v-divider></v-divider>
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
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                userList: [],
                selectedUsers: [],
                dialog: false,
                afterRuturn: null,
                systemUserID: -1
            }
        },
        methods: {
            doNothing() {

            },
            show(folderFileID, afterRuturn) {
                let self = this;

                self.folderFileID = folderFileID;

                self.getUsers(() => {
                    self.afterRuturn = afterRuturn;
                    self.dialog = true;
                });
            },
            getUsers(callback) {
                let self = this;

                self.userList = [];

                let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {
                        for (var i = 0; i < r.data.length; i++) {
                            let item = r.data[i];
                            item['selected'] = false;
                            self.userList.push(item);
                        }

                        self.getSharedFolderUsers(callback)
                    })
                    .catch(e => {

                    })
            },
            getSharedFolderUsers(callback) {
                let self = this;

                let systemUserID = jwt.decode(sessionStorage.accessToken).USER_ID;
                self.systemUserID = systemUserID;

                Axios.get(process.env.VUE_APP_API +
                        `SharedFolderFile/SharedFromMe?systemUserID=${systemUserID}&folderFileID=${self.folderFileID}`)
                    .then(r => {
                        r.data.forEach(sharedUser => {
                            self.userList.forEach(user => {
                                if(sharedUser.systemUserID == user.systemUserID)
                                    user.selected = true;
                            })
                        })

                        callback();
                    })
            },
            returnSelectedUsers() {
                let self = this;

                let selectedUsers = [];

                self.userList.forEach(el => {
                    if(el.selected)
                        selectedUsers.push(el.systemUserID)
                })

                self.afterRuturn(selectedUsers);
                self.dialog = false;
            },
            selectUser(user) {
                let self = this;
                user.selected = !user.selected;
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