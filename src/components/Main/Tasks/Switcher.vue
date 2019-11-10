<template>
    <v-container fluid grid-list-xs pa-0>
        <v-layout row wrap>
            <v-flex v-if="hasDatabases" xs12 sm12 md12 class="pa-0">
                <v-card>
                    <v-toolbar flat dark dense color="grey darken-3">
                        <v-toolbar-items>
                            <v-text-field style="width: 400px; margin-top: -5px;" prepend-inner-icon="search"
                                placeholder="Search" v-model="filter_text">
                            </v-text-field>
                        </v-toolbar-items>
                        <v-spacer></v-spacer>
                        <v-btn-toggle v-if="userAccess != 3 " v-model="searchType" class="transparent" multiple>
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
                        <v-btn v-if="userAccess != 0 && userAccess != 4 && userAccess != 3" @click="shareProjects"
                            class="ml-2" small dark icon>
                            <v-icon>share</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-toolbar v-if="userAccess!=4" flat dark>
                        <v-toolbar-items>
                            <v-autocomplete v-if="selectedView==2 &&userAccess != 3 " @change="getStoreViewData()"
                                placeholder="Please Select a Store" :items="stores" v-model="selectedStore">
                            </v-autocomplete>
                            <v-autocomplete v-if="selectedView==2 &&userAccess == 3" disabled
                                @change="getStoreViewData()" placeholder="Please Select a Store" :items="stores"
                                v-model="selectedStore">
                            </v-autocomplete>
                            <v-autocomplete style="width: 400px;" v-if="selectedView==0" placeholder="users "
                                :items="users" v-model="selectedUser" @change="getTaskViewData"></v-autocomplete>
                            <v-btn class="ml-3" icon @click="homeView">
                                <v-icon>home</v-icon>
                            </v-btn>
                        </v-toolbar-items>
                        <v-btn v-if="userAccess == 0 || userAccess == 1"
                            color="primary" @click="startNewTask">Start new task</v-btn>
                        <v-btn color="primary" @click="sendMail">Send Mail</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-show="userAccess == 3" @click="$refs.guide.click()" dark outline>Help</v-btn>
                        <a style="display: none;" ref="guide" download
                            href="guides/CR TRAINING GUIDELINE 16.07.2019.pdf">guide</a>

                        <div v-if="userAccess !=3">
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-btn outline dark v-on="on">Hide</v-btn>
                                </template>
                                <v-list dense>
                                    <v-list-tile tile @click="change_view_state(0)">
                                        <v-list-tile-title>Sent Subtasks</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile tile @click="change_view_state(1)">
                                        <v-list-tile-title>Distributed</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile tile @click="change_view_state(2)">
                                        <v-list-tile-title>Implemented</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile tile @click="change_view_state(3)">
                                        <v-list-tile-title>Show All</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </div>
                        <v-btn-toggle v-model="selectedView" @change="onViewChanged" class="transparent" mandatory>
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
                                    <v-btn v-show="userAccess != 3" v-on="on" :value="1" flat>
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
                                <span>Planograms</span>
                            </v-tooltip>
                        </v-btn-toggle>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn @click="showOutstandingTasks" icon v-on="on" flat>
                                    <v-icon>access_time</v-icon>
                                </v-btn>
                            </template>
                            <span>Outstanding tasks</span>
                        </v-tooltip>

                        <!-- <v-btn v-show="selectedView==0" style="margin-left: 20px;" icon small color="secondary">
                            <v-icon @click="showNotices = !showNotices" v-if="showNotices">
                                visibility_off</v-icon>
                            <v-icon @click="showNotices = !showNotices" v-else>visibility</v-icon>
                        </v-btn> -->

                    </v-toolbar>
                    <v-container style="max-width: 100vw;" fluid grid-list-xs class="pa-0">
                        <v-layout row wrap class="pa-0">
                            <v-flex class="pa-0" xs12
                                v-if="selectedView==0">
                                <TaskView :accessType="userAccess" :data="filteredData" :typeList="typeList"
                                    :statusList="statusList" :systemUserID="selectedUser"
                                    :goToDistribution="goToDistribution" />
                            </v-flex>
                            <!-- <v-flex class="pa-0" v-if="selectedView==0 && showNotices"
                                :class="{ 'md2 sm6 xs6': showNotices, 'md1 sm1 xs1': !showNotices }">
                                <v-card tile flat style="border-left: 1px solid lightgrey;">
                                    <v-toolbar flat dark dense color="grey darken-3">
                                        <v-toolbar-title v-if="showNotices">Notices</v-toolbar-title>
                                    </v-toolbar>
                                    <v-card-text v-if="showNotices" class="scrollable">
                                        <NoticeBoard ref="NoticeBoard" />
                                    </v-card-text>
                                </v-card>
                            </v-flex> -->
                            <v-flex class="pa-0" md12 v-if="selectedView==1">
                                <PlanogramDistribution ref="PlanogramDistribution" :userAccess="userAccess" />
                                <!-- <ProjectView :data="filteredData" :typeList="typeList" :statusList="statusList"
                                    :accessType="userAccess" /> -->
                            </v-flex>
                            <v-flex md12 class="pa-0" v-if="selectedView==2">
                                <StoreView :rowdata="storeData" :typeList="typeList" :statusList="statusList"
                                    :getStoreViewData="getStoreViewData" />
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <SplashLoader ref="SplashLoader" />
                </v-card>
            </v-flex>
            <v-flex v-else md12>
                <v-card>
                    <v-card-text v-if="loading">
                        It appears as though you do not have access to any databases. Please request access to
                        continue...
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <ProjectShare ref="ProjectShare"></ProjectShare>
        <NewTask ref="NewTask"></NewTask>
        <AssignTask ref="AssignTask"></AssignTask>
        <SendMailModal ref="SendMailModal"></SendMailModal>
        <OutstandingTasks ref="OutstandingTasks" />
    </v-container>
</template>

<script>
    // Libs
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import StatusHandler from '@/libs/system/projectStatusHandler'
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    // Components
    import TaskView from "./TaskView/Index.vue"
    import ProjectView from "./ProjectView/Index.vue"
    import PlanogramDistribution from '../PlanogramImplementation/PlanogramOverView/StorePlanogramOverview'
    import StoreView from "./StoreView/StorePlanograms.vue"
    import SplashLoader from "@/components/Common/SplashLoader.vue"
    import ProjectShare from "./ProjectShare.vue"
    import NoticeBoard from '@/components/Main/NoticeBoard/Noticeboard.vue'
    import NewTask from './NewTask'
    import AssignTask from '@/components/Common/AssignTask'
    import SendMailModal from './SendMailModal.vue'
    import OutstandingTasks from './OutstandingTasks/Index'

    export default {
        components: {
            TaskView,
            ProjectView,
            StoreView,
            SplashLoader,
            ProjectShare,
            NoticeBoard,
            NewTask,
            AssignTask,
            PlanogramDistribution,
            SendMailModal,
            OutstandingTasks
        },
        data() {
            return {
                selectedProjectGroup: null,
                selectedProject: null,
                viewState: 0,
                show_subtasks: false,
                filter_text: "",
                statusList: [],
                typeList: [],
                // Filters
                users: [],
                selectedUser: null,
                stores: [],
                selectedStore: null,
                // Component Data
                taskViewData: [],
                projectViewData: [],
                storeViewData: [],
                userAccess: null,
                userAccessTypeID: -1,
                filterList: [],
                Search: null,
                dropSearch: null,
                searchType: [],
                selectedView: 0,
                systemUserID: -1,
                store_ID: null,
                storeData: null,
                StoreStatusList: [{
                        text: "Unassigned"
                    }, {
                        text: "Assigned"
                    },
                    {
                        text: "Distrubuted"
                    },
                    {
                        text: "Implementation In Progress"
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "Variation"
                    }, {
                        text: "On Hold"
                    }, {
                        text: "Recalled"
                    }
                ],
                views: [{
                    text: "Tasks",
                    value: 0
                }, {
                    text: "My Projects",
                    value: 1
                }, {
                    text: "Space Planning",
                    value: 2
                }, ],
                showNotices: true,
                hasDatabases: false,
                loading: true
            }
        },
        mounted() {
            let self = this
            self.getData()
        },
        computed: {
            filteredData() {
                let self = this
                let filterData = []

                switch (self.selectedView) {
                    case 0: {
                        filterData = self.filter_off_of_view(self.taskViewData);
                    }
                    break;
                case 1: {
                    filterData = self.filter_off_of_view(self.projectViewData);
                }
                break;
                case 2: {
                    filterData = self.filter_off_of_view(self.storeViewData);
                }
                break;
                }

                if (self.filter_text == "" && self.searchType.length == 0) {
                    return filterData;
                } else if (self.filter_text != "" && self.searchType.length == 0) {
                    return filterData.filter(e => {
                        if (e.planogram.toUpperCase().indexOf(self.filter_text.toUpperCase()) > -1) {
                            return e.planogram;
                        }
                    })
                } else if (self.filter_text == "" && self.searchType.length > 0) {
                    return filterData.filter(e => {
                        if (self.searchType.indexOf(e.type) > -1) {
                            return e.planogram;
                        }
                    })
                } else if (self.filter_text != "" && self.searchType.length > 0) {
                    return filterData.filter(e => {
                        if (e.planogram.toUpperCase().indexOf(self.filter_text.toUpperCase()) > -1 && self
                            .searchType.indexOf(e.type) > -1) {
                            return e.planogram;
                        }
                    })
                }
            }
        },
        methods: {
            showOutstandingTasks() {
                let self = this;
                self.$refs.OutstandingTasks.show();
            },
            change_view_state(viewState) {
                let self = this;
                self.viewState = viewState
                // self.getData();
            },
            filter_off_of_view(items) {
                let self = this;
                let tmp = [];

                items.forEach(el => {
                    if (self.can_view(el))
                        tmp.push(el);
                })

                return tmp;
            },
            can_view(item) {
                let self = this;

                let canView = false;

                switch (self.viewState) {
                    case 0: {
                        if (item.status == 6 && item.rollingUserID == self.selectedUser)
                            canView = false;
                        else
                            canView = true;
                    }
                    break;
                case 1: {
                    if (item.status == 27 || item.status == 21)
                        canView = false;
                    else
                        canView = true;
                }
                break;
                case 2: {
                    if (item.status == 24 || item.status == 26)
                        canView = false;
                    else
                        canView = true;
                }
                break;
                case 3: {
                    canView = true;
                }
                }

                return canView;
            },
            getData() {
                let self = this;
                self.getDatabases(() => {
                    if (self.hasDatabases) {
                        self.getLists(() => {
                            self.checkAccessType(() => {
                                self.getUsers(() => {
                                    self.getStores(() => {
                                        self.getTaskViewData(() => {
                                            self.loading =
                                                false;
                                        })
                                    })
                                })
                            })
                        })
                    } else {
                        self.loading = false;
                    }
                })
            },
            getDatabases(callback) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                Axios.get(process.env.VUE_APP_API + `TenantAccess?systemUserID=${systemUserID}`)
                    .then(r => {
                        if (r.data.length > 0)
                            self.hasDatabases = true;
                        callback();
                    })
            },
            getLists(callback) {
                let self = this
                let statusHandler = new StatusHandler()
                self.statusList = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()
                callback()
            },
            checkAccessType(callback) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                self.selectedUser = systemUserID;
                self.systemUserID = systemUserID;

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${sessionStorage.currentDatabase}`)
                    .then(r => {
                        if (r.data.isDatabaseOwner == true) {
                            self.userAccess = 0
                        } else {
                            console.log("[tenenant]");
                            console.log(r.data);

                            self.userAccess = r.data.tenantLink_AccessTypeList[0].accessType
                            self.userAccessTypeID = r.data.tenantLink_AccessTypeList[0].tenantLink_AccessTypeID
                            if (self.userAccess == 3) {
                                self.selectedStore = r.data.tenantLink_AccessTypeList[0].storeID
                                self.store_ID = r.data.tenantLink_AccessTypeList[0].storeID
                            }
                        }
                        callback();
                    })
            },
            changeView(item) {
                let self = this
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
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                self.selectedUser = systemUserID;
                self.selectedView = 0;
                self.selectedStore = null
                self.dropSearch = null;
                self.getTaskViewData();
            },
            onViewChanged() {
                let self = this;

                self.$nextTick(() => {
                    self.dropSearch = null
                    switch (self.selectedView) {
                        case 0: {
                            self.selectedStore = null
                            self.getTaskViewData(() => {});
                        }
                        break;
                    case 1: {
                        self.selectedStore = null
                        self.getProjectViewData(() => {});
                    }
                    break;
                    case 2: {
                        self.getStoreViewData(() => {});
                    }
                    break;
                    }
                })
            },
            getTaskViewData(callback) {
                let self = this;
                self.$refs.SplashLoader.show()
                let filterList = []
                self.$nextTick(() => {
                    self.taskViewData = [];

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${self.selectedUser}`).then(r => {

                            filterList.push({
                                text: "All",
                                value: null
                            })

                            self.taskViewData = r.data.projectTXList;
                            delete Axios.defaults.headers.common["TenantID"];

                            if (self.userAccess == 2) {
                                self.filterOutSupplierPlanograms(() => {
                                    if (callback != undefined) {
                                        self.$refs.SplashLoader.close()
                                        callback();
                                    }
                                });
                            } else {
                                if (callback != undefined) {
                                    self.$refs.SplashLoader.close()
                                    callback();
                                }
                            }

                            self.taskViewData.forEach(e => {
                                if (!filterList.includes(e.planogram_ID)) {
                                    filterList.push({
                                        text: e.planogram,
                                        value: e.planogram_ID
                                    })
                                    self.$refs.SplashLoader.close()

                                }
                            })

                            self.filterList = filterList
                            self.$refs.SplashLoader.close()

                        })
                        .catch(e => {
                            self.$refs.SplashLoader.close()

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },
            getProjectViewData() {
                let self = this
                self.$refs.SplashLoader.show()

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let filterList = []

                self.projectViewData = [];

                Axios.get(process.env.VUE_APP_API + `ProjectTX/TakeoverView`).then(r => {
                    filterList.push({
                        text: "All",
                        value: null
                    })

                    self.projectViewData = r.data.takeoverViewList;
                    self.$refs.SplashLoader.close()

                    // Axios.get(process.env.VUE_APP_API + `GetLastTransactions`).then(res => {

                    //     if (self.userAccess == 2) {
                    //         self.filterOutSupplierPlanograms(() => {
                    //             self.projectViewData.forEach(e => {
                    //                 if (!filterList.includes(e.planogram_ID)) {
                    //                     filterList.push({
                    //                         text: e.planogram,
                    //                         value: e.planogram_ID
                    //                     })
                    //                 }
                    //             })

                    //             self.filterList = filterList
                    //             self.$refs.SplashLoader.close()
                    //         });
                    //     } else {
                    //         self.projectViewData.forEach(e => {
                    //             if (!filterList.includes(e.planogram_ID)) {
                    //                 filterList.push({
                    //                     text: e.planogram,
                    //                     value: e.planogram_ID
                    //                 })
                    //             }
                    //         })

                    //         self.filterList = filterList
                    //         self.$refs.SplashLoader.close()
                    //     }
                    //     console.log("Switcher", self.projectViewData);

                    // })
                })


            },
            getStoreViewData(callback) {
                let self = this
                let store = null
                self.$refs.SplashLoader.show()
                let filterList = []
                if (self.selectedStore == null) {
                    store = self.store_ID
                    if (store == null) {
                        self.selectedStore = self.stores[0].value
                        store = self.selectedStore
                    }
                } else {
                    store = self.selectedStore
                }
                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `Store_Planogram/Store?Store_ID=${store}`)
                        .then(r => {

                            let currentStorePlanograms = []
                            currentStorePlanograms = r.data.queryResult;

                            r.data.queryResult.forEach((e) => {
                                e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus]
                                    .text
                            })

                            self.storeData = currentStorePlanograms
                            self.$refs.SplashLoader.close()
                        }).catch(e => {
                            console.log(e);

                        })

                    // Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    // Axios.get(process.env.VUE_APP_API + `StoreProjectTX`).then(r => {
                    //     self.storeViewData = r.data.projectTXList;
                    //     if (self.userAccess == 2) {
                    //         self.filterOutSupplierPlanograms(() => {

                    //             filterList.push({
                    //                 text: "All",
                    //                 value: null
                    //             })

                    //             self.storeViewData.forEach(e => {
                    //                 if (!filterList.includes(e.planogram_ID)) {
                    //                     filterList.push({
                    //                         text: e.planogram,
                    //                         value: e.planogram_ID
                    //                     })
                    //                 }
                    //             })
                    //             self.filterList = filterList
                    //             self.$refs.SplashLoader.close()
                    //         })
                    //     } else {
                    //         filterList.push({
                    //             text: "All",
                    //             value: null
                    //         })
                    //         self.storeViewData.forEach(e => {
                    //             if (!filterList.includes(e.planogram_ID)) {
                    //                 filterList.push({
                    //                     text: e.planogram,
                    //                     value: e.planogram_ID
                    //                 })
                    //             }
                    //         })
                    //         self.filterList = filterList
                    //         self.$refs.SplashLoader.close()
                    //     }
                    // })
                })
            },
            filterOutSupplierPlanograms(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SupplierPlanogram?tenantLink_AccessTypeID=${self.userAccessTypeID}`)
                    .then(r => {
                        let supplierPlanograms = r.data;
                        let tmp = [];

                        self[self.getSelectedView() + "ViewData"].forEach(pt => {
                            let canAdd = false;

                            supplierPlanograms.forEach(sp => {
                                if (pt.planogram_ID == sp.planogram_ID) {
                                    canAdd = true;
                                }
                            })

                            if (canAdd) {
                                tmp.push(pt);
                            }
                        })

                        self[self.getSelectedView() + "ViewData"] = tmp;
                        console.log(self[self.getSelectedView() + "ViewData"])
                        callback();
                    })
            },
            getStores(callback) {
                let self = this
                let list = []

                Axios.get(process.env.VUE_APP_API + `Store?db=Hinterland-Live`).then(r => {
                    r.data.forEach(element => {

                        list.push({
                            text: element.storeName,
                            value: element.storeID
                        })
                    });

                    self.stores = list
                    callback();
                })
            },
            getUsers(callback) {
                let self = this
                let list = []
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.users = [];

                if (self.userAccess == 0) {
                    Axios.get(process.env.VUE_APP_API + `SystemUser`).then(r => {
                        r.data.forEach(e => {
                            list.push({
                                text: e.firstname + " " + e.lastname,
                                value: e.systemUserID
                            })
                        })

                        self.users = list
                    })
                } else {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `SystemUser/${encoded_details.USER_ID}`).then(res => {
                        list.push({
                            text: res.data.firstname + " " + res.data.lastname,
                            value: encoded_details.USER_ID
                        })
                    })

                    Axios.get(process.env.VUE_APP_API + `ProjectSharedViewShared?userID=${encoded_details.USER_ID}`)
                        .then(r => {

                            r.data.projectSharedViewList.forEach(e => {

                                list.push({
                                    text: e.userName,
                                    value: e.systemUserID
                                })
                            })

                            delete Axios.defaults.headers.common["TenantID"];
                            self.users = list
                        })
                }
                callback()
            },
            getSelectedView() {
                let self = this;
                let retval;

                switch (self.selectedView) {
                    case 0: {
                        retval = "task"
                    }
                    break;
                case 1: {
                    retval = "project"
                }
                break;
                case 2: {
                    retval = "store"
                }
                break;
                }

                return retval;
            },
            startNewTask() {
                let self = this;

                self.$refs.NewTask.show(data => {
                    let projectTXGroupRequest = {
                        projectID: data.project
                    }

                    self.createProjectTransactionGroup(projectTXGroupRequest, projectTXGroup => {

                        let status = 6 + (data.task - 1);

                        let txRequest = {
                            type: data.task,
                            status: status,
                            systemUserID: data.user,
                            projectTXGroup_ID: projectTXGroup.id,
                            project_Group_ID: data.projectGroup,
                            project_ID: data.project,
                            rangeFileID: data.rangeFile,
                            systemFileID: data.spacePlanFile,
                            store_ID: data.store,
                            storeCluster_ID: data.storeCluster,
                            categoryCluster_ID: data.categoryCluster,
                            customCluster_ID: data.customCluster,
                            notes: data.notes
                        }

                        self.createProjectTransaction(txRequest, newItem => {

                        })
                    })
                })
            },
            createProjectTransactionGroup(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTXGroup`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTXGroup);
                })
            },
            createProjectTransaction(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTX)
                })
            },
            goToDistribution(item) {
                let self = this;
                self.selectedProjectGroup = item.project_Group_ID;
                self.selectedProject = item.project_ID;
                self.selectedView = 1;

                setTimeout(() => {
                    self.$refs.PlanogramDistribution.setView(item.project_Group_ID, item.project_ID, () => {});
                }, 1000);
            },
            sendMail(item) {
                let self = this;

                self.$refs.SendMailModal.show(modalData => {
                    let request = {
                        systemUserID: null,
                        notes: null,
                        projectTXGroup_ID: null,
                        type: null,
                        status: null,
                        project_ID: modalData.project,
                        project_Group_ID: modalData.projectGroup
                    };

                    let projectTXGroupRequest = {
                        projectID: modalData.project
                    }

                    self.createProjectTransactionGroup(projectTXGroupRequest, newGroup => {
                        request.systemUserID = modalData.systemUserID;
                        request.actionedByUserID = null;
                        request.rollingUserID = null;
                        request.notes = modalData.notes;
                        request.projectTXGroup_ID = newGroup.id;
                        request.type = 7;
                        request.status = 43;
                        self.createProjectTransaction(request, data => {})
                    })
                })
            },
        }
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 222px);
        overflow: auto;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        font-family: sans-serif;
    }

    table,
    th,
    td {
        border: 1px solid rgb(199, 199, 199);
        border-left: 0px !important;
        border-right: 0px !important;
        font-size: 13px;
        text-align: left;
    }

    th {
        padding: 5px 0px;
    }

    td {
        border-bottom: 0px !important;
        font-size: 12px;
        padding: 0px 2px;
    }
</style>