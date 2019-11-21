<template>
    <div>
        <v-container class="pa-0 pl-1" fluid grid-list-xs>
            <v-layout row wrap>
                <v-flex xs7 md8 class="pa-2">
                    <v-layout row wrap>
                        <v-flex xs8>
                            <h1 class="headline mt-1">Import Values</h1>
                        </v-flex>
                        <v-flex xs4>
                            <v-text-field v-model="searchTextGrid" class="pt-0" hide-details prepend-inner-icon="search" placeholder="Search...">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <Grid :rowData="rowDataComputed" />
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs5 md4>
                    <v-card tile flat style="border-left: 1px solid #e2e2e2; height: calc(100vh - 112px);">
                        <v-card-text>
                            <h1 class="headline">System Values</h1>
                            <v-text-field v-model="searchText" class="mb-2" hide-details prepend-inner-icon="search"
                                placeholder="Search...">
                            </v-text-field>
                            <div>
                                <span class="font-weight-bold">Departments</span>
                                <span class="font-weight-light ml-1">(drag department to link)</span>
                            </div>
                            <v-card flat style="height: calc(100vh - 248px); overflow-y: auto;">
                                <v-card draggable style="cursor: pointer;" @dragstart="dragStart(item)"
                                    @dragend="clearDrag" v-for="(item, idx) in systemValuesComputed" :key="idx"
                                    class="mb-1" color="grey lighten-2" flat>
                                    <v-card-text class="pa-1">{{ item.name }}</v-card-text>
                                </v-card>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios'
    import Grid from './Grid'
    import jwt from 'jsonwebtoken';

    export default {
        components: {
            Grid
        },
        data() {
            return {
                systemValues: [],
                searchText: "",
                searchTextGrid: "",
                rowData: []
            }
        },
        mounted() {
            let self = this;
            self.getImportBrands();
            self.getSystemBrands();
        },
        computed: {
            systemValuesComputed() {
                let self = this;

                if (self.searchText == "") {
                    return self.systemValues;
                } else {
                    return self.systemValues.filter(e => {
                        return e.name.toUpperCase().indexOf(self.searchText.toUpperCase()) > -1;
                    })
                }
            },
            rowDataComputed() {
                let self = this;

                if (self.searchTextGrid == "") {
                    return self.rowData;
                } else {
                    return self.rowData.filter(e => {
                        if (e.systemCategory_Name == null) {
                            return (e.name.toUpperCase().indexOf(self.searchTextGrid.toUpperCase()) > -1);
                        } else {
                            return (e.name.toUpperCase().indexOf(self.searchTextGrid.toUpperCase()) > -1 || e
                                .systemBrand_Name.toUpperCase().indexOf(self.searchTextGrid
                                    .toUpperCase()) > -1);
                        }
                    })
                }
            }
        },
        methods: {
            dragStart(store) {
                let self = this;
                window.dragStore = store;
            },
            clearDrag(ev) {
                ev.currentTarget.style.border = "none";
                window.library = null;
            },
            getImportBrands() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API +
                        `SuplierLocationImportTX/Brands?userID=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.rowData = r.data;
                    })
            },
            getSystemBrands() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemBrand`)
                    .then(r => {
                        self.systemValues = r.data;
                    })
            }
        }
    }
</script>