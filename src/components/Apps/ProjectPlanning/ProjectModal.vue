<template>

    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>Project Modal</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>

            </v-toolbar>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-autocomplete placeholder="Please select a Planogram..." v-model="selectedPlanogram"
                                :items="planogramsList" solo light
                                :rules="[v => !!v || 'You must select a Planogram!']">
                            </v-autocomplete>
                        </v-flex>

                        <v-flex md6>
                            <v-autocomplete placeholder="Please select a Project Group..." v-model="selectedGroup"
                                :items="GroupList" solo light :rules="[v => !!v || 'You must select a Project Group!']">

                            </v-autocomplete>
                        </v-flex>

                        <v-flex md6>
                            <v-text-field label="Name" placeholder="Name" v-model="name"
                                :rules="[v => !!v || 'You must fill in a Name!']"></v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-text-field label="Description" placeholder="Description" v-model="description"
                                :rules="[v => !!v || 'You must fill in a Description!']">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="submit"> submit</v-btn>

                    </v-card-actions>
                </v-form>
            </v-container>
        </v-card>
    </v-dialog>

</template>
<script>
    import jwt from 'jsonwebtoken';
    import Axios from 'axios'


    export default {
        data() {
            return {
                selectedGroup: null,
                GroupList: [],
                valid: null,
                afterClose: null,
                project: null,
                isAdd: false,
                dialog: false,
                planogramsList: [],
                selectedPlanogram: null,
                name: null,
                description: null,
            }
        },
        mounted() {
            this.getPlanograms()
        },
        methods: {
            getProjectGroups() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'ProjectGroup').then(r => {
                    console.log(r);
                    r.data.projectGroupList.forEach(e => {
                        self.GroupList.push({
                            text: e.name,
                            value: e.id,
                        })
                    })

                    delete Axios.defaults.headers.common["TenantID"];
                })

            },
            getPlanograms() {
                let self = this;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + 'Planogram')
                    .then(r => {

                        r.data.planogramList.forEach(element => {

                            self.planogramsList.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            open(isAdd, item, callback) {
                this.$refs.form.reset()

                this.getProjectGroups()

                console.log(item);
                var self = this
                self.dialog = true
                if (isAdd == false) {
                    self.isAdd = false
                    self.selectedGroup = item.projectGroupID
                    self.project = item
                    self.selectedPlanogram = item.planogram_ID,
                        self.name = item.name,
                        self.description = item.description
                }
                if (isAdd == true) {


                    self.selectedPlanogram = null,
                        self.isAdd = true
                    self.selectedGroup = item.id
                    self.name = null,
                        self.description = null
                }
                self.afterClose = callback
            },

            submit() {
                var self = this
                if (this.$refs.form.validate()) {
                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    if (self.isAdd == true) {
                        let tmp = {
                            "systemUserID": encoded_details.USER_ID,
                            "planogram_ID": self.selectedPlanogram,
                            "name": self.name,
                            "ProjectGroupID": self.selectedGroup,
                            "description": self.description,
                            "deleted": false
                        }

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + 'Project', tmp).then(r => {
                            console.log("r");
                            console.log(r);
                            let ProjectTxGroup = {
                                projectID: r.data.project.id
                            }
                            Axios.post(process.env.VUE_APP_API + 'ProjectTXGroup', ProjectTxGroup).then(   resp => {
                                    console.log("resp");
                                    console.log(resp);

                                    
                                let trans = {
                                    "project_ID": r.data.project.id,
                                    "type": -1,
                                    "status": 0,
                                    "systemUserID": encoded_details.USER_ID,
                                    "ProjectTXGroup_ID":resp.data.projectTXGroup.id
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {
                                    delete Axios.defaults.headers.common["TenantID"];
                                    self.dialog = false
                                    console.log("res");
                                    console.log(res);
                                    
                                    self.afterClose(r)
                                })

                            })



                        })
                    }
                    if (self.isAdd == false) {

                        let tmp = {
                            "id": self.project.id,
                            "systemUserID": encoded_details.USER_ID,
                            "planogram_ID": self.selectedPlanogram,
                            "ProjectGroupID": self.selectedGroup,
                            "name": self.name,
                            "description": self.description,
                            "deleted": false
                        }
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.put(process.env.VUE_APP_API + 'Project', tmp).then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            self.afterClose(tmp)
                            self.dialog = false
                        })
                    }

                }
            }
        }
    }
</script>