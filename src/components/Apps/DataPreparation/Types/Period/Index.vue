<template>
    <div>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-toolbar flat dense dark>
                            <v-btn icon @click="$router.go(-1)">
                                <v-icon>arrow_back</v-icon>
                            </v-btn>
                            <v-toolbar-title>Period</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="openAdd">
                                <v-icon>add_circle</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-list dense class="pa-0 list-height">
                            <template v-for="(item, index) in items">
                                <v-list-tile :key="item.title" avatar ripple>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <span class="font-weight-medium">{{ item.period_Name }}</span>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-menu left>
                                            <v-btn slot="activator" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile @click="openEdit(item)">Edit</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile>Delete</v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
                            </template>
                        </v-list>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog persistent v-model="dialog" max-width="800px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Maintain Period</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text>
                    <v-form>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md6>
                                    <!-- <v-text-field label="Period From Date" v-model="form.period_From_Date"></v-text-field> -->
                                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="form.period_From_Date" label="Picker without buttons"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.period_From_Date" @input="menu2 = true"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Period Name" v-model="form.period_Name"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <!-- <v-text-field label="Period To Date" v-model="form.period_To_Date">
                                    </v-text-field> -->
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="form.period_To_Date" label="Picker without buttons"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.period_To_Date" @input="menu = true"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="save">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- <SimpleMaint :name="name" :headerName="headerName" ref="maint"></SimpleMaint> -->
    </div>
</template>

<script>
    import SimpleMaint from '@/components/Apps/DataPreparation/Common/SimpleMaint.vue'
    import Axios from 'axios';
    import moment from 'moment'

    export default {
        name: 'common-import-list',
        props: ['name', 'headerName'],
        components: {
            SimpleMaint
        },
        data: () => {
            return {
                isAdd:true,
                menu: false,
                menu2: false,
                items: [],
                form: {
                    id:null,
                    period_Name: null,
                    period_To_Date: null,
                    period_From_Date: null

                },
                dialog: false
            }
        },
        computed: {
            formatDate() {
                if (this.form.period_From_Date != null) {
                    moment(this.form.period_From_Date).format('YYYY-MM-DD')
                }
            }
        },
        created() {
            this.getItems();
        },
        methods: {
            openEdit(item) {
                let self = this;
                self.isAdd=false
                self.dialog = true
                self.form.id = item.id
                self.form.period_Name = item.period_Name
                self.form.period_To_Date = moment(item.period_To_Date).format('YYYY-MM-DD')
                self.form.period_From_Date = moment(item.period_From_Date).format('YYYY-MM-DD')
            },
            getItems() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Period`)
                    .then(r => {
                        self.items = r.data;

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this;
                self.isAdd=true

                self.dialog = true
                self.form.period_Name = null
                self.form.period_To_Date = null
                self.form.period_From_Date = null
            },
            save() {
                let self = this;
                let type = self.isAdd ? "post" : "put";

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios[type](process.env.VUE_APP_API + `Retailer/Period`, self.form)
                    .then(r => {
                        if (!self.isAdd)
                            self.form.id = r.data.id;

                        
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        self.dialog = false;
                    })
            },

        }
    }
</script>

<style scoped>
    .list-height {
        height: calc(100vh - 200px);
        overflow: auto;
    }
</style>