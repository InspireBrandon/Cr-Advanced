<template>
    <div>

        <v-navigation-drawer persistent :clipped="true" v-model="drawer" fixed app>
            <v-list>
                <v-list-tile>
                    <v-list-tile-content>Projects</v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn icon @click="openProjectAdd()">
                            <v-icon>
                                add
                            </v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
            <v-list class="pt-0" dense>
                <v-divider></v-divider>
                <v-list-tile :class="{ 'highlighted': project == item  }" v-for="item in Projects" :key="item.title"
                    @click="getTransactions(item)">
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
                            <v-list-tile>Archive</v-list-tile>
                        </v-list>
                    </v-menu>
                </v-list-tile>
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
                    <td>{{ props.item.dateTimeString }} </td>
                    <td>
                        {{typeList[props.item.type == -1 ?  5 :  props.item.type].text}}
                        <!-- {{typeList[props.item.type].text }} -->
                        </td>
                    <td>
                         
                        {{status[props.item.status].friendly }}
                        </td>
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
                            </v-list>
                        </v-menu>
                    </td>
                </template>
            </v-data-table>




            <ProjectModal ref="ProjectModal"> </ProjectModal>
            <ProjectTXModal ref="ProjectTXModal"> </ProjectTXModal>

        </v-content>

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
                drawer: null,
                project: null,
                Projects: [],

                typeList: [
                   {
                        text: "Event",
                        value: 0
                    },
                   {
                        text: "DataPreparation",
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
                    sortable:false
                }, {
                    text: "Type",
                    sortable:false
                }, {
                    text: "Status",
                    sortable:false
                }, {
                    text: "Store",
                    sortable:false
                }, {
                    text: "Store Cluster",
                    sortable:false
                }, {
                    text: "Category Cluster",
                    sortable:false
                }, {
                    text: "Assigned User",
                    sortable:false
                }, {
                    text: "Actions",
                    sortable:false
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
                       
                        friendly: "Workshop"
                    },
                    {
                        
                        friendly: "Meeting"
                    },
                    {
                       
                        friendly: "DataPreparationStart"
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
                self.$refs.ProjectModal.open(false, item, data => {
                    for (let index = 0; index < self.Projects.length; index++) {
                        const element = self.Projects[index];
                        if (element.id == item.id) {
                            self.Projects[index].description = data.description
                            self.Projects[index].name = data.name
                            self.Projects[index].planogram_ID = data.planogram_ID
                        }
                    }
                })
            },
            openProjectAdd(item) {
                var self = this
                self.$refs.ProjectModal.open(true, item, data => {

                    self.Projects.push(data.data.project)
                })
            },
            openProjectTXAdd() {
                var self = this
                self.$refs.ProjectTXModal.open(true, self.project, data => {


                    self.ProjectTXs.push(data.data.projectTX)
                })
            },
            openProjectTXEdit(item) {
                var self = this
                self.$refs.ProjectTXModal.open(false, item, data => {

                    for(var prop in item) {
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

                Axios.get(process.env.VUE_APP_API + 'Project').then(r => {


                    self.Projects = r.data.projectList
                    delete Axios.defaults.headers.common["TenantID"];
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