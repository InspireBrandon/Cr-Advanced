<template>
    <v-dialog v-model="dialog" persistent height="500" width="1000">
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>
                    Cluster Maintenance
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark dense class="pa-0">
                <v-spacer></v-spacer>
                <v-btn @click="openAdd" color="primary">
                    Add Cluster
                </v-btn>
            </v-toolbar>
            <grid ref="grid" :data="rowData" :getData="GetData" />
            <v-dialog v-model="addDialog" persistent width="600px" height="600px">
                <v-card>
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>
                            Add Cluster
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="addDialog=false">
                            <v-icon>
                                close
                            </v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="clusterForm">
                            <v-text-field label="Cluster Name" :rules="nameRules" required
                                v-model="createItem.clusterName">
                            </v-text-field>
                            <v-text-field label="Display Name" :rules="nameRules" required
                                v-model="createItem.displayname">
                            </v-text-field>
                            <v-text-field number label="Value" :rules="nameRules" required v-model="createItem.value">
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="submitADD">submit </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </v-dialog>
</template>
<script>
    import grid from "./Grid.vue"
    import Axios from "axios"
    export default {
        components: {
            grid
        },
        data() {
            return {
                nameRules: [
                    v => !!v || 'field is required',
                ],
                addDialog: false,
                dialog: false,
                callback: null,
                createItem: {
                    clusterName: null,
                    displayname: null,
                    value: null,
                    active: true,
                    rank: null,
                },
                rowData: [],
            }
        },
        methods: {
            GetData() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                console.log("[GETTING CLUSTER]");

                Axios.get(process.env.VUE_APP_API + `Cluster/Get`)
                    .then(r => {
                        console.log(r);
                        self.rowData = r.data
                        self.$refs.grid.resize()
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this
                self.addDialog = true
                self.createItem.clusterName = null
                self.createItem.displayname = null
                self.createItem.value = null
                 self.$refs.clusterForm.reset()
            },
            open() {
                let self = this
                self.dialog = true
                self.GetData()

            },
            submitADD() {
                let self = this

                if (this.$refs.clusterForm.validate()) {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + `Cluster/Save`, self.createItem)
                        .then(r => {
                            console.log(r);
                            self.GetData()
                            self.addDialog = false
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                }

            },
            submit() {
                let self = this
            },
        }

    }
</script>