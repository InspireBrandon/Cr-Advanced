<template>
    <v-dialog v-model="dialog" persistent width="1000px">
        <v-toolbar color="primary" dark>
            <v-toolbar-title>
               Select Report
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
                    <div v-for="(item,idx) in reports" :key="idx">
                        <v-list-tile @click="selected=item" :class="{ 'highlighted': selected == item  }">
                            {{item.text}}
                        </v-list-tile>
                        <v-divider></v-divider>
                    </div>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer>
                </v-spacer>
                <v-btn @click="dialog=false" color="error"> cancel</v-btn>
                <v-btn :disabled="selected==null" color="primary" @click="submit()"> submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
<script>
    import Axios from "axios"
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                config: null,
                squareIndex: null,
                selected: null,
                reports: [],
            }
        },
        methods: {
            getReports(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetReports")
                    .then(r => {
                        self.reports = [];

                        r.data.value.forEach(report => {
                            self.reports.push({
                                text: report.name,
                                value: report.id
                            })
                        });


                        callback();
                    })
            },
            open(callback) {
                let self = this
                self.selected=null
                self.getReports(() => {
                    self.callback = callback
                    self.dialog = true
                })

            },
            submit() {
                let self = this
                self.dialog = false
                console.log("power bi submit",self.selected);
                
                self.callback(self.selected)
            },
        }

    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>