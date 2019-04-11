<template>
    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>Project Group </v-toolbar-title>
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
    import {
        SSL_OP_CIPHER_SERVER_PREFERENCE
    } from 'constants';
    export default {
        data() {
            return {
                valid:null,
                item: null,
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
                    self.name = null
                    self.description = null
                    self.selectedGroup = null
                }
                if(isAdd=false) 
                 {
                    self.isAdd = false
                    self.item = item
                    self.name = item.name
                    self.description = item.description
                }
                self.afterClose = callback
            },
            submit() {
                var self = this
                if (this.$refs.form.validate()) {
                    if (self.isAdd == true) {
                        let tmp = {
                            "name": self.name,
                            "description": self.description,
                        }

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + 'ProjectGroup', tmp).then(r => {
                            console.log(r);
                            self.afterClose(r.data.projectGroup)
                            self.dialog = false

                        })
                    }
                    if (self.isAdd == false) {

                        self.item.name = self.name
                        self.item.description = self.description
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.put(process.env.VUE_APP_API + 'ProjectGroup', self.item).then(r => {
                            console.log(r);
                            self.afterClose(r.data.projectGroup)
                            self.dialog = false

                        })
                    }
                }

            }
        }
    }
</script>