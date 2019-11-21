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
                            <v-text-field class="pt-0" hide-details prepend-inner-icon="search" placeholder="Search...">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <Grid />
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
                            <div v-if="retailerGroup == null">
                                <span class="font-weight-bold">Retailer Groups</span>
                                <span class="font-weight-light ml-1">(click for retailers)</span>
                            </div>
                            <div v-if="retailer == null && retailerGroup != null">
                                <span @click="goBack" class="font-weight-bold" style="cursor: pointer;">
                                    <v-icon :size="18">arrow_back</v-icon>
                                </span>
                                <span class="font-weight-bold margin ml-2">{{ retailerGroup.name }}</span>
                                <span class="font-weight-light ml-1">(click for stores)</span>
                            </div>
                            <div v-if="retailer != null && retailerGroup != null">
                                <span @click="goBack" class="font-weight-bold" style="cursor: pointer;">
                                    <v-icon :size="18">arrow_back</v-icon>
                                </span>
                                <span class="font-weight-bold ml-2">{{ retailer.name }}</span>
                                <span class="font-weight-light ml-1">(drag stores to link)</span>
                            </div>
                            <v-card flat style="height: calc(100vh - 248px); overflow-y: auto;">
                                <v-card @click="checkDrill(item)" :draggable="retailer != null" style="cursor: pointer;"
                                    @dragstart="dragStart(item)" @dragend="clearDrag"
                                    v-for="(item, idx) in systemValuesComputed" :key="idx" class="mb-1"
                                    color="grey lighten-2" flat>
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

    export default {
        components: {
            Grid
        },
        data() {
            return {
                systemValues: [],
                searchText: "",
                stores: [],
                retailerGroup: null,
                retailer: null,
            }
        },
        mounted() {
            let self = this;
            self.getRetailerGroups();
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
            getRetailerGroups() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "RetailerGroup")
                    .then(r => {
                        self.systemValues = r.data.retailerGroupList;
                    })
            },
            getRetailersByGroup() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `Retailer?retailerGroupID=${self.retailerGroup.id}`)
                    .then(r => {
                        self.systemValues = r.data.retailerList;
                    })
            },
            getRetailerStores() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `RetailerStore?retailerID=${self.retailer.id}`)
                    .then(r => {
                        self.systemValues = r.data.retailerStoreList;
                    })
            },
            checkDrill(item) {
                let self = this;

                if (self.retailer == null) {
                    if (self.retailerGroup == null) {
                        self.retailerGroup = item;
                        self.getRetailersByGroup();
                    } else {
                        self.retailer = item;
                        self.getRetailerStores();
                    }
                }
            },
            goBack() {
                let self = this;

                if (self.retailer != null) {
                    self.retailer = null;
                    self.getRetailersByGroup();
                } else {
                    self.retailerGroup = null;
                    self.getRetailerGroups()
                }
            }
        }
    }
</script>