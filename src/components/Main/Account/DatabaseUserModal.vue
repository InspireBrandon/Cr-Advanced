<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar prominent>
                <v-btn icon @click="modalShow = false">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" icon @click="addUser">
                    <v-icon>check</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- <v-container class="pt-0">
                <v-select v-model="selectedUser" :items="people" label="find a user" chips item-text="text" item-value="value"></v-select>
                <v-list dense>
                    <template v-for="(item, index) in items">
                        <div :key="index">
                            <v-list-tile color="grey-darken-4" avatar>
                                <v-list-tile-avatar>
                                    <v-img :src="item.avatar"></v-img>
                                </v-list-tile-avatar>

                    <v-list-tile color="grey-darken-4" :key="item.title" avatar >
                        <v-list-tile-avatar>
                            <v-img :src="item.avatar"></v-img>
                        </v-list-tile-avatar>

                                <v-spacer></v-spacer>

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
            </v-container> -->
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
                people: [],
                selectedUser: null,
                items: [
                    'Programming',
                    'Design',
                    'Vue',
                    'Vuetify'
                ]
            }
        },
        created() {
            this.getUsers();
        },
        methods: {
            getUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        r.data.forEach(element => {
                            self.people.push({
                                text: element.emailAddress,
                                value: element.systemUserID
                            })
                        });
                    })
            },
            addUser() {
                let self = this;

                self.extended = true;
                self.loading = true;

                setTimeout(() => {
                    self.select = [];
                    self.loading = false;
                }, 2000);

                // console.log(self.friends);

                // self.items.push({
                //     avatar: '',
                //     title: self.friends,
                //     subtitle: "Genral Manager"
                // })
            },
            close() {
                let self = this
                self.modalShow = false
            },
            open(userID, callback) {
                let self = this
                self.afterClose = callback;
                self.userID = userID;
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