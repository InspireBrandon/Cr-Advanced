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
                            <v-toolbar-title>{{ name }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="openAdd">
                                <v-icon>add_circle</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-list dense class="pa-0 list-height">
                            <template v-if="index < 25" v-for="(item, index) in paginatedItems">
                                <v-list-tile :key="item.title" avatar ripple>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <span class="font-weight-medium">{{ item.displayname }}</span>
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
                        <v-toolbar flat dense dark>
                            <v-spacer></v-spacer>
                            <v-btn :disabled="pageNumber == 0" color="primary" @click="pageNumber--">back</v-btn>
                            {{ pageNumber + 1 }} / {{ Math.round(items.length / allowedRecords) == 0 ? 1 : Math.round(items.length / allowedRecords) }}
                            <v-btn :disabled="pageNumber == (Math.round(items.length / allowedRecords) - 1) " color="primary" @click="pageNumber++">next</v-btn>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <SimpleMaint :name="name" :headerName="headerName" ref="maint"></SimpleMaint>
    </div>
</template>

<script>
    import SimpleMaint from '@/components/Apps/DataPreparation/Common/SimpleMaint.vue'
    import Axios from 'axios';

    export default {
        name: 'common-import-list',
        props: ['name', 'headerName'],
        components: {
            SimpleMaint
        },
        data: () => {
            return {
                items: [],
                pageNumber: 0,
                allowedRecords: 25
            }
        },
        created() {
            this.getItems();
        },
        computed: {
            paginatedItems() {
                let self = this;

                let items = JSON.parse(JSON.stringify(self.items));
                let tmp = items.splice(((self.pageNumber * self.allowedRecords)), self.allowedRecords)
                return tmp;
            }
        },
        methods: {
            openEdit(item) {
                let self = this;
                self.$refs.maint.show(false, item, newItem => {
                    for(var prop in item) {
                        item[prop] = newItem[prop];
                    }
                });
            },
            getItems() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/${self.name}`)
                    .then(r => {
                        self.items = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this;
                self.$refs.maint.show(true);
            }
        }
    }
</script>

<style scoped>
    .list-height {
        height: calc(100vh - 220px);
        overflow: auto;
    }
</style>