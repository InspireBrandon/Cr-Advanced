<template>
    <div>
        <v-navigation-drawer temporary hide-overlay clipped v-model="drawer" floating app>
            <v-layout column fill-height>
                <v-toolbar flat class="transparent">
                    <v-list class="pa-0">
                        <v-list-tile avatar>
                            <v-list-tile-avatar tile>
                                <img src="data:image/png;base64,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">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>Chain Research</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>
                <v-list>
                    <v-list-tile v-for="(item, idx) in topList" :key="idx" @click="$router.push(item.route)">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>


                </v-list>
                <v-expansion-panel class="elevation-0">
                    <v-expansion-panel-content class="elevation-0">
                        <template v-slot:header>
                            <div>
                                <v-icon dark left>bar_chart</v-icon>
                                Reports
                            </div>
                        </template>
                        <v-list-tile v-for="(item, idx) in reports" :key="idx" @click="$router.push(item.route)">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-spacer></v-spacer>
                <!-- <v-list>
                    <v-list-tile v-for="(item, idx) in bottomList" :key="idx" @click="$router.push(item.route)">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list> -->
            </v-layout>
        </v-navigation-drawer>
        <v-toolbar dark color="primary" app clipped-left>
            <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
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
                                    <v-list-tile-title>{{ profile.firstname }} {{ profile.lastname }}</v-list-tile-title>
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

                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/Account')">
                                <v-list-tile-avatar>
                                    <v-icon>lock</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Account</v-list-tile-title>
                            </v-list-tile>

                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/Notifications')">
                                <v-list-tile-avatar>
                                    <v-icon>notifications</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Notifications</v-list-tile-title>
                            </v-list-tile>

                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/Settings')">
                                <v-list-tile-avatar>
                                    <v-icon>settings</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Settings</v-list-tile-title>
                            </v-list-tile>

                            <v-divider></v-divider>

                            <v-list-tile @click="sheet = true">
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
                <v-card class="elevation-0" style="background: url('./banner.png'); background-size: cover; background-position: center;">
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
                        <v-list-tile-title>{{ database.databaseName }}</v-list-tile-title>
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
                reports: [new NavigationItem({
                        title: 'Apps',
                        icon: 'bar_chart',
                        route: '/AppsReportList'
                    }),
                    new NavigationItem({
                        title: 'System',
                        icon: 'bar_chart',
                        route: '/SystemReportList'
                    })
                ],
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
                    new NavigationItem({
                        title: "Store",
                        icon: "local_grocery_store",
                        route: "store",
                    }),

                    new NavigationItem({
                        title: 'Files',
                        icon: 'cloud',
                        route: '/Files'
                    })
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
                            if (self.settings.backgroundImage != undefined || self.settings.backgroundImage != null) {
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
                        self.databases = r.data;
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