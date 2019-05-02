<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-toolbar-title>
                Allocation Tool
            </v-toolbar-title>
            <v-btn icon @click="$router.go(-1)">
                <v-icon>arrow_back</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md6>
                    <v-autocomplete label="project" :items="Projects" v-model="selected"
                        @change="getTransactions(selected)">

                    </v-autocomplete>
                </v-flex>
                <v-flex md6>
                    <v-btn color="success" @click="AddSelectedToNew()">
                        Add selected to new Group
                    </v-btn>
                    <v-btn color="success" @click="AddSelectedToExisting()">
                        Add selected existing group
                    </v-btn>
                </v-flex>

                <v-flex>
                    <v-card flat style="height: calc(100vh - 300px); overflow: auto;">
                        <v-data-table :headers="headers" :items="ProjectTXs" hide-actions>
                            <template v-slot:items="props">
                                <tr :color="typeList[props.item.type == -1 ? 5 : props.item.type].color">
                                    <td>
                                        <div>{{ props.item.dateTimeString }}</div>
                                    </td>
                                    <td>
                                        <div>{{typeList[props.item.type == -1 ?  5 :  props.item.type].text}}</div>
                                    </td>
                                    <td>
                                        {{status[props.item.status].friendly }}
                                    </td>
                                    <td>
                                        <div>{{ props.item.store}}</div>
                                    </td>
                                    <td>
                                        <div>{{ props.item.storeCluster}}</div>
                                    </td>
                                    <td>{{ props.item.categoryCluster }}</td>
                                    <td>
                                        <div>{{ props.item.username}}</div>
                                    </td>
                                    <td>
                                        <div>{{ props.item.actionedByUserName }}</div>
                                    </td>
                                    <td>
                                        {{props.item.projectTXGroup_ID }}
                                        {{props.item.projectTXGroup_ID ==null?"NO":"YES"}}
                                    </td>
                                    <td>
                                        <v-checkbox v-model="selectedfield" :label="props.item.name"
                                            :value="props.item">
                                        </v-checkbox>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card>

                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal';

    import ProjectModal from './ProjectModal.vue'
    import ProjectTXModal from './ProjectTXModal.vue'
    import ProjectGroupModal from './ProjectGroupModal.vue'

    import StatusHandler from '@/libs/system/projectStatusHandler'

    import Axios from 'axios'
    import jwt from 'jsonwebtoken';
    export default {
        data() {
            return {
                toggle: false,
                selected: null,
                selectedfield: [],
                menu: null,
                timePicker: "00:00",
                datePicker: null,
                drawer: null,
                project: null,
                Projects: [],

                typeList: [],
                headers: [{
                    text: "Date",
                    sortable: false,
                    value: "dateTimeString"
                }, {
                    text: "Type",
                    sortable: false,
                    value: "type"
                }, {
                    text: "Status",
                    sortable: false,

                }, {
                    text: "Store",
                    sortable: false
                }, {
                    text: "Store Cluster",
                    sortable: false
                }, {
                    text: "Category Cluster",
                    sortable: false
                }, {
                    text: "Assigned User",
                    sortable: false
                }, {
                    text: "Actioned by user",
                    sortable: false
                }, {
                    text: "Grouped",
                    sortable: false
                }, {
                    text: "Actions",
                    sortable: false
                }],
                ProjectTXs: [],
                status: [],
                stores: [],
                ProjectsGroups: [],
                storeObjects: [],
                StoreClusters: [],
                databaseUsers: [],
                users: [{
                    text: "None",
                    value: null
                }],
                tmp: [],


            }
        },
        mounted() {
            let self = this
            this.getProjects()
            this.getTypeList()
            this.getStatusList()
            this.getstores()
            this.getStoreClusters()
            this.getDatabaseUsers()
            this.getProjectGroups()

        },
        methods: {
            AddSelectedToNew() {
                let self = this
                console.log("self.selectedfield");
                console.log(self.selectedfield);
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;


                let txGroupProjectID = {
                    ProjectID: self.selected
                }

                Axios.post(process.env.VUE_APP_API + `ProjectTXGroup`, txGroupProjectID).then(r => {
                    console.log(r);


                    self.selectedfield.forEach(element => {
                        element.ProjectTXGroup_ID = r.data.projectTXGroup.id
                        Axios.put(process.env.VUE_APP_API + `ProjectTX`, element).then(
                            resp => {
                                console.log(resp.data);

                            })
                    })

                    delete Axios.defaults.headers.common["TenantID"];
                })

                // ProjectTXGroup_ID
            },
            AddSelectedToExisting() {
                let self = this
                console.log("self.selectedfield");
                console.log(self.selectedfield);
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let tmpProjectTXGroup_ID = null
                let txGroupProjectID = {
                    ProjectID: self.selected
                }

                self.selectedfield.forEach(element => {
                    if (element.ProjectTXGroup_ID != null) {
                        tmpProjectTXGroup_ID = element.ProjectTXGroup_ID
                        return
                    }
                })
                self.selectedfield.forEach(element => {

                    element.ProjectTXGroup_ID = tmpProjectTXGroup_ID
                    Axios.put(process.env.VUE_APP_API + `ProjectTX`, element).then(
                        resp => {
                            console.log(resp);

                        })
                })

                delete Axios.defaults.headers.common["TenantID"];


                // ProjectTXGroup_ID
            },
            getTypeList() {
                let self = this
                let statushandler = new StatusHandler()
                self.typeList = statushandler.getTypeList()
            },
            getStatusList() {
                let self = this
                let statushandler = new StatusHandler()

                self.status = statushandler.getStatus()


            },
            deleteProjectTX(item, group) {
                let self = this
                self.$refs.yesNoModal.show('Delete project transaction?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `ProjectTX?projectTXID=${item.id}`).then(r => {


                            for (let index = 0; index < self.ProjectTXs.length; index++) {
                                const element = self.ProjectTXs[index];
                                if (element.id == item.id) {
                                    self.ProjectTXs.splice(index, 1)
                                }
                            }
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    }

                })
            },
            deleteProject(item, group) {
                let self = this
                self.$refs.yesNoModal.show('Delete project?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `Project?projectID=${item.id}`).then(r => {
                            // console.log(r);


                            for (let index = 0; index < group.projectList.length; index++) {
                                const element = group.projectList[index];
                                if (element.id == item.id) {
                                    group.projectList.splice(index, 1)
                                }
                            }
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    }

                })
            },
            deleteProjectGroup(item) {
                let self = this
                self.$refs.yesNoModal.show('Delete Group?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `ProjectGroup?projectGroupID=${item.id}`).then(
                            r => {

                                for (let index = 0; index < self.ProjectsGroups.length; index++) {
                                    const element = self.ProjectsGroups[index];
                                    if (element.id == item.id) {
                                        self.ProjectsGroups.splice(index, 1)
                                    }
                                }
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }

                })
            },
            getProjectGroups() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'ProjectGroup').then(r => {
                    r.data.projectGroupList.forEach(e => {
                        if (e.deleted == false) {
                            self.ProjectsGroups.push(e)
                        }
                    })

                    delete Axios.defaults.headers.common["TenantID"];
                })

            },
            openGroupEdit(item) {
                var self = this
                self.$refs.ProjectGroupModal.open(false, item, data => {
                    self.ProjectsGroups.push(data)
                })
            },
            openProjectGroupAdd(item) {
                var self = this
                self.$refs.ProjectGroupModal.open(true, item, data => {
                    self.ProjectsGroups.push(data)
                })
            },
            saveLine(item, editType) {
                let self = this

                if (editType == 0) {
                    //date time edit
                    item.dateTime = item.dateTimeString
                }

                if (editType == 3) {
                    //store edit
                    item.store_ID = item.store
                    self.stores.forEach(e => {
                        if (e.value == item.store_ID) {
                            item.store = e.text
                        }
                    })
                }
                if (editType == 4) {
                    //store cluster edit
                    item.storeCluster_ID = item.storeCluster
                    self.StoreClusters.forEach(e => {
                        if (e.value == item.storeCluster_ID) {
                            item.storeCluster = e.text
                        }
                    })
                }
                if (editType == 6) {
                    //Assigned User edit
                    item.systemUserID = item.username
                    self.users.forEach(e => {
                        if (e.value == item.systemUserID) {
                            item.username = e.text
                        }
                    })
                }
                if (editType == 7) {
                    //Assigned User edit
                    item.actionedByUserID = item.actionedByUserName
                    self.users.forEach(e => {
                        if (e.value == item.actionedByUserID) {
                            item.actionedByUserName = e.text
                        }
                    })
                }
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + 'ProjectTX', item).then(res => {
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            getUsers() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        self.userDetails = r.data;

                        self.users.push({
                            text: r.data[0].username.toString(),
                            value: r.data[0].systemUserID
                        })

                        r.data.forEach(element => {

                            if (element.emailAddress != null) {
                                let isDatabaseUser = false;

                                self.databaseUsers.forEach((dbu, idx) => {

                                    if (dbu.systemUserID == element.systemUserID) {
                                        isDatabaseUser = true;
                                    }
                                })

                                if (isDatabaseUser) {
                                    self.users.push({
                                        text: element.username.toString(),
                                        value: element.systemUserID
                                    })
                                }
                            }
                        });

                        self.showLoader = false;
                        self.AssignedUser = self.users[0].value;
                    })
            },
            getDatabaseUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let tmp = sessionStorage.currentDatabase
                Axios.get(process.env.VUE_APP_API + `TenantAccess/User?tenantID=${tmp}`)
                    .then(r => {
                        self.databaseUsers = r.data;
                        self.getUsers();
                    })
            },
            getStoreClusters() {
                let self = this
                Axios.get(process.env.VUE_APP_API + `Cluster/Store`).then(r => {

                    r.data.forEach(element => {
                        self.StoreClusters.push({
                            text: element.displayname,
                            value: element.id
                        })
                    })
                })
            },
            getstores() {
                let self = this
                Axios.get(process.env.VUE_APP_API + `Store?db=CR-Hinterland-LIVE`).then(r => {
                    self.storeObjects = r.data
                    r.data.forEach(element => {
                        self.stores.push({
                            text: element.storeName,
                            value: element.storeID
                        })
                    })
                })
            },
            openProjectEdit(item, group) {
                var self = this
                self.$refs.ProjectModal.open(false, item, data => {
                    for (let index = 0; index < group.projectList.length; index++) {
                        const element = group.projectList[index];
                        if (element.id == item.id) {
                            group.projectList[index].description = data.description
                            group.projectList[index].name = data.name
                            group.projectList[index].planogram_ID = data.planogram_ID
                        }
                    }

                    // for (let index = 0; index < self.Projects.length; index++) {
                    //     const element = self.Projects[index];
                    //     if (element.id == item.id) {
                    //         self.Projects[index].description = data.description
                    //         self.Projects[index].name = data.name
                    //         self.Projects[index].planogram_ID = data.planogram_ID
                    //     }
                    // }
                })
            },
            openProjectAdd(item) {
                var self = this
                // console.log(item);

                self.$refs.ProjectModal.open(true, item, data => {
                    item.projectList.push(data.data.project)
                })
            },
            openProjectTXAdd() {
                var self = this
                self.$refs.ProjectTXModal.open(true, self.project, data => {

                    // console.log(data);

                    self.ProjectTXs.unshift(data)
                })
            },
            openProjectTXEdit(item) {
                var self = this
                self.$refs.ProjectTXModal.open(false, item, data => {

                    for (var prop in item) {
                        item[prop] = data[prop];
                    }

                    // for (let index = 0; index < self.ProjectTXs.length; index++) {
                    //     const element = self.ProjectTXs[index];
                    //     if (element.id == item.id) {
                    //         console.log(index);

                    //         self.ProjectTXs[index] = data
                    //     }
                    // }
                })
            },

            getProjects() {
                var self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Project`).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    r.data.projectList.forEach(e => {
                        self.Projects.push({
                            text: e.name,
                            value: e.id
                        })
                    })
                    if (self.$route.params.projectID != null) {
                        self.selected = parseInt(self.$route.params.projectID)
                        self.getTransactions(self.selected)
                    }

                    // self.Projects = r.data.projectList

                })

            },
            getTransactions(item) {
                console.log("herer");

                let self = this
                self.$nextTick(() => {
                    self.ProjectTXs = []
                    console.log(item);


                    self.project = item
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${item}`).then(r => {
                        console.log(r);

                        r.data.projectTXList.forEach(e => {

                            if (e.deleted != true) {
                                self.ProjectTXs.push(e)
                            }
                        })
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                })



            }
        }
    }
</script>