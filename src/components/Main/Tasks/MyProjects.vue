<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card flat>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="headers" :items="filteredTasks" class="elevation-0 scrollable"
                            hide-actions>
                            <template v-slot:items="props">
                                <tr
                                    :style="{ backgroundColor: (props.item.subtask == true  ? 'lightgrey' : 'transparent' )}">
                                    <td>{{ props.item.planogram }}</td>
                                    <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                    <td>{{ status[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                                    <td>{{ props.item.storeCluster }}</td>
                                    <td>{{ props.item.categoryCluster }}</td>
                                    <td>{{ props.item.store }}</td>
                                    <td>{{ props.item.dateTimeString }}</td>
                                    <td>
                                        <v-btn v-if="props.item.type != -1 && props.item.type != 2" color="primary"
                                            small @click="routeToView(props.item)">View</v-btn>
                                    </td>
                                    <td style="width: 2%">
                                        <v-tooltip bottom v-if="props.item.notes != null">
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on">note</v-icon>
                                            </template>
                                            <span>{{ props.item.notes }}</span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <UserSelector ref="userSelector" />
        <AssignTask ref="assignTask" />
        <SubtaskModal ref="SubtaskModal" />
        <SpacePlanSelector ref="SpacePlanSelector"></SpacePlanSelector>
        <UserNotesModal ref="UserNotesModal"></UserNotesModal>
        <NotesModal ref="NotesModal"></NotesModal>
    </v-container>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import UserSelector from '@/components/Common/UserSelector'
    import AssignTask from '@/components/Common/AssignTask'
    import StatusHandler from '@/libs/system/projectStatusHandler'
    import SubtaskModal from './Subtask.vue'
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector.vue'
    import UserNotesModal from '@/components/Common/UserNotesModal.vue'
    import NotesModal from '@/components/Common/NotesModal.vue'
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    export default {
        name: 'Projects',
        props: ['searchTypeComp', 'dropSearchComp','projectData'],
        components: {
            UserSelector,
            AssignTask,
            SubtaskModal,
            SpacePlanSelector,
            UserNotesModal,
            NotesModal
        },
        data() {
            return {
                searchType: null,
                filterList: [],
                dropSearch: null,
                users: [],
                selectedUser: null,
                headers: [{
                        text: 'Project',
                        sortable: false
                    },
                    {
                        text: 'Type',
                        sortable: false
                    },
                    {
                        text: 'Status',
                        sortable: false
                    },
                    {
                        text: 'Store Cluster',
                        sortable: false
                    },
                    {
                        text: 'Category Cluster',
                        sortable: false
                    },
                    {
                        text: 'Store',
                        sortable: false
                    },
                    {
                        text: 'Date',
                        sortable: false
                    },
                    {
                        text: '',
                        sortable: false
                    },
                ],
                status: null,
                typeList: null,
                projects: [],
                projectsList: [],
                userAccess: null,
                userAccessTypeID: -1
            }
        },
        mounted() {
            let self = this;
            self.getLists(() => {
                // self.checkAccessType(() => {
                //     EventBus.$emit('data-loading');
                //     // self.getProjects()
                //     // self.getUsers()
                // })
            })
        },
        computed: {
            filteredTasks() {
                // filter for both buttons and field
                let self = this

                if (self.dropSearchComp == null && self.searchTypeComp == null) {
                    return this.projectData
                }

                if (this.searchTypeComp.length > 0 && self.dropSearchComp != null) {
                    let tmp = self.projectData.filter((tx) => {
                        if (self.searchTypeComp.includes(tx.type) && self.dropSearchComp == tx.planogram_ID) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                // search for buttons only                   
                if (self.searchTypeComp.length > 0) {
                    let tmp = self.projectData.filter((tx) => {
                        if (self.searchTypeComp.includes(tx.type)) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                //search for only field
                if (self.dropSearchComp != null) {
                    let tmp = self.projectData.filter((tx) => {

                        if (self.dropSearchComp == tx.planogram_ID) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                if (self.searchTypeComp.length == 0 && self.dropSearchComp == null) {
                    return self.projectData
                }
            }
        },
        methods: {
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
            filterOutSupplierPlanograms(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SupplierPlanogram?tenantLink_AccessTypeID=${self.userAccessTypeID}`)
                    .then(r => {
                        let supplierPlanograms = r.data;
                        let tmp = [];

                        self.projects.forEach(pt => {
                            let canAdd = false;

                            supplierPlanograms.forEach(sp => {
                                if (pt.planogram_ID == sp.planogram_ID)
                                    canAdd = true;
                            })

                            if (canAdd)
                                tmp.push(pt);
                        })
                        let tmpFilterlist = []
                        tmp.forEach(element => {
                            if (!tmpFilterlist.includes(element.planogram_ID)) {
                                tmpFilterlist.push({
                                    value: element.planogram_ID,
                                    text: element.planogram,
                                })
                            }
                        });
                        EventBus.$emit('filter-items-changed', tmpFilterlist);
                        self.projects = tmp;

                        callback();
                    })
            },
            // getProjects() {
            //     let self = this
            //     let encoded_details = jwt.decode(sessionStorage.accessToken);
            //     let systemUserID = encoded_details.USER_ID;
            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
            //     let filterList = []
            //     Axios.get(process.env.VUE_APP_API + `Project`).then(r => {
            //         filterList.push({
            //             text: "All",
            //             value: null
            //         })
            //         r.data.projectList.forEach(element => {
            //             filterList.push({
            //                 text: element.name,
            //                 value: element.planogram_ID
            //             })
            //         });

            //         Axios.get(process.env.VUE_APP_API + `GetLastTransactions`).then(res => {
            //             EventBus.$emit('data-loaded', systemUserID);
            //             self.projects = res.data.projectTXList;
            //             if (self.userAccess == 2) {
            //                 self.filterOutSupplierPlanograms(() => {
            //                     EventBus.$emit('data-loaded', systemUserID);

            //                 });
            //             } else {
            //                 EventBus.$emit('data-loaded', systemUserID);
            //                 EventBus.$emit('filter-items-changed', filterList);
            //             }
            //         })
            //     })


            // },
            getLists(callback) {
                let self = this
                let statusHandler = new StatusHandler()
                self.status = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()
                callback()
            },
            // getUsers() {
            //     let self = this
            //     let list = []
            //     Axios.get(process.env.VUE_APP_API +
            //         `SystemUser`).then(r => {

            //         r.data.forEach(e => {
            //             list.push({
            //                 text: e.firstname + " " + e.lastname,
            //                 value: e.systemUserID
            //             })
            //         })
            //         EventBus.$emit('stores-items-changed', list);
            //     })
            // },
            routeToView(item) {
                let self = this;
                let route;

                switch (item.type) {
                    case 1: {
                        route = `/DataPreparation`
                    }
                    break;
                case 2: {
                    route = `/RangePlanning/${item.rangeFileID}`
                }
                break;
                case 3: {
                    if (item.status == 1 || item.status == 8 || item.status == 41) {
                        route = `/SpacePlanning`
                    } else {
                        route =
                            `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${item.status}`
                    }
                }
                break;
                }

                self.$router.push(route);
            }
        },
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 240px);
        overflow: auto;
    }
</style>