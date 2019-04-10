<template>
    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>Project Group Modal</v-toolbar-title>
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
                        <v-flex md12>
                            <v-autocomplete placeholder="Please select a Group..." v-model="selectedGroup"
                                :items="projectGroups" solo light :rules="[v => !!v || 'You must select a Planogram!']">
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
    export default {
        data() {
            return {
                valid: null,
                dialog: null,
                projectGroups: [],
                selectedGroup: null,
                name: null,
                description: null,
                afterClose: null,
                isAdd: null
            }
        },
        methods: {
            getGroups() {

            },
            open(isAdd, item, callback) {
                let self = this
                self.dialog = true
                if (isAdd == true) {
                    self.isAdd = true
                    self.valid = null
                    self.name = null
                    self.description = null
                    self.selectedGroup = null
                } else {
                    self.isAdd = true
                    self.valid = null
                    // self.name = item.name
                    // self.description = item.description
                    // self.selectedGroup = item.projectGroup
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
                            "description": self.description,
                            "deleted": false
                        }

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + 'Project', tmp).then(r => {
                            let trans = {
                                "project_ID": r.data.project.id,
                                "type": -1,
                                "status": 0,
                                "systemUserID": encoded_details.USER_ID,
                            }
                            Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {
                                delete Axios.defaults.headers.common["TenantID"];
                                self.dialog = false
                                self.afterClose(r)
                            })
                        })
                    }
                    if (self.isAdd == false) {

                        let tmp = {
                            "id": self.project.id,
                            "systemUserID": encoded_details.USER_ID,
                            "planogram_ID": self.selectedPlanogram,
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