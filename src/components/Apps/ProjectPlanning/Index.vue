<template>
    <div>
        <v-layout wrap>
            <v-container>
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
                                <td>{{ props.item.Planogram }}</td>
                                <td>{{ props.item.Type }} </td>
                                <td>{{ props.item.Cluster }}</td>
                                <td>{{ props.item.Category }}</td>
                                <td>{{ props.item.Cluster }}</td>
                                <td>{{ props.item.Store }}</td>
                                <td>{{ props.item.Name }}</td>
                                <td>
                                    <v-menu left>
                                        <v-btn slot="activator" icon>
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                        <v-list dense>
                                            <v-list-tile @click="openEdit(item)">Edit</v-list-tile>
                                            <v-divider></v-divider>
                                            <v-list-tile>Delete</v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-navigation-drawer absolute>
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

                    <v-list-tile v-for="item in Projects" :key="item.title" @click="getProjectData(item)">
                        <v-list-tile-content @click="getTransactions(item)">
                            <v-list-tile-title>{{ item.Name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
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
                Projects: [],

                //           public int ID { get; set; }
                // public Guid UID { get; set; }
                // public int Project_ID { get; set; }
                // public Type Type { get; set; }
                // public int StoreCluster_ID { get; set; }
                // public int CategoryCluster_ID { get; set; }
                // public int Store_ID { get; set; }
                // public DateTime DateTime { get; set; }
                // public Status Status { get; set; }
                // public int SystemUserID { get; set; } // Assigned To
                headers: [{
                    text: "Planogram",
                }, {
                    text: "Type",
                }, {
                    text: "Cluster",
                }, {
                    text: "Category",
                }, {
                    text: "Cluster",
                }, {
                    text: "Store",
                }, {
                    text: "Name",
                }, {
                    text: "Actions",
                }],
                ProjectTXs: [],

            }
        },
        mounted() {
            this.getProjects()
        },
        methods: {
            getProjectData(item) {

            },
            openProjectsModal() {
                var self = this
                self.$refs.ProjectModal.open(false)
            },
            getProjects() {
                var self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Project').then(r => {
                    console.log(r);
                    delete Axios.defaults.headers.common["TenantID"];


                })


            },
            getTransactions(item) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                if (item.id != undefined || item.id != null) {
                    Axios.get(process.env.VUE_APP_API + `Project?projectID=${item.id}`).then(r => {
                        self.ProjectTXs=r.data
                        delete Axios.defaults.headers.common["TenantID"];

                    })

                }

            }
        }
    }
</script>