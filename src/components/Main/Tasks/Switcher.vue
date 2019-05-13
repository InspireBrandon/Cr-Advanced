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
                        <v-btn v-if="userAccess != 0 && userAccess != 4" @click="shareProjects" class="ml-2" small dark
                            icon>
                            <v-icon>share</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-toolbar v-if="userAccess!=4" dense flat dark>
                        <v-autocomplete v-if="selectedView==2" placeholder="Please Select a Store" :items="users"
                            v-model="selectedUser" @change="changeStore(selectedUser)"></v-autocomplete>
                        <v-autocomplete v-if="selectedView==0" placeholder="users " :items="users"
                            v-model="selectedUser" @change="changeView(selectedUser)"></v-autocomplete>
                        <v-btn icon @click="homeView">
                            <v-icon>home</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-btn-toggle v-model="selectedView" @change="getData(selectedView)" class="transparent"
                            mandatory>
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
                    <Tasks :searchTypeComp="searchType" :dropSearchComp="dropSearch" :taskData="taskViewData"
                        v-if="selectedView==0" />
                    <MyProjects :searchTypeComp="searchType" :dropSearchComp="dropSearch" :projectData="projectViewData" v-if="selectedView==1" />
                    <Planograms ref="Planograms" :searchTypeComp="searchType" :storeData="storeViewData"
                        :dropSearchComp="dropSearch" v-if="selectedView==2" />
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
                tmpStores: [],
                tmpUsers: [],
                systemUserID: null,
                taskViewData: [],
                storeViewData: [],
                projectViewData:[],
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
            EventBus.$on('get-tasks', list => {
                self.getTransactionsByUser(self.selectedUser)
            });

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
            let encoded_details = jwt.decode(sessionStorage.accessToken);

            let systemUserID = encoded_details.USER_ID;
            self.systemUserID = systemUserID;
            self.selectedUser = systemUserID
            self.checkAccessType(() => {
                self.getUsers(() => {
                    self.getData(self.selectedView)
                    self.getStores()
                })
            })
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
                            self.userAccessTypeID = r.data.tenantLink_AccessTypeList[0].tenantLink_AccessTypeID
                        }

                        callback();
                    })
            },
            changeView(item) {
                let self = this
                self.getTransactionsByUser(item)
                // self.$nextTick(() => {
                //     EventBus.$emit('user-select-changed', item);
                // })
            },
            changeStore(selectedUser) {
                let self = this
                self.$nextTick(() => {
                    self.getStoreViewData(selectedUser)
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
            },
            getData(selectedView) {
                let self = this
                switch (selectedView) {
                    case 0: {
                        self.getTaskViewData()
                        self.users = self.tmpUsers

                    }
                    break;
                case 1: {
                    self.getProjectViewData()
                }
                break;
                case 2: {
                    // self.getStoreViewData()
                    self.users = self.tmpStores
                }
                break;
                }
            },
            getTaskViewData() {
                let self = this
                console.log("[SWITCHER] getting tasks");
                self.getTransactionsByUser(self.selectedUser, callback => {
                    self.$refs.SplashLoader.close()
                })

            },
            getProjectViewData() {
                let self = this
                console.log("[SWITCHER] getting Projects");

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let filterList = []
                Axios.get(process.env.VUE_APP_API + `Project`).then(r => {
                    filterList.push({
                        text: "All",
                        value: null
                    })
                    r.data.projectList.forEach(element => {
                        filterList.push({
                            text: element.name,
                            value: element.planogram_ID
                        })
                    });

                    Axios.get(process.env.VUE_APP_API + `GetLastTransactions`).then(res => {
                        EventBus.$emit('data-loaded', systemUserID);
                        self.projectViewData = res.data.projectTXList;
                        if (self.userAccess == 2) {
                            self.filterOutSupplierPlanograms(() => {
                                // EventBus.$emit('data-loaded', systemUserID);

                            });
                        } else {
                            // EventBus.$emit('data-loaded', systemUserID);
                            // EventBus.$emit('filter-items-changed', filterList);
                        }
                    })
                })


            },
            getTransactionsByUser(systemUserID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`).then(r => {
                        self.taskViewData = r.data.projectTXList;

                        console.log(r);

                        delete Axios.defaults.headers.common["TenantID"];
                        if (self.userAccess == 2) {
                            self.filterOutSupplierPlanograms(() => {
                                self.getfilterList()
                                callback();
                            });
                        } else {
                            self.getfilterList()
                            callback();
                        }
                    })
                    .catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getfilterList() {
                let self = this
                self.filterList = []
                self.filterList.push({
                    text: "All",
                    value: null
                })
                self.taskViewData.forEach(element => {
                    if (!self.filterList.includes(element.planogram_ID)) {
                        self.filterList.push({
                            value: element.planogram_ID,
                            text: element.planogram,
                        })
                    }
                });
            },
            getStoreViewData(storeID) {
                let self = this
                // EventBus.$emit('data-loading');
                console.log("[SWITCHER] getting stores");
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `StoreProjectTX?storeID=${storeID}`).then(r => {
                    let tmp = r.data.projectTXList
                    if (self.userAccess == 2) {
                        self.filterOutSupplierPlanograms(callback => {
                            self.storeViewData = tmp
                        })
                    } else {
                        self.storeViewData = tmp
                    }


                })
            },
            filterOutSupplierPlanograms(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SupplierPlanogram?tenantLink_AccessTypeID=${self.userAccessTypeID}`)
                    .then(r => {
                        let supplierPlanograms = r.data;
                        let tmp = [];

                        self.projectTransactions.forEach(pt => {
                            let canAdd = false;

                            supplierPlanograms.forEach(sp => {
                                if (pt.planogram_ID == sp.planogram_ID)
                                    canAdd = true;
                            })

                            if (canAdd)
                                tmp.push(pt);
                        })

                        self.projectTransactions = tmp;

                        callback();
                    })
            },
            getStores() {
                let self = this
                let list = []
                //  Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Store?db=Hinterland-Live`).then(r => {
                    r.data.forEach(element => {
                        list.push({
                            text: element.storeName,
                            value: element.storeID
                        })
                    });
                    // EventBus.$emit('stores-items-changed', list);
                    self.tmpStores = list
                })
            },

            getUsers(callback) {
                let self = this
                console.log("self.users");
                let list = []
                self.users = []
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                if (self.userAccess == 0) {
                    Axios.get(process.env.VUE_APP_API + `SystemUser`).then(r => {
                        r.data.forEach(e => {
                            list.push({
                                text: e.firstname + " " + e.lastname,
                                value: e.systemUserID
                            })
                        })

                        self.tmpUsers = list
                        self.users = self.tmpUsers
                        console.log(self.users);
                    })
                } else {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectSharedViewShared?userID=${encoded_details.USER_ID}`)
                        .then(r => {
                            r.data.projectSharedViewList.forEach(e => {

                                list.push({
                                    text: e.userName,
                                    value: e.systemUserID
                                })
                            })
                            // EventBus.$emit('stores-items-changed', list);
                            delete Axios.defaults.headers.common["TenantID"];
                            self.tmpUsers = list
                            self.users = self.tmpUsers
                            console.log(self.users);
                        })
                }


                callback()
            },

        }
    }
</script>