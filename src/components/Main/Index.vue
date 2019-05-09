<template>
    <div>
        <v-toolbar dark color="primary" app clipped-left>
            <v-btn icon @click="$router.push('/Apps')">
                <v-icon>home</v-icon>
            </v-btn>
            <v-btn v-if="$route.path!='/tasks'" icon @click="$router.push('/tasks')">
                <v-icon>inbox</v-icon>
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

                            <v-divider></v-divider>

                            <v-list-tile @click="$router.push('/Tasks')">
                                <v-list-tile-avatar>
                                    <v-icon>inbox</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-title>Tasks</v-list-tile-title>
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
                avatarImage: `data:image/jpeg;base64,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`,
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
                            sessionStorage.currentDatabase = r.data[0].tenantID;
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