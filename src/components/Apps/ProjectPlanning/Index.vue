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
            <v-list class="pt-0" dense>
                <v-expansion-panel class="elevation-0 ;" v-for="(groups, idx) in ProjectsGroups" :key="idx">
                    <v-expansion-panel-content>
                        <template v-slot:header>
                            <v-flex> {{groups.name}}
                            </v-flex>
                        </template>
                        <v-list>
                            <v-list-tile class="buttons">
                                <v-btn flat icon @click="deleteProjectGroup(groups)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                                <v-btn flat icon @click="openGroupEdit(groups)">
                                    <v-icon> edit </v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-divider vertical></v-divider>
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
                                            <v-list-tile @click="deleteProject(item,groups)">Delete</v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </v-list-tile>
                                <v-divider></v-divider>
                            </div>
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
                <v-btn outline dark @click="showUserProjects">
                    Users
                    <!-- <v-icon>
                        reorder
                    </v-icon> -->
                </v-btn>
                <v-btn v-if="project!=null" outline dark @click.stop="$router.push('/Allocation/'+project.id)">
                    allocate
                </v-btn>
                <v-btn v-if="project!=null" outline dark @click.stop="deleteSelectedTX">
                    Delete
                </v-btn>
                <v-btn v-if="project!=null&&project.discontinued!=true" outline dark @click.stop="Discontinue">
                    Discontinue
                </v-btn>
                <v-btn v-if="project!=null &&project.discontinued==true" outline dark @click.stop="Continue">
                    Reinstate
                </v-btn>
                <v-btn v-if="project!=null " outline dark @click.stop="endTasks">
                    End Tasks
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn flat icon v-if="project!=null" @click="openProjectTXAdd()">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-toolbar>
            <div style="overflow-x: auto; height: calc(100vh - 118px)">
                <v-data-table v-if="project!=null" :headers="headers" :rows-per-page-items="[15,50,75,100]"
                    :items="ProjectTXs">
                    <template v-slot:items="props">
                        <td>
                            <v-checkbox hide-details v-model="selectedDelete" :value="props.item.id"></v-checkbox>
                        </td>
                        <td>
                            <!-- {{ props.item.dateTimeString }} -->
                            <v-edit-dialog :return-value.sync="props.item.type" large lazy persistent
                                @save="saveLine(props.item,0)" @cancel="''" @open="''" @close="''">
                                <div>{{ props.item.dateTimeString }}</div>
                                <template v-slot:input>
                                    <div class="mt-3 title">Update Iron</div>
                                </template>
                                <template v-slot:input>
                                    <v-menu ref="menu" :close-on-content-click="false" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="props.item.dateTimeString"
                                                label="please select a date" prepend-icon="event" readonly v-on="on">
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="props.item.dateTimeString" no-title scrollable>
                                            <!-- <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="$refs.menu.save()">OK</v-btn> -->
                                        </v-date-picker>
                                        <!-- <v-time-picker v-model="timePicker"></v-time-picker> -->
                                    </v-menu>
                                </template>
                            </v-edit-dialog>
                        </td>
                        <td>
                            <v-edit-dialog :return-value.sync="props.item.type" large lazy persistent
                                @save="saveLine(props.item)" @cancel="''" @open="''" @close="''">
                                <div>
                                    {{typeList[props.item.type == -1 ?  5 :  props.item.type].text}}

                                </div>
                                <template v-slot:input>
                                    <div class="mt-3 title">Update Iron</div>
                                </template>
                                <template v-slot:input>
                                    <v-select v-model="props.item.type" :items="typeList2" label="Edit" single-line
                                        counter autofocus></v-select>
                                </template>
                            </v-edit-dialog>
                        </td>
                        <td>

                            <v-edit-dialog :return-value.sync="props.item.status" large lazy persistent
                                @save="saveLine(props.item)" @cancel="''" @open="''" @close="''">
                                <div>
                                    <v-icon :color="getColor(props.item.type, props.item.status)">
                                        fiber_manual_record</v-icon>
                                    {{status[props.item.status].friendly }}
                                </div>
                                <template v-slot:input>
                                    <div class="mt-3 title">Update Iron</div>
                                </template>
                                <template v-slot:input>
                                    <v-select v-model="props.item.status" :items="status" label="Edit" single-line
                                        counter autofocus></v-select>
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
                                    <v-select v-model="props.item.store" :items="stores" label="Edit" single-line
                                        counter autofocus></v-select>
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
                            <v-edit-dialog large lazy persistent @save="saveLine(props.item,7)" @cancel="''" @open="''"
                                @close="''">
                                <div>{{ props.item.actionedByUserName }}</div>
                                <template v-slot:input>
                                </template>
                                <template v-slot:input>
                                    <v-select v-model="props.item.actionedByUserName" :items="users" label="Edit"
                                        single-line autofocus></v-select>
                                </template>
                            </v-edit-dialog>
                        </td>
                        <!-- <td>
                        <v-edit-dialog large lazy persistent @save="saveLine(props.item,8)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{ props.item.spacePlanName }}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-select v-model="props.item.actionedByUserName" :items="users" label="Edit"
                                    single-line autofocus></v-select>
                            </template>
                        </v-edit-dialog>
                    </td> -->

                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" v-if="props.item.rangeFileName!=null">
                                        assessment</v-icon>
                                </template>
                                <span> {{props.item.rangeFileName}}</span>
                            </v-tooltip>
                        </td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" v-if="props.item.systemFileName!=null">
                                        web</v-icon>
                                </template>
                                <span> {{props.item.systemFileName}}</span>
                            </v-tooltip>
                        </td>
                        <td>
                            <v-checkbox @change="setRemoved(props.item)" v-model="props.item.removed" hide-details>
                            </v-checkbox>
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
                                <v-list dense>
                                    <v-list-tile @click="deleteProjectTX(props.item)">Delete</v-list-tile>
                                    <v-divider></v-divider>
                                </v-list>
                            </v-menu>
                        </td>
                    </template>
                </v-data-table>
            </div>

            <YesNoModal ref="yesNoModal"></YesNoModal>
            <ProjectGroupModal ref="ProjectGroupModal"> </ProjectGroupModal>

            <ProjectModal ref="ProjectModal"> </ProjectModal>
            <ProjectTXModal ref="ProjectTXModal"> </ProjectTXModal>
            
            <UserProjectsModal ref="UserProjectsModal" />
        </v-content>

    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal';

    import ProjectModal from './ProjectModal.vue'
    import ProjectTXModal from './ProjectTXModal.vue'
    import ProjectGroupModal from './ProjectGroupModal.vue'

    import StatusHandler from '@/libs/system/projectStatusHandler'

    import UserProjectsModal from './UserProjects/Index.vue'

    import Axios from 'axios'
    import jwt from 'jsonwebtoken';


    export default {
        components: {
            ProjectGroupModal,
            ProjectModal,
            ProjectTXModal,
            YesNoModal,
            UserProjectsModal
        },
        data() {
            return {
                selectedDelete: [],
                menu: null,
                timePicker: "00:00",
                datePicker: null,
                drawer: null,
                project: null,
                Projects: [],

                typeList: [],
                headers: [{
                    text: "delete",
                    sortable: false,

                }, {
                    text: "",
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
                    text: "Range",
                    sortable: false,
                }, {
                    text: "Planogram",
                    sortable: false,
                }, {
                    text: "Closed",
                    sortable: false,
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
                typeList2: [],
                databaseUsers: [],
                users: [{
                    text: "None",
                    value: null
                }],
                tmp: [],


            }
        },
        mounted() {
            this.getTypeList()
            this.getStatusList()
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
            endTasks() {
                let self = this
                console.log("self.project", self.project);

                let projectTXGroupRequest = {
                    projectID: self.project.id
                }
                // 53
                self.createProjectTransactionGroup(projectTXGroupRequest, cb => {

                    let request = self.ProjectTXs[self.ProjectTXs.length - 1]
                    request.status = 53

                    request.systemUserID = null;
                    console.log("[REQUEST]", request);

                    self.createProjectTransaction(request, txcb => {
                        console.log("createProjectTransaction", txcb);

                    })
                })
            },
            Continue() {
                let self = this
                self.$refs.yesNoModal.show('Are you sure you want to Reinstate this Category?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API +
                            `/Project?Project_ID=${self.project.id}&Value=${false}`).then(
                            r => {

                            })
                    }
                })
            },
            Discontinue() {
                let self = this
                self.$refs.yesNoModal.show('Are you sure you want to discontinue this Category?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API +
                            `/Project?Project_ID=${self.project.id}&Value=${true}`).then(
                            r => {})
                    }
                })
            },
            deleteSelectedTX() {
                let self = this
                self.$refs.yesNoModal.show('Delete selected project transactions?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        console.log(self.selectedDelete);

                        Axios.post(process.env.VUE_APP_API + `/ProjectTXDeleteMany`, self.selectedDelete).then(
                            r => {

                                console.log(r);
                                self.selectedDelete.forEach(item => {
                                    for (let index = 0; index < self.ProjectTXs.length; index++) {
                                        const element = self.ProjectTXs[index];
                                        if (element.id == item) {
                                            self.ProjectTXs.splice(index, 1)
                                        }
                                    }
                                })

                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }

                })
            },
            getTypeList() {
                let self = this
                let statushandler = new StatusHandler()
                self.typeList = statushandler.getTypeList()
                self.typeList2 = statushandler.getTypeList()
                self.typeList2.splice(5, 1)
                //   console.log(self.typeList);
                // console.log(self.typeList2);

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
                    console.log(r);

                    r.data.projectGroupList.forEach(e => {
                        if (e.deleted == false) {
                            self.ProjectsGroups.push(e)


                        }
                    })
                    console.log(self.ProjectsGroups);
                    delete Axios.defaults.headers.common["TenantID"];
                })

            },
            openGroupEdit(item) {
                var self = this
                self.$refs.ProjectGroupModal.open(false, item, data => {
                    self.ProjectsGroups.forEach(e => {
                        if (e.id == data.id) {
                            e.name = data.name
                            e.description = data.description
                        }
                    })
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

                Axios.put(process.env.VUE_APP_API + 'ProjectTX?update=true', item).then(res => {
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

                    console.log(data);

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
                self.ProjectTXs = []

                if (self.project == item) {
                    return
                }

                self.project = item
                console.log(self.project);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${item.id}`).then(r => {

                    self.ProjectTXs = r.data.projectTXList;

                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            setRemoved(item) {
                let self = this;

                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.put(process.env.VUE_APP_API + 'ProjectTX?update=false', item).then(res => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                })
            },
            getColor(type, status) {
                return StatusHandler.getColorByTypeAndStatus(type, status)
            },
            showUserProjects() {
                let self = this;
                
                self.$refs.UserProjectsModal.show(() => {

                })
            }
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
    }

    .buttons {
        background-color: #BDBDBD;
    }

    .listHeaders {
        background-color: #EEEEEE;
    }
</style>