<template>
    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>User Projects</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>

            </v-toolbar>
            <grid :rowData="userDepartments" />
            <!-- <v-container grid-list-md>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit">submit</v-btn>
                </v-card-actions>
            </v-container> -->
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    import grid from './Grid.vue'

    export default {
        components: {
            grid
        },
        data() {
            return {
                userDepartments: [],
                dialog: false,
                afterReturn: null
            }
        },
        mounted() {
            let self = this;
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.getUserDepartments();
                self.dialog = true;
            },
            getUserDepartments() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `ProjectUsers`)
                    .then(r => {
                        self.userDepartments = r.data;
                    })
                    .catch(e => {

                    })
            },
            submit() {
                let self = this;
            },
            getUsers() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `ProjectUsers`)
                    .then(r => {

                    })
                    .catch(e => {
                        
                    })
            }
        }
    }
</script>