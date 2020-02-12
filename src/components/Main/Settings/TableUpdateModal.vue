<template>
    <v-dialog v-model="dialog" width="800" persistant>
        <v-card>
            <v-toolbar color="primary" dense dark>
                <v-toolbar-title>
                    Power Bi Table Update
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md5>
                        <v-autocomplete label="select a table to update" v-model="selectedTable" :items="tables">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex md2>
                    </v-flex>
                    <v-flex md5>
                        <v-autocomplete label="select department to update" :items="departments"
                            v-model="selectedDepartment">
                        </v-autocomplete>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color='error' @click="dialog=false">cancel</v-btn>
                <v-btn color="primary" @click="submit">submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                tables: [{
                    text: "Topline",
                    value: 0
                }, {
                    text: "Category",
                    value: 1
                }],
                selectedTable: null,
                departments: [],
                selectedDepartment: null,

            }
        },
        mounted() {
            this.getDepartments()
        },
        methods: {
            getDepartments() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.departments = [{
                    text: "All",
                    value: "All"
                }]
                axios.get(process.env.VUE_APP_API + `Retailer/Department`).then(r => {
                    console.log("GET DEPARTMENTS", r);
                    r.data.forEach(element => {
                        self.departments.push({
                            text: element.department,
                            value: element.id
                        })
                    });
                })
            },
            open() {
                let self = this

                self.dialog = true
            },
            submit() {
                let self = this
            },
        }
    }
</script>