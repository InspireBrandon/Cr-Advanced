<template>
    <v-dialog v-model="dialog" persistent height="500" width="1000">
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>
                    Basket Maintenance
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
                    Add Basket
                </v-btn>
            </v-toolbar>
            <grid ref="grid" :data="rowData" :getData="GetData" />
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
                        <v-form ref="BasketForm">
                            <v-text-field label="Basket" :rules="nameRules" v-model="createItem.basket">
                            </v-text-field>
                            <v-text-field label="Display Name" :rules="nameRules" v-model="createItem.displayname">
                            </v-text-field>
                            <v-text-field label="Description" :rules="nameRules" v-model="createItem.description">
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
        props:["getBaskets"],
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
                    basket: null,
                    displayname: null,
                    description: null,
                    active: true,
                    rank: null,
                    levels:3
                },
                rowData: [],
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
                        self.$refs.grid.resize()
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this
                self.addDialog = true
                self.createItem.basket = null
                self.createItem.displayname = null
                self.createItem.description = null
                self.$refs.BasketForm.reset()
            },
            open() {
                let self = this
                self.dialog = true
                self.GetData()
            },
            submitADD() {
                let self = this
                if (this.$refs.BasketForm.validate()) {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.post(process.env.VUE_APP_API + `Basket`, self.createItem)
                        .then(r => {
                            self.GetData()
                            self.addDialog = false
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                }
            },
        }
    }
</script>