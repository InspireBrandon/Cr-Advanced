<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex md12>
                <v-card>
                    <v-toolbar flat dark dense color="primary">
                        <!-- <v-text-field prepend-inner-icon="search" placeholder="Search" dark></v-text-field> -->
                        <v-autocomplete prepend-inner-icon="search" placeholder="Search" :items="filterList"
                            v-model="dropSearch">
                        </v-autocomplete>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>

                        <v-btn-toggle v-model="searchType" class="transparent" multiple>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="1" flat>
                                        <v-icon>
                                            perm_data_setting</v-icon>
                                    </v-btn>
                                </template>
                                <span>Data-Prep</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="2" flat>
                                        <v-icon>assessment</v-icon>
                                    </v-btn>
                                </template>
                                <span>Ranging</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="3" flat>
                                        <v-icon>web</v-icon>
                                    </v-btn>
                                </template>
                                <span>Planogram</span>
                            </v-tooltip>
                        </v-btn-toggle>
                        <v-btn v-if="userAccess != 0 && userAccess != 4" @click="shareProjects" class="ml-2" small dark icon>
                            <v-icon>share</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-toolbar v-if="userAccess!=4" dense flat dark>
                        <v-autocomplete v-if="selectedView==2" placeholder="Please Select a Store" :items="users"
                            v-model="selectedUser" @change="changeStore()"></v-autocomplete>
                        <v-autocomplete v-if="selectedView==0" placeholder="users " :items="users"
                            v-model="selectedUser" @change="changeView(selectedUser)"></v-autocomplete>
                        <v-btn icon @click="homeView">
                            <v-icon>home</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-btn-toggle v-model="selectedView" class="transparent" mandatory>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="0" flat>
                                        <v-icon>
                                            all_inbox</v-icon>
                                    </v-btn>
                                </template>
                                <span>Tasks</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="1" flat>
                                        <v-icon>bookmarks</v-icon>
                                    </v-btn>
                                </template>
                                <span>Projects</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="2" flat>
                                        <v-icon>account_balance</v-icon>
                                    </v-btn>
                                </template>
                                <span>Stores</span>
                            </v-tooltip>
                        </v-btn-toggle>
                    </v-toolbar>
                    <Tasks :searchTypeComp="searchType" :dropSearchComp="dropSearch" v-if="selectedView==0" />
                    <MyProjects :searchTypeComp="searchType" :dropSearchComp="dropSearch" v-if="selectedView==1" />
                    <Planograms ref="Planograms" :searchTypeComp="searchType" :dropSearchComp="dropSearch"
                        v-if="selectedView==2" />
                    <SplashLoader ref="SplashLoader" />
                </v-card>
            </v-flex>
        </v-layout>
        <ProjectShare ref="ProjectShare"></ProjectShare>
    </v-container>
</template>

<script>
    import Tasks from "./Index.vue"
    import MyProjects from "./MyProjects.vue"
    import Planograms from "./Planograms.vue"
    import SplashLoader from "@/components/Common/SplashLoader.vue"
    import jwt from 'jsonwebtoken';
    import Axios from 'axios';
    import ProjectShare from "./ProjectShare.vue"

    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    export default {
        components: {
            Tasks,
            MyProjects,
            Planograms,
            SplashLoader,
            ProjectShare
        },
        data() {
            return {
                placeHolder: null,
                userAccess: null,
                filterList: [],
                Search: null,
                dropSearch: null,
                searchType: [],
                selectedUser: null,
                users: [],
                selectedView: 0,
                views: [{
                    text: "Tasks",
                    value: 0
                }, {
                    text: "My Projects",
                    value: 1
                }, {
                    text: "Space Planning",
                    value: 2
                }, ]
            }
        },
        mounted() {
            let self = this
            self.checkAccessType(() => {})

            EventBus.$on('filter-items-changed', list => {
                self.filterList = []
                self.filterList = list;
            });
            EventBus.$on('stores-items-changed', list => {
                self.users = []
                self.users = list;
            });
            EventBus.$on('data-loaded', list => {
                self.$refs.SplashLoader.close()
            });
            EventBus.$on('data-loading', list => {
                self.$refs.SplashLoader.show()
            });
        },
        created() {
            let self = this

            EventBus.$off('filter-items-changed');
            EventBus.$off('stores-items-changed');
            EventBus.$off('data-loaded');
            EventBus.$off('data-loading');
        },
        methods: {
            sendProp(item) {
                let self = this
                self.$nextTick(() => {
                    self.placeHolder = item
                })
            },
            checkAccessType(callback) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${encoded_details.USER_ID}&tenantID=${sessionStorage.currentDatabase}`
                    )
                    .then(r => {
                        if (r.data.isDatabaseOwner == true) {
                            self.userAccess = 0
                        } else {
                            self.userAccess = r.data.tenantLink_AccessTypeList[0].accessType
                        }
                        callback()
                    })
            },
            changeView(item) {
                let self = this

                self.$nextTick(() => {
                    EventBus.$emit('user-select-changed', item);
                })
            },
            changeStore() {
                let self = this
                self.$nextTick(() => {
                    self.$refs.Planograms.getData(self.selectedUser)
                })
            },
            shareProjects() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.$refs.ProjectShare.show(selectedUsers => {
                    Axios.post(process.env.VUE_APP_API + `ProjectSharedView?userID=${encoded_details.USER_ID}`,
                            selectedUsers)
                        .then(r => {})
                });
            },
            homeView() {
                let self = this;
                self.selectedView = 0;
                self.selectedUser = null;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                EventBus.$emit('user-select-changed', encoded_details.USER_ID);
            }
        }
    }
</script>