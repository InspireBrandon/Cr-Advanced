<template>
    <v-dialog v-model="dialog" persistent width="1000px">
        <v-toolbar color="primary" dark>
            <v-toolbar-title>
                Select Dashboard
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="dialog=false" icon>
                <v-icon>
                    close
                </v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-list>
                    <div v-for="(item,idx) in dashboards" :key="idx">
                        <v-list-tile @click="selected=item" :class="{ 'highlighted': selected == item  }">
                            {{item.name}}
                        </v-list-tile>
                        <v-divider></v-divider>
                    </div>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer>
                </v-spacer>
                <v-btn @click="dialog=false" color="error"> cancel</v-btn>
                <v-btn :disabled="selected==null" color="primary" @click="close()"> submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                selected: null,
                dashboards: null,
            }
        },
        mounted() {},
        methods: {
            getdashboards(callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Dashboard").then(r => {
                    console.log(r);

                    self.dashboards = r.data
                    callback()
                })

            },
            show(callback) {
                let self = this
                self.getdashboards(dashboards => {
                    self.callback = callback
                    self.dialog = true
                })

            },
            close() {
                let self = this
                self.dialog = false
                self.callback(self.selected)
            }
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>