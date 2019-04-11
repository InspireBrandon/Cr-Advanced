<template>
    <div>
        <v-navigation-drawer persistent :clipped="true" v-model="drawer" fixed app>
            <v-list>
                <v-list-tile>
                    <v-list-tile-content>Project Groups
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn icon @click="openProjectGroupAdd()">
                            <v-icon>
                                add
                            </v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
            <!-- <v-menu left>
                            <v-btn slot="activator" icon>
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list dense>
                                
                                <v-divider></v-divider>
                            </v-list>
                        </v-menu> -->
            <v-list class="pt-0" dense>

                <v-expansion-panel class="elevation-0" v-for="groups in ProjectsGroups" :key="groups.id">
                    <v-expansion-panel-content>
                        <template v-slot:header>
                            <div> {{groups.name}}
                            </div>
                        </template>
                        <v-list>

                            <v-list-tile>

                                <v-spacer></v-spacer>
                                <v-btn flat icon @click="deleteProjectGroup(groups)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                                <v-btn flat icon @click="openGroupEdit(groups)">
                                    <v-icon> edit </v-icon>
                                </v-btn>
                                <v-btn flat icon @click="openProjectAdd(groups)">
                                    <v-icon>add</v-icon>
                                </v-btn>

                            </v-list-tile>

                            <hr>
                            <div v-for="(item,index) in groups.projectList" :key="index">
                                <v-list-tile :class="{ 'highlighted': project == item  }"
                                    @click="getTransactions(item)">
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-menu left>
                                        <v-btn slot="activator" icon>
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                        <v-list dense>
                                            <v-list-tile @click="openProjectEdit(item,groups)">Edit</v-list-tile>
                                            <v-divider></v-divider>
                                            <v-list-tile @click="deleteProject(item,groups)">Archive</v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </v-list-tile>
                                <v-divider></v-divider>
                            </div>
                            <!-- <v-card>
                            <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
                        </v-card> -->
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>


            </v-list>
        </v-navigation-drawer>

        <v-content class="ma-o pa-0">
            <v-toolbar color="primary" dark flat>
                <v-btn icon @click="$router.go(-1)">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-toolbar-title>
                    Project Planning
                </v-toolbar-title>
                <v-btn icon dark @click.stop="drawer = !drawer">
                    <v-icon>
                        reorder
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn flat icon v-if="project!=null" @click="openProjectTXAdd()">
                    <v-icon>add</v-icon>
                </v-btn>

            </v-toolbar>
            <v-data-table v-if="project!=null" :headers="headers" :items="ProjectTXs" hide-actions>
                <template v-slot:items="props">
                    <td>
                        <!-- {{ props.item.dateTimeString }} -->
                        <v-edit-dialog :return-value.sync="props.item.type" large lazy persistent
                            @save="saveLine(props.item,0)" @cancel="''" @open="''" @close="''">
                            <div>{{ props.item.dateTimeString }}</div>
                            <template v-slot:input>
                                <div class="mt-3 title">Update Iron</div>
                            </template>
                            <template v-slot:input>
                                <v-menu ref="menu" :close-on-content-click="false" lazy transition="scale-transition"
                                    offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="setDate" label="please select a date"
                                            prepend-icon="event" readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="datePicker" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                    </v-date-picker>
                                    <v-time-picker v-model="timePicker"></v-time-picker>


                                </v-menu>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog :return-value.sync="props.item.type" large lazy persistent
                            @save="saveLine(props.item)" @cancel="''" @open="''" @close="''">
                            <div>{{typeList[props.item.type == -1 ?  5 :  props.item.type].text}}</div>
                            <template v-slot:input>
                                <div class="mt-3 title">Update Iron</div>
                            </template>
                            <template v-slot:input>
                                <v-select v-model="props.item.type" :items="typeList" label="Edit" single-line counter
                                    autofocus></v-select>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>

                        <v-edit-dialog :return-value.sync="props.item.status" large lazy persistent
                            @save="saveLine(props.item)" @cancel="''" @open="''" @close="''">
                            <div>{{status[props.item.status].friendly }}</div>
                            <template v-slot:input>
                                <div class="mt-3 title">Update Iron</div>
                            </template>
                            <template v-slot:input>
                                <v-select v-model="props.item.status" :items="status" label="Edit" single-line counter
                                    autofocus></v-select>
                            </template>
                        </v-edit-dialog>
                    </td>

                    <td>
                        <!-- {{ props.item.store}} -->
                        <v-edit-dialog large lazy persistent @save="saveLine(props.item,3)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{ props.item.store}}</div>
                            <template v-slot:input>
                                <div class="mt-3 title">Update Iron</div>
                            </template>
                            <template v-slot:input>
                                <v-select v-model="props.item.store" :items="stores" label="Edit" single-line counter
                                    autofocus></v-select>
                            </template>
                        </v-edit-dialog>

                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="saveLine(props.item,4)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{ props.item.storeCluster}}</div>
                            <template v-slot:input>
                                <div class="mt-3 title">Update Iron</div>
                            </template>
                            <template v-slot:input>
                                <v-select v-model="props.item.storeCluster" :items="StoreClusters" label="Edit"
                                    single-line autofocus></v-select>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>{{ props.item.categoryCluster }}</td>

                    <td>
                        <v-edit-dialog large lazy persistent @save="saveLine(props.item,6)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{ props.item.username}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-select v-model="props.item.username" :items="users" label="Edit" single-line
                                    autofocus></v-select>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-menu left>
                            <v-btn slot="activator" icon>
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list dense>
                                <v-list-tile @click="openProjectTXEdit(props.item)">Edit</v-list-tile>
                                <v-divider></v-divider>
                            </v-list>
                        </v-menu>
                    </td>
                </template>
            </v-data-table>


            <YesNoModal ref="yesNoModal"></YesNoModal>
            <ProjectGroupModal ref="ProjectGroupModal"> </ProjectGroupModal>

            <ProjectModal ref="ProjectModal"> </ProjectModal>
            <ProjectTXModal ref="ProjectTXModal"> </ProjectTXModal>

        </v-content>

    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal';

    import ProjectModal from './ProjectModal.vue'
    import ProjectTXModal from './ProjectTXModal.vue'
    import ProjectGroupModal from './ProjectGroupModal.vue'

    import Axios from 'axios'
    import jwt from 'jsonwebtoken';


    export default {
        components: {
            ProjectGroupModal,
            ProjectModal,
            ProjectTXModal,
            YesNoModal
        },
        data() {
            return {
                menu: null,
                timePicker: null,
                datePicker: null,
                drawer: null,
                project: null,
                Projects: [],

                typeList: [{
                        text: "Event",
                        value: 0
                    },
                    {
                        text: "Data Preparation",
                        value: 1
                    }, {
                        text: "Ranging",
                        value: 2
                    },
                    {
                        text: "Planogram",
                        value: 3
                    }, {
                        text: "Promotion",
                        value: 4
                    }, {
                        text: "",
                        value: 5
                    }
                ],
                headers: [{
                    text: "Date",
                    sortable: true,
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
                    text: "Actions",
                    sortable: false
                }],
                ProjectTXs: [],
                status: [{
                        text: "Project Start",
                        value: 0,
                        friendly: "Project Start"
                    },
                    {
                        text: "In Progress",
                        value: 1,
                        friendly: "In Progress"
                    },
                    {
                        text: "Complete",
                        value: 2,
                        friendly: "Complete"
                    },
                    {
                        text: "Workshop",
                        value: 3,
                        friendly: "Workshop"
                    }, {
                        text: "Workshop Complete",
                        value: 4,
                        friendly: "Workshop Complete"
                    },
                    {
                        text: "Meeting",
                        value: 5,
                        friendly: "Meeting"
                    },
                    {
                        text: "Data Preparation Start",
                        value: 6,
                        friendly: "Data Preparation Start"
                    },
                    {
                        text: "Ranging Start",
                        value: 7,
                        friendly: "Ranging Start"
                    },
                    {
                        text: "Planogram Start",
                        value: 8,
                        friendly: "Planogram Start"
                    },
                    {
                        text: "Checking",
                        value: 9,
                        friendly: "Checking"
                    },
                    {
                        text: "Checking Ended",
                        value: 10,
                        friendly: "Checking Ended"
                    },
                    {
                        text: "Requesting Approval",
                        value: 11,
                        friendly: "Requesting Approval"
                    },
                    {
                        text: "Declined",
                        value: 12,
                        friendly: "Declined"
                    },
                    {
                        text: "Approved",
                        value: 13,
                        friendly: "Approved"
                    },
                    {
                        text: "Implementation Pending",
                        value: 14,
                        friendly: "Implementation Pending"
                    },
                    {
                        text: "Variation Request",
                        value: 15,
                        friendly: 'Variation Request'
                    },
                    {
                        text: "Implemented",
                        value: 16,
                        friendly: "Implemented"
                    },
                    {
                        text: "On Hold",
                        value: 17,
                        friendly: "On Hold"
                    }
                ],
                stores: [],
                ProjectsGroups: [],
                storeObjects: [],
                StoreClusters: [],
                databaseUsers: [],
                users: [],
                tmp: [],


            }
        },
        mounted() {

            this.getstores()
            this.getStoreClusters()
            this.getDatabaseUsers()
            this.getProjectGroups()
        },
        computed: {
            // a computed getter
            setDate: function () {
                // `this` points to the vm instance
                return this.datePicker + ' ' + this.timePicker
                //   return this.datePicker = this.datePicker+this.timePicker
            }
        },
        methods: {
            deleteProject(item, group) {
                let self = this
                self.$refs.yesNoModal.show('Delete project?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `Project?projectID=${item.id}`).then(r => {
                            console.log(r);


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
                console.log(item);
                if (editType == 0) {
                    //date time edit
                    item.dateTime = self.setDate
                    item.dateTimeString = self.setDate
                    //  "dateTime": self.setDate,
                    //         "dateTimeString":self.setDate,
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
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + 'ProjectTX', item).then(res => {

                    console.log(res);

                    delete Axios.defaults.headers.common["TenantID"];
                })
                console.log("editied item");
                console.log(item);
            },

            getUsers() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        self.userDetails = r.data;

                        r.data.forEach(element => {

                            if (element.emailAddress != null) {
                                let isDatabaseUser = false;

                                self.databaseUsers.forEach((dbu, idx) => {
                                    if (dbu.systemUserID == element.systemUserID) {
                                        isDatabaseUser = true;
                                    }

                                    if (dbu.systemUserID == encoded_details.USER_ID) {
                                        self.databaseUsers.splice(idx, 1);
                                    }
                                })

                                if (isDatabaseUser) {
                                    if (element.systemUserID != encoded_details.USER_ID) {
                                        self.users.push({
                                            text: element.username.toString(),
                                            value: element.systemUserID
                                        })
                                    }
                                }
                            }
                        });

                        self.showLoader = false;
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
                console.log(item);

                self.$refs.ProjectModal.open(true, item, data => {
                    item.projectList.push(data.data.project)
                })
            },
            openProjectTXAdd() {
                var self = this
                self.$refs.ProjectTXModal.open(true, self.project, data => {

                    console.log(data);

                    self.ProjectTXs.push(data)
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

            getProjects(group, callback) {
                var self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Project?projectGroupID=${group.id}`).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    group.Projects = r.data.projectList
                    callback()

                    // self.Projects = r.data.projectList

                })
            },
            getTransactions(item) {

                let self = this


                if (self.project == item) {
                    return
                }
                self.project = item
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${item.id}`).then(r => {
                    self.ProjectTXs = r.data.projectTXList
                    delete Axios.defaults.headers.common["TenantID"];
                })


            }
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>