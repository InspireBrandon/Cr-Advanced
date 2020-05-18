<template>
    <v-card tile flat>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list dense>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="saveFile" :disabled="promotion == null">
                            <v-list-tile-title>Save as</v-list-tile-title>
                        </v-list-tile>
                        <!-- <v-list-tile @click="saveFileAs" :disabled="promotion == null">
                            <v-list-tile-title>Save </v-list-tile-title>
                        </v-list-tile> -->
                        <v-divider></v-divider>
                        <v-list-tile @click="closeFile" :disabled="promotion == null">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn @click="openAdmin">manage admin</v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Promotions</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-md v-if="promotion == null && !loading">
            <v-layout justify-center align-center>
                <v-flex md6 lg6>
                    <h1 style="text-align: center;">No promotion selected</h1>
                    <h3 style="text-align: center;">What would you like to do?</h3>
                </v-flex>
            </v-layout>
            <v-layout justify-center align-center class="mt-3">
                <v-flex md2 lg2>
                    <v-card @click="openFile" class="selectable">
                        <v-card-text style="text-align: center;">
                            <h3>Open</h3>
                            <v-icon class="mt-3" :size="40">folder</v-icon>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md2 lg2>
                    <v-card @click="newFile" class="selectable">
                        <v-card-text style="text-align: center;">
                            <h3>Create new</h3>
                            <v-icon class="mt-3" :size="40">add</v-icon>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md2 lg2>
                    <v-card class="selectable">
                        <v-card-text style="text-align: center;">
                            <h3>Import</h3>
                            <v-icon class="mt-3" :size="40">arrow_downward</v-icon>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout justify-center align-center class="mt-3">
                <v-flex sm12 md12 lg12 xl9>
                    <v-list dense hover class="pa-0">
                        <div v-for="(item,idx) in promotions" :key="idx">
                            <template>
                                <v-list-tile avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{item.description}}</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-spacer></v-spacer>
                                    <v-list-tile-actions>
                                        <v-btn small color="primary" @click="getPromotionByID(item)">Edit</v-btn>
                                        <v-btn small color="primary" @click="openCatgeories(item.id)">Categories &
                                            resources</v-btn>
                                        <v-btn small color="primary">Event Planning</v-btn>
                                        <v-btn small color="primary">Costs</v-btn>
                                        <v-btn small color="primary">Item Selection</v-btn>
                                        <v-btn small color="primary">Evaulate</v-btn>
                                    </v-list-tile-actions>
                                </v-list-tile>
                                <v-divider></v-divider>
                            </template>
                        </div>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container grid-list-md v-if="promotion != null && !loading">
            <v-layout row wrap>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md6 lg6>
                    <label>Description</label>
                    <v-text-field style="border: 1px solid lightgrey;" flat solo hide-details
                        v-model="promotion.description" label="Description"></v-text-field>
                </v-flex>

                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Date From</label>
                    <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" :nudge-right="40" lazy
                        transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field style="border: 1px solid lightgrey;" flat solo hide-details
                                v-model="promotion.startDate" @blur="date = parseDate(promotion.startDate)" label="Date"
                                prepend-icon="event" v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="promotion.startDate" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Date To</label>
                    <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :nudge-right="40" lazy
                        transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field style="border: 1px solid lightgrey;" flat solo hide-details
                                v-model="promotion.endDate" @blur="date = parseDate(promotion.endDate)" label="Date"
                                prepend-icon="event" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="promotion.endDate" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Event Group</label>
                    <v-select style="border: 1px solid lightgrey;" flat solo hide-details label="Event Group"
                        v-model="promotion.event_Group" :items="eventGroups"></v-select>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Event Theme</label>
                    <v-select style="border: 1px solid lightgrey;" flat solo hide-details label="Event Theme"
                        v-model="promotion.event_Theme" :items="eventThemes"></v-select>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Type</label>
                    <v-autocomplete style="border: 1px solid lightgrey;" flat solo hide-details :items="promotionTypes"
                        item-text="displayname" item-value="id" v-model="promotion.promotion_Type_ID"
                        label="Promotion Type"></v-autocomplete>
                </v-flex>
                <v-flex md6 lg6>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Region</label>
                    <v-autocomplete style="border: 1px solid lightgrey;" flat solo hide-details :items="regions"
                        item-text="region_Name" item-value="region_ID" @change="filterByRegion" v-model="selectedRegion"
                        label="Region">
                    </v-autocomplete>
                </v-flex>

                <v-flex md3 lg3>
                    <label>Store Cluster</label>
                    <v-autocomplete style="border: 1px solid lightgrey;" @change="filterByStoreCluster" flat solo
                        hide-details :items="storeClusters" item-text="storeCluster_Name" item-value="storeCluster_ID"
                        v-model="selectedStoreCluster" label="Store Cluster">
                    </v-autocomplete>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Custom Cluster</label>
                    <v-autocomplete style="border: 1px solid lightgrey;" @change="filterByCustomCluster" flat solo
                        hide-details :items="customClusters" item-text="customCluster_Name"
                        item-value="customCluster_ID" v-model="selectedCustomCluster" label="Custom Cluster">
                    </v-autocomplete>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Store Name</label>
                    <v-autocomplete style="border: 1px solid lightgrey;" flat solo hide-details :items="stores"
                        item-text="store_Name" item-value="store_ID" v-model="promotion.stores" label="Store Name"
                        multiple>
                    </v-autocomplete>
                </v-flex>
            </v-layout>



            <!-- <v-layout row wrap class="mt-4">
                <v-flex md3>
                    <div style="border: 1px solid lightgrey;">
                        <v-text-field v-model="search" flat solo prepend-inner-icon="search" placeholder="Search..."
                            hide-details></v-text-field>
                    </div>
                </v-flex>
                <v-flex md9>
                    <div style="text-align: right;">
                        <v-btn style="margin-top: 12px!important;" @click="addProduct" color="primary" class="ma-0">Add
                            Product</v-btn>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn style="margin-top: 12px!important;" color="primary" class="ma-0 ml-3" v-on="on">
                                    More</v-btn>
                            </template>
                            <v-list dense class="pa-0">
                                <v-list-tile @click="">
                                    <v-list-tile-title>Import Products</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </div>
                </v-flex>
            </v-layout> -->
            <!-- <v-layout row wrap>
                <v-flex md12 style="height: calc(100vh - 300px); overflow-y: scroll;">
                    <table border="1" style="width: 100%">
                        <thead>
                            <tr>
                                <th style="width: 45%;">Barcode</th>
                                <th style="width: 45%;">Description</th>
                                <th style="width: 20px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in filteredProducts" :key="idx">
                                <td>{{ item.barcode }}</td>
                                <td>{{ item.description }}</td>
                                <td>
                                    <a @click.prevent="removeProduct(item)" href="#">remove</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-flex>
            </v-layout> -->
        </v-container>
        <PromotionSelector ref="promotionSelector" />
        <Spinner ref="spinner"></Spinner>
        <AdminModal ref="AdminModal" />
    </v-card>
</template>

<script>
    import Axios from 'axios'
    import PromotionSelector from './PromotionSelector.vue'
    import Spinner from "@/components/Common/Spinner";
    import AdminModal from "./AdminModal.vue";


    export default {
        name: 'promotions',
        components: {
            PromotionSelector,
            Spinner,
            AdminModal
        },
        data() {
            return {
                promotions: [],
                menu1: false,
                menu2: false,
                dateFrom: null,
                dateTo: null,
                periodsTo: [],
                periodsFrom: [],
                promotion: null,
                loading: false,
                fullFilterArr: [],
                promotionTypes: [],
                eventGroups: [{
                    text: "Promotion",
                    value: 0
                }, {
                    text: "Merchandise Event",
                    value: 1
                }, {
                    text: "Tempory Event",
                    value: 2
                }, {
                    text: "Other Event",
                    value: 3
                }],
                eventThemes: [{
                    text: "Agriculture",
                    value: 0
                }, {
                    text: "Retail",
                    value: 1
                }, {
                    text: "Both",
                    value: 2
                }],
                search: '',
                regions: [],
                selectedRegion: null,
                storeClusters: [],
                selectedStoreCluster: null,
                customClusters: [],
                selectedCustomCluster: null,
                stores: [],
                selectedStore: [],
            }
        },
        computed: {
            filteredProducts() {
                let self = this;

                if (self.search == "") {
                    return self.promotion.products;
                } else {
                    return self.promotion.products.filter(item => {
                        return item.barcode.includes(self.search) || item.description.includes(self.search);
                    });
                }
            }
        },
        mounted() {
            this.getClusters()
            this.getPromotions()
            this.getPromotionTypes();
        },
        methods: {
            openAdmin() {
                let self = this
                self.$refs.AdminModal.open(cb => {

                })
            },
            openCatgeories(id) {
                let self = this
                self.$router.push(`/Promotions/CategoriesAndResources/${id}`)
                // /Promotions/CategoriesAndResources/:promotionID
            },
            getPromotionByID(item) {
                let self = this
                self.promotion = item
            },
            getPromotions() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Promotion`).then(r => {
                    console.log("getPromotions", r.data);

                    self.promotions = r.data
                })
            },
            getDates(callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + "Periods")
                    .then(r => {
                        let periods = r.data;

                        for (let i = 0; i < periods.length; i++) {
                            let period = periods[i];

                            self.periodsFrom.push({
                                text: formatDate(period.period_From_Date),
                                value: period.id
                            })

                            self.periodsTo.push({
                                text: formatDate(period.period_To_Date),
                                value: period.id
                            })
                        }

                        callback();
                    })
            },
            filterByCustomCluster() {
                let self = this
                let canadd = true
                self.stores = []
                self.fullFilterArr.forEach(item => {
                    canadd = true
                    if (item.customCluster_ID == self.selectedCustomCluster || self.selectedCustomCluster ==
                        0) {
                        self.stores.forEach(store => {
                            if (item.store_ID == store.store_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.stores.push(item)
                        }
                    } else {
                        console.log("else");

                    }
                })
            },
            filterByStoreCluster() {
                let self = this
                let canadd = true
                self.customClusters = [{
                    customCluster_ID: 0,
                    customCluster_Name: 'All'
                }]
                self.fullFilterArr.forEach(item => {
                    canadd = true
                    if (item.storeCluster_ID == self.selectedStoreCluster || self.selectedStoreCluster == 0) {
                        self.customClusters.forEach(cluster => {
                            if (cluster.customCluster_ID == item.customCluster_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.customClusters.push(item)
                        }
                    }
                })
            },
            filterByRegion() {
                let self = this
                let canadd = true
                self.storeClusters = [{
                    storeCluster_ID: 0,
                    storeCluster_Name: 'All'
                }]
                self.fullFilterArr.forEach(item => {
                    canadd = true
                    if (item.region_ID == self.selectedRegion || self.selectedRegion == 0) {
                        self.storeClusters.forEach(cluster => {
                            if (cluster.storeCluster_ID == item.storeCluster_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.storeClusters.push(item)
                        }
                    }
                })
            },
            getClusters() {
                let self = this
                console.log("in get clusters");

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Promotion/ClusterFilter`).then(r => {
                    self.fullFilterArr = r.data
                    self.regions = [{
                        region_ID: 0,
                        region_Name: "All"
                    }]
                    self.stores = []
                    self.customClusters = [{
                        customCluster_ID: 0,
                        customCluster_Name: 'All'
                    }]
                    self.storeClusters = [{
                        storeCluster_ID: 0,
                        storeCluster_Name: 'All'
                    }]
                    let canadd = true
                    r.data.forEach(item => {
                        canadd = true
                        // regions
                        self.regions.forEach(region => {
                            if (region.region_ID == item.region_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.regions.push(item)
                        }
                        canadd = true
                        // storeClusters
                        self.storeClusters.forEach(storeCluster => {
                            if (storeCluster.storeCluster_ID == item.storeCluster_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.storeClusters.push(item)
                        }
                        canadd = true
                        // custom Cluster
                        self.customClusters.forEach(customCluster => {
                            if (customCluster.customCluster_ID == item.customCluster_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.customClusters.push(item)
                        }
                        canadd = true
                        // Stores
                        self.stores.forEach(store => {
                            if (store.store_ID == item.store_ID) {
                                canadd = false
                            }
                        })
                        if (canadd == true) {
                            self.stores.push(item)
                        }
                        canadd = true
                    })
                    console.log("getClusters", r);
                })
            },
            createHeader() {
                let self = this
            },
            newFile() {
                let self = this;
                self.getPromotionTypes();
                self.promotion = new Promotion();
            },
            openFile() {
                let self = this;

                self.$refs.promotionSelector.show(promotion => {
                    self.$refs.spinner.show();
                    self.loading = true;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `Promotion?promotionID=${promotion.id}`)
                        .then(r => {
                            self.getPromotionTypes();
                            self.promotion = r.data;
                            self.$refs.spinner.hide();
                            self.loading = false;
                        })
                        .catch(e => {

                        })
                })
            },
            saveFile() {
                let self = this;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                console.log(self.promotion);
                let storeReq = []
                console.log(self.selectedStore);


                // self.promotion.endDate = self.dateTo.text
                // self.promotion.endPeriodID = self.dateTo.value
                // self.promotion.startDate = self.dateFrom.text
                // self.promotion.startPeriodID = self.dateFrom.value

                // self.promotion.stores = self.selectedStore
                console.log("[savefile] promotion", self.promotion);

                Axios.post(process.env.VUE_APP_API + `CreatePromotion`, self.promotion).then(r => {
                    self.getPromotions()
                })
            },
            saveFileAs() {
                let self = this;
            },
            closeFile() {
                let self = this;
                self.promotion = null;
            },
            addProduct() {
                let self = this;
                self.promotion.products.push(new Promotion_Product());
            },
            getPromotionTypes() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PromotionTypes`)
                    .then(r => {
                        self.promotionTypes = r.data;
                    })
                    .catch(e => {

                    })
            },
            removeProduct(product) {
                let self = this;

                self.promotion.products.splice(self.promotion.products.indexOf(product), 1);
            }
        }
    }

    function Promotion() {
        let self = this;
        self.id = 0;
        self.promotion_Type_ID = 0;
        self.description = "";
        self.startPeriodID = 0;
        self.startDate = "";
        self.endPeriodID = 0;
        self.endDate = "";
        self.filter_Type = 0;
        self.filter_ID = 0;
        self.products = [];
        self.event_Group = null;
        self.event_Theme = null;
        self.stores = []
    }

    function Promotion_Product() {
        let self = this;
        self.promotion_ID = 0;
        self.store_ID = 0;
        self.product_ID = 0;
        self.barcode = "0001";
        self.description = "Product";
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px 5px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }

    .selectable {
        cursor: pointer;
    }

    .selectable:hover {
        background: lightgray;
        cursor: pointer;
    }
</style>