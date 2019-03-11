<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar prominent>
                <v-btn icon @click="modalShow = false">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="selectedUser == null" :loading="loading" icon @click="addUser">
                    <v-icon>check</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container class="pt-0">
                <v-autocomplete v-model="selectedUser" :items="users" label="find a user"></v-autocomplete>
                <v-list dense style="height: calc(100vh - 148px); overflow: auto;">
                    <template v-for="(item, index) in items">
                        <div :key="index">
                            <v-list-tile color="grey-darken-4" avatar>
                                <v-list-tile-avatar v-if="item.image == '' || item.image == null">
                                    <v-img :src="'http://oakclifffilmfestival.com/assets/placeholder-user.png'"></v-img>
                                </v-list-tile-avatar>

                                <v-list-tile-avatar v-else>
                                    <v-img :src="'data:image/png;base64,' + item.image"></v-img>
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.firstname }} {{ item.lastname }}</v-list-tile-title>
                                </v-list-tile-content>

                                <v-spacer></v-spacer>

                                <!-- <v-list-tile-content class="hidden-md">
                                    <v-list-tile-title>{{ item.emailAddress }}</v-list-tile-title>
                                </v-list-tile-content> -->

                                <v-list-tile-action>
                                    <v-menu>
                                        <v-btn slot="activator" icon>
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                        <v-list>
                                            <v-list-tile>Revoke Access</v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </v-list-tile-action>

                            </v-list-tile>

                            <v-divider :inset="item.inset"></v-divider>
                        </div>
                    </template>
                </v-list>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                loading: false,
                extended: false,
                modalShow: false,
                inviteText: '',
                afterClose: null,
                autoUpdate: true,
                friends: null,
                isUpdating: false,
                userDetails: [],
                users: [],
                selectedUser: null,
                items: [],
                tenantID: null
            }
        },
        created() {
            //this.getUsers();
        },
        methods: {
            getUsers() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        self.userDetails = r.data;

                        r.data.forEach(element => {

                            if (element.emailAddress != null) {
                                self.users.push({
                                    text: element.emailAddress.toString(),
                                    value: element.systemUserID
                                })
                            }
                        });
                    })
            },
            getDatabaseUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `TenantAccess/User?tenantID=${self.tenantID}`)
                    .then(r => {

                        console.log(r.data);
                    })
            },
            addUser() {
                let self = this;

                self.extended = true;
                self.loading = true;
                let userObj = null;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                setTimeout(() => {
                    self.userDetails.forEach(element => {
                        if (element.systemUserID == self.selectedUser) {
                            userObj = element;
                        }
                    })

                    self.users.forEach((element, idx) => {
                        if (element.value == self.selectedUser) {
                            self.users.splice(idx, 1);
                        }
                    })

                    Axios.post(process.env.VUE_APP_API +
                            `TenantAccess?systemUserID=${encoded_details.USER_ID}&tenantID=${self.tenantID}`)
                        .then(r => {
                            self.items.push(userObj);
                            self.selectedUser = null;
                            self.loading = false;
                        })
                }, 200);
            },
            close() {
                let self = this
                self.modalShow = false
            },
            open(tenantID, callback) {
                let self = this
                self.afterClose = callback;
                self.tenantID = tenantID;
                this.getDatabaseUsers();
                self.modalShow = true
            },
            remove(item) {
                const index = this.friends.indexOf(item.name)
                if (index >= 0) this.friends.splice(index, 1)
            }
        },
        watch: {
            isUpdating(val) {
                if (val) {
                    setTimeout(() => (this.isUpdating = false), 3000)
                }
            }
        },
    }
</script>