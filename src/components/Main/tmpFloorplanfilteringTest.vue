<template>
    <div>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>
                floor plan fixture filter test
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar color="grey darken-3" dark>
            <v-toolbar-items>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 200px" @change="getProjects"
                    v-model="selectedProjectGroup" :items="projectGroups" label="Project Group" hide-details>
                </v-autocomplete>

                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 200px"
                    :disabled="selectedProjectGroup == null" @change="onProjectOrStoreChange" v-model="selectedProject"
                    :items="projects" label="Project" hide-details>
                </v-autocomplete>
                <v-autocomplete  style="margin-left: 10px; margin-top: 8px; width: 200px" v-model="selectedStore"
                    :items="stores" label="stores" @change="onProjectOrStoreChange">

                </v-autocomplete>

                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 200px"
                    :disabled="selectedStore != null" @change="getDistributedPlanograms" v-model="selectedStoreCluster" :items="storeClusters"
                    label="Store Cluster" hide-details return-object>
                </v-autocomplete>

                <v-autocomplete @change="getDistributedPlanograms" style="margin-left: 10px; margin-top: 8px; width: 200px"
                    :disabled="selectedProject == null || selectedStore != null" v-model="selectedCustomCluster"
                    :items="customClusters" label="Custom Cluster" hide-details return-object>
                </v-autocomplete>

                <v-autocomplete @change="getDistributedPlanograms" style="margin-left: 10px; margin-top: 8px; width: 200px"
                    :disabled="selectedProject == null || selectedStore != null" v-model="selectedCategoryCluster"
                    :items="categoryClusters" label="Category Cluster" hide-details return-object>
                </v-autocomplete>
            </v-toolbar-items>

            <v-btn color="primary" @click="getDistributedPlanograms()">
                Filter
            </v-btn>
        </v-toolbar>

        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md3>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>
                            Distributed Planograms
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card style="height: calc(100vh - 235px); overflow-y: scroll;">
                        <v-list>
                            <div v-for="(item,idx) in distributedPlanograms" :key="idx">
                                <v-list-tile @click="onDistributedSelect(item)"
                                    :class="{ 'highlighted': selectedDistributed == item  }" active-class="highlighted">
                                    {{item.planogramName}}
                                </v-list-tile>
                                <v-divider></v-divider>
                            </div>
                        </v-list>
                    </v-card>

                </v-flex>
                <v-flex md9>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>
                            Fixtures <span v-if="selectedDistributed!=null"> :
                                {{selectedDistributed.planogramName}}</span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card style="height: calc(100vh - 235px); overflow-y: scroll;">
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md3 v-for="(item,idx) in fixtures" :key="idx">
                                    <v-card height="300px">
                                        <v-toolbar>
                                            {{item.name}}
                                        </v-toolbar>
                                        <span v-if="item.shape!=null"> shape:{{item.shape}}</span>
                                        <span v-else> shape:Sqaure</span>


                                        <v-card-text>
                                            <v-card v-if="item.shape=='Circle'" width="100px" height="100px"
                                                style="border-radius: 50%" color="grey darken-3">
                                            </v-card>
                                            <v-card v-else width="100px" height="100px" color="grey darken-3">
                                            </v-card>
                                        </v-card-text>





                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>

                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
    import Axios from "axios"
    export default {
        data() {
            return {
                projectGroups: [],
                selectedProjectGroup: null,
                projects: [],
                selectedProject: null,
                fixtures: [],
                selectedDistributed: null,
                distributedPlanograms: [],
                planograms: [],
                selectedPlanogram: null,
                selectedStore: null,
                stores: [],
                storeClusters: [],
                selectedStoreCluster: null,
                categoryClusters: [],
                selectedCategoryCluster: null,
                customClusters: [],
                selectedCustomCluster: null,
            }
        },
        mounted() {
            let self = this
            self.getStores()
            self.getDistributedPlanograms()
            self.getProjectGroups();
            self.getStoreClusters();

        },
        methods: {
            getCategoryClusters() {
                let self = this;

                self.categoryClusters = [{
                    text: "None",
                    value: null
                }];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `Clusters/CategoryCluster?planogramID=${self.selectedPlanogramID}&storeID=${self.selectedStore}`
                    )
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        r.data.forEach(el => {
                            self.categoryClusters.push({
                                text: el.displayname,
                                value: el.id
                            })
                        })
                    })
            },
            getCustomClusters() {
                let self = this;

                self.customClusters = [{
                    text: "None",
                    value: null
                }];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `Clusters/CustomCluster?planogramID=${self.selectedPlanogramID}`
                    )
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        r.data.forEach(el => {
                            self.customClusters.push({
                                text: el.displayname,
                                value: el.id
                            })
                        })
                    })
            },
            getProjectGroups() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `ProjectGroup`).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    self.projectGroups = [];

                    r.data.projectGroupList.forEach(el => {
                        self.projectGroups.push({
                            text: el.name,
                            value: el.id
                        })
                    })
                })
            },
            getProjects() {
                let self = this;

                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `Project?projectGroupID=${self.selectedProjectGroup}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            self.projectsComplete = r.data.projectList;

                            self.projects = [];
                            r.data.projectList.forEach(el => {
                                self.projects.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })
                        })
                })
            },
            onProjectOrStoreChange() {
                let self = this;

                self.$nextTick(() => {
                    if (self.selectedStore != null) {
                        self.selectedStoreCluster = null;
                        self.selectedCustomCluster = null;
                        self.selectedCategoryCluster = null;
                    }

                    if (self.selectedProject != null) {

                        let currentProject = self.projectsComplete.find(e => {
                            return e.id == self.selectedProject;
                        })

                        self.selectedPlanogramID = currentProject.planogram_ID;
                        self.getCategoryClusters();
                        self.getCustomClusters();
                    }
                })
            },
            getStoreClusters() {
                let self = this;
                Axios.get(process.env.VUE_APP_API + "Cluster/Store")
                    .then(r => {
                        r.data.forEach(el => {
                            self.storeClusters.push({
                                text: el.displayname,
                                value: el.id
                            })
                        })
                    })
            },
            onDistributedSelect(item) {
                let self = this
                self.$nextTick(() => {
                    self.selectedDistributed = item
                    self.getFixtures()
                })
            },
            getFixtures() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API +
                    `FloorPlan_Fixtures/GetFixtures?planogramDetail_ID=${self.selectedDistributed.planogram_Detail_ID}`
                ).then(r => {
                    console.log("[FLOOR FIXTURES]", r);
                    self.fixtures = r.data

                })

            },
            getStores() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Store?db={CR-Hinterland-Live}`).then(r => {
                    console.log("[STORES]", r);
                    self.stores = []
                    self.stores.push({
                        text: "None selected",
                        value: null
                    })
                    r.data.forEach(element => {

                        self.stores.push({
                            text: element.storeName,
                            value: element.storeID
                        })
                    });

                })

            },
            getDistributedPlanograms() {
                let self = this
                self.$nextTick(() => {
                    let storeClusterText = ""
                    let customClusterText = ""
                    let categoryClusterText = ""
                    if (self.selectedStoreCluster != null) {
                        storeClusterText = self.selectedStoreCluster.text
                    }
                    if (self.selectedCustomCluster != null) {
                        customClusterText = self.selectedCustomCluster.text
                    }
                    if (self.selectedCategoryCluster != null) {
                        categoryClusterText = self.selectedCategoryCluster.text
                    }

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.get(process.env.VUE_APP_API +
                            `Store_Planogram/DistributedStore?storeID=${self.selectedStore}&storeCluster=${storeClusterText}&customCluster=${customClusterText}&categoryCluster=${categoryClusterText}`
                        )
                        .then(
                            r => {
                                self.distributedPlanograms = r.data
                                console.log("[getDistributedPlanograms]", r);
                            })
                })


            },
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;

    }
</style>