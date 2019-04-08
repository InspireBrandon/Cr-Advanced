<template>
    <div>
        <v-layout wrap>
            <v-flex md3>
                <v-navigation-drawer>
                    <v-list>
                        <v-list-tile>

                            <v-list-tile-content>Projects</v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon @click="openProjectsModal">
                                    <v-icon>
                                        add
                                    </v-icon>
                                </v-btn>

                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                    <v-list class="pt-0" dense>
                        <v-divider></v-divider>

                        <v-list-tile v-for="item in Projects" :key="item.title" @click="getTransactions(item)">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-menu left>
                                <v-btn slot="activator" icon>
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list dense>
                                    <v-list-tile @click="openProjectEdit(item)">Edit</v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile>Delete</v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-list-tile>
                    </v-list>
                </v-navigation-drawer>
            </v-flex>
            <v-flex md8>

                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>
                        Project Planning
                    </v-toolbar-title>
                    <v-spacer></v-spacer>


                    <v-btn icon @click="$router.go(-1)">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-layout row wrap>
                    <v-flex md12>

                        <v-data-table :headers="headers" :items="ProjectTXs" hide-actions>
                            <template v-slot:items="props">
                                <td>{{ props.item.dateTimeString }} </td>
                                <td>
                                    {{typeList[props.item.type].text }}</td>
                                <td>
                                    {{status[props.item.status].friendly }}</td>
                                <td>{{ props.item.store }}</td>
                                <td>{{ props.item.storeCluster }}</td>
                                <td>{{ props.item.categoryCluster }}</td>
                                <td>{{ props.item.username }}</td>
                                <td>
                                    <v-menu left>
                                        <v-btn slot="activator" icon>
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                        <v-list dense>
                                            <v-list-tile @click="openProjectTXEdit(props.item)">Edit</v-list-tile>
                                            <v-divider></v-divider>
                                            <v-list-tile>Delete</v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </td>
                            </template>

                        </v-data-table>
                        <v-btn fab dark color="primary" v-if="project!=null" @click="openProjectTXAdd()">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>

        </v-layout>
        <ProjectModal ref="ProjectModal"> </ProjectModal>
        <ProjectTXModal ref="ProjectTXModal"> </ProjectTXModal>
    </div>
</template>
<script>
    import ProjectModal from './ProjectModal.vue'
    import ProjectTXModal from './ProjectTXModal.vue'
    import Axios from 'axios'
    export default {
        components: {
            ProjectModal,
            ProjectTXModal
        },
        data() {
            return {
                project: null,
                Projects: [],

                typeList: [{
                        text: "DataPreparation",
                        value: 0
                    }, {
                        text: "Ranging",
                        value: 1
                    },
                    {
                        text: "Planogram",
                        value: 2
                    }, {
                        text: "DataPrePromotionparation",
                        value: 3
                    }
                ],
                headers: [{
                    text: "Date",
                }, {
                    text: "Type",
                }, {
                    text: "Status",
                }, {
                    text: "Store",
                }, {
                    text: "Store Cluster",
                }, {
                    text: "Category Cluster",
                }, {
                    text: "Assigned User",
                }, {
                    text: "Actions",
                }],
                ProjectTXs: [],
                status: [{
                        friendly: "Project Start"
                    },
                    {
                        friendly: "InProgress"
                    },
                    {
                        friendly: "Complete"
                    },
                    {
                        friendly: "Ranging Start"
                    },
                    {
                        friendly: "Planogram Start"
                    },
                    {
                        friendly: "Checking"
                    },
                    {
                        friendly: "Requesting Approval"
                    },
                    {
                        friendly: "Declined"
                    },
                    {
                        friendly: "Approved"
                    },
                    {
                        friendly: "Implementation Pending"
                    },
                    {
                        friendly: 'Variation Request'
                    },
                    {
                        friendly: "Implemented"
                    },
                    {
                        friendly: "On Hold"
                    }
                ]

            }
        },
        mounted() {
            this.getProjects()
        },
        methods: {
            openProjectEdit(item) {
                var self = this
                self.$refs.ProjectModal.open(true, item)
            },
            openProjectTXAdd() {
                var self = this
                self.$refs.ProjectTXModal.open(true, self.project)
            },
            openProjectTXEdit(item) {
                var self = this
                self.$refs.ProjectTXModal.open(false, item)
            },
            openProjectsModal() {
                var self = this
                self.$refs.ProjectModal.open(false)
            },
            getProjects() {
                var self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Project').then(r => {
                    console.log("r.data.projectList");

                    console.log(r.data.projectList);

                    self.Projects = r.data.projectList
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            getTransactions(item) {
                let self = this
                self.project = item
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${item.id}`).then(r => {
                    self.ProjectTXs = r.data.projectTXList
console.log("self.ProjectTXs");

console.log(self.ProjectTXs);

                    delete Axios.defaults.headers.common["TenantID"];

                })


            }
        }
    }
</script>