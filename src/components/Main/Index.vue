<template>
    <div>
        <v-toolbar dark color="primary" app clipped-left>
            <v-btn icon @click="$router.push('/Apps')">
                <v-icon>home</v-icon>
            </v-btn>
            <!-- <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon> -->
            <span class="title ml-3 mr-5">Chain&nbsp;<span class="font-weight-light">Research</span></span>
            <v-spacer></v-spacer>
            <v-badge color="red" overlap>
                <!-- <template v-slot:badge>
                    <span>3</span>
                </template> -->
                <v-menu>
                    <v-btn icon slot="activator">
                        <v-avatar style="padding: 2px;" color="white" size="42">
                            <v-img ref="avatar" v-if="profile.image != ''" :src="avatarImage" :alt="''"></v-img>
                        </v-avatar>
                    </v-btn>
                    <v-card>
                        <v-list>
                            <v-list-tile avatar>
                                <v-list-tile-avatar style="padding: 2px;" color="white">
                                    <v-img ref="avatar" v-if="profile.image != ''" :src="avatarImage"></v-img>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ profile.firstname }} {{ profile.lastname }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>

                        <v-list dense offset-x right>
                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/User')">
                                <v-list-tile-avatar>
                                    <v-icon>account_circle</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Profile</v-list-tile-title>
                            </v-list-tile>

                            <v-divider v-if="profile.accountID != null"></v-divider>

                            <v-list-tile v-if="profile.accountID != null" @click="$router.push('/Account')">
                                <v-list-tile-avatar>
                                    <v-icon>lock</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Account</v-list-tile-title>
                            </v-list-tile>

                            <!-- <v-divider></v-divider> -->

                            <!-- <v-list-tile @click="$router.push('/Notifications')">
                                <v-list-tile-avatar>
                                    <v-icon>notifications</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Notifications</v-list-tile-title>
                            </v-list-tile> -->

                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/Settings')">
                                <v-list-tile-avatar>
                                    <v-icon>settings</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Settings</v-list-tile-title>
                            </v-list-tile>

                            <v-divider v-if="databases.length > 0"></v-divider>

                            <v-list-tile v-if="databases.length > 0" @click="sheet = true">
                                <v-list-tile-avatar>
                                    <v-icon>storage</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Databases</v-list-tile-title>
                            </v-list-tile>

                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/Login')">
                                <v-list-tile-avatar>
                                    <v-icon>exit_to_app</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Logout</v-list-tile-title>
                            </v-list-tile>
                        </v-list>

                    </v-card>
                </v-menu>
            </v-badge>
        </v-toolbar>
        <v-content>
            <v-img height="calc(100vh - 55px)" :src="backgroundImage" :alt="''">
                <v-card class="elevation-0"
                    style="background: url('./banner.png'); background-size: cover; background-position: center;">
                    <v-card-text style="height: 150px; position: relative; padding: 0px">
                        <router-view class="main-main"></router-view>
                    </v-card-text>
                </v-card>

                <!-- <router-view class="main-main"></router-view> -->
                <!-- <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear> -->
            </v-img>
        </v-content>
        <div class="text-xs-center">
            <v-bottom-sheet v-model="sheet">
                <v-list>
                    <v-subheader>Select database</v-subheader>
                    <v-list-tile v-for="(database, idx) in databases" :key="idx" @click="selectDatabase(database)">
                        <!-- <v-list-tile-avatar>
                            <v-avatar size="32px" tile>
                                <img :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`" :alt="tile.title">
                            </v-avatar>
                        </v-list-tile-avatar> -->
                        <v-list-tile-title>{{ database.databaseFriendly }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-bottom-sheet>
        </div>
        <v-snackbar :timeout="3000" v-model="snackbar" right>
            {{ snackbarText }}
            <v-btn dark flat @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    export default {
        name: 'main-page',
        data() {
            return {
                snackbarText: "",
                snackbar: false,
                sheet: false,
                avatarImage: '',
                backgroundImage: '',
                eventBus: null,
                drawer: false,
                showLoader: true,
                databases: [],
                profile: {
                    image: ''
                },
                settings: {
                    backgroundImage: ''
                },
                // reports: [new NavigationItem({
                //         title: 'Apps',
                //         icon: 'bar_chart',
                //         route: '/AppsReportList'
                //     }),
                //     new NavigationItem({
                //         title: 'System',
                //         icon: 'bar_chart',
                //         route: '/SystemReportList'
                //     })
                // ],
                topList: [
                    new NavigationItem({
                        title: 'Home',
                        icon: 'home',
                        route: '/Home'
                    }),
                    new NavigationItem({
                        title: 'Apps',
                        icon: 'apps',
                        route: '/Apps'
                    }),
                    // new NavigationItem({
                    //     title: "Store",
                    //     icon: "local_grocery_store",
                    //     route: "store",
                    // }),
                    // new NavigationItem({
                    //     title: 'Files',
                    //     icon: 'cloud',
                    //     route: '/Files'
                    // })
                ],
                tiles: [{
                        img: 'keep.png',
                        title: 'Keep'
                    },
                    {
                        img: 'inbox.png',
                        title: 'Inbox'
                    },
                    {
                        img: 'hangouts.png',
                        title: 'Hangouts'
                    },
                    {
                        img: 'messenger.png',
                        title: 'Messenger'
                    },
                    {
                        img: 'google.png',
                        title: 'Google+'
                    }
                ]
            }
        },
        created() {
            let self = this;
            this.getAccountDetails()
            self.eventBus = EventBus;
            self.eventBus.$off('display-picture-changed');
            self.eventBus.$off('background-picture-changed');
            self.eventBus.$off('show-loader');
        },
        mounted() {
            let self = this;

            self.eventBus.$on('display-picture-changed', newPicture => {
                self.avatarImage = newPicture;
                self.$router.go(-1);
            })

            self.eventBus.$on('background-picture-changed', newPicture => {
                self.backgroundImage = newPicture;
                self.$router.go(-1);
            })

            self.eventBus.$on('show-loader', show => {
                self.showLoader = show;
            })
        },
        methods: {
            getAccountDetails() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser?id=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.profile = r.data;
                        if (self.profile.image != undefined || self.profile.image != null) {
                            self.avatarImage = 'data:image/png;base64,' + self.profile.image;

                        }
                        self.getUserSettings(encoded_details.USER_ID);
                    })
            },
            getUserSettings(userID) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemUserSetting?systemUserID=${userID}`)
                    .then(r => {
                        self.settings = r.data;
                        if (r.data != null || r.data != undefined) {
                            if (self.settings.backgroundImage != undefined || self.settings.backgroundImage !=
                                null) {
                                self.backgroundImage = 'data:image/png;base64,' + self.settings.backgroundImage;

                            }
                        }

                        self.getDatabases(userID);
                    })
            },
            getDatabases(userID) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `TenantAccess?systemUserID=${userID}`)
                    .then(r => {
                        if (r.data.length > 0) {
                            self.databases = r.data;

                            if (r.data.length == 1) {
                                sessionStorage.currentDatabase = r.data[0].tenantID;
                            }
                        }
                    })
            },
            selectDatabase(database) {
                let self = this;

                sessionStorage.currentDatabase = database.tenantID;

                self.sheet = false;
                self.snackbarText = "You've entered " + database.databaseName;
                self.snackbar = true;
            }
        }
    }

    function NavigationItem(data) {
        this.title = data.title;
        this.icon = data.icon;
        this.route = data.route;
    }
</script>