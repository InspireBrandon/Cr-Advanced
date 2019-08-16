<template>
    <v-dialog v-model="dialog" persistent>
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>
                    Basket Maintenance
                </v-toolbar-title>
                <v-btn icon @click="openAdd">
                    <v-icon>
                        add
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <grid ref="grid" :data="rowData"/>
            <v-dialog v-model="addDialog" persistent width="600px" height="600px">
                <v-card>
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>
                            Add Basket
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="addDialog=false">
                            <v-icon>
                                close
                            </v-icon>
                        </v-btn>

                    </v-toolbar>
                    <v-card-text>
                        <v-text-field label="basket" v-model="createItem.basket">
                        </v-text-field>
                        <v-text-field label="displayname" v-model="createItem.displayname">
                        </v-text-field>
                        <v-text-field label="description" v-model="createItem.description">
                        </v-text-field>
                        <v-text-field label="rank" v-model="createItem.rank">
                        </v-text-field>

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="submitADD">submit </v-btn>
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
                addDialog: false,
                dialog: false,
                callback: null,
                createItem: {
                    basket: null,
                    displayname: null,
                    description: null,
                    active: true,
                    rank: null,
                },
                rowData:[],
            }
        },
        methods: {
            GetData() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Basket`)
                    .then(r => {
                        console.log(r);
                        self.rowData = r.data
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this
                self.addDialog = true

            },
            open() {
                let self = this
                self.dialog = true
                self.GetData()

            },
            submitADD() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                 Axios.post(process.env.VUE_APP_API + `Basket`,self.createItem)
                    .then(r => {
                        console.log(r);
                         self.GetData()
                         self.addDialog = false
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            submit() {
                let self = this
            },
        }

    }
</script>