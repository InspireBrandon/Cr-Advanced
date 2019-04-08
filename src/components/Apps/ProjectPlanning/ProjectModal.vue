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
                <v-layout row wrap>
                    <v-flex md12>
                        <v-autocomplete placeholder="Please select a Spaceplan..." v-model="selectedPlanogram"
                            :items="planogramsList" solo light>
                        </v-autocomplete>
                    </v-flex>

                    <v-flex md6>
                        <v-text-field label="Name" placeholder="Name" v-model="name"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Description" placeholder="Description" v-model="description">
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-card-actions>
                    <v-btn @click="dialog = false">cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit"> submit</v-btn>

                </v-card-actions>
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
            getPlanograms() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&folder=SPACE PLANNING')
                    .then(r => {
                        r.data.forEach(element => {

                            self.planogramsList.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            open(isAdd, item) {
                var self = this
                self.dialog = true
                if (isAdd == true) {
                    self.selectedPlanogram = item.selectedPlanogram,
                        self.name = item.name,
                        self.description = item.description
                }
                if (isAdd == false) {
                    self.selectedPlanogram = null,
                        self.name = null,
                        self.description = null
                }
            },
            submit() {
                var self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let tmp = {
                    "systemUserID": encoded_details.USER_ID,
                    "planogram_ID": self.selectedPlanogram,
                    "name": self.name,
                    "description": self.description,
                    "deleted": false
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + 'Project', tmp).then(r => {
                    console.log(r);
                    self.dialog = false
                    delete Axios.defaults.headers.common["TenantID"];
                })

            }
        }
    }
</script>