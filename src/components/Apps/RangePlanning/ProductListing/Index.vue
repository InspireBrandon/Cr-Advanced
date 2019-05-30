<template>
    <div>
        <v-layout row justify-center>
            <v-dialog fullscreen persistent v-model="dialog">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>New Product Listing</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="close">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text class="pa-0">
                        <div class="elevation-3">

                            <v-toolbar dark dense flat>
                                <v-toolbar-items>
                                    <v-menu dark offset-y style="margin-bottom: 10px;">
                                        <v-btn slot="activator" flat>
                                            File
                                        </v-btn>
                                        <v-list light dense>
                                            <v-list-tile @click="newLine">
                                                <v-list-tile-title>New Line</v-list-tile-title>
                                            </v-list-tile>
                                            <v-list-tile @click="openFile">
                                                <v-list-tile-title>Open</v-list-tile-title>
                                            </v-list-tile>
                                            <v-list-tile @click="prompt">
                                                <v-list-tile-title>Save</v-list-tile-title>
                                            </v-list-tile>
                                            <v-list-tile @click="closeFile">
                                                <v-list-tile-title>Close</v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </v-toolbar-items>
                                <v-btn color="primary" @click="overview = !overview">
                                    {{ overview == false? 'Report' : 'Sections' }}</v-btn>
                            </v-toolbar>

                            <v-tabs v-if="items.length > 0" v-show="!overview" v-model="active" grow dark slider-color="primary">
                                <v-tab ripple v-for="(tab, idx) in tabs" :key="idx">{{ tab }}</v-tab>
                                <!-- Standard -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Standard v-if="active == 0" :canPaste="canPaste" :copy="copy" :paste="paste"
                                            :remove="remove" :duplicate="duplicate" :items="items" ref="Standard">
                                        </Standard>
                                    </v-card>
                                </v-tab-item>
                                <!-- Vendor -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Vendor v-if="active == 1" :manufacturers="manufacturers" :brands="brands"
                                            :getManufacturerDetailsByID="getManufacturerDetailsByID"
                                            :setItemsData="setItemsData" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="Vendor">
                                        </Vendor>
                                    </v-card>
                                </v-tab-item>
                                <!-- Hierachy -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Hierachy v-if="active == 2" :setItemsData="setItemsData"
                                            :getCategoryDetailsByID="getCategoryDetailsByID"
                                            :subcategories="subcategories" :planograms="planograms" :segments="segments"
                                            :categoryLinks="categoryLinks" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="Hierachy">
                                        </Hierachy>
                                    </v-card>
                                </v-tab-item>
                                <!-- Item Status -->
                                <v-tab-item>
                                    <v-card flat>
                                        <ItemStatus v-if="active == 3" :itemStatuses="itemStatuses"
                                            :activeShopCodes="activeShopCodes" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="ItemStatus">
                                        </ItemStatus>
                                    </v-card>
                                </v-tab-item>
                                <!-- Images -->
                                <v-tab-item>
                                    <v-card flat>
                                        <ImagesAndDimensions v-if="active == 4" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="ImagesAndDimensions">
                                        </ImagesAndDimensions>
                                    </v-card>
                                </v-tab-item>
                                <!-- Supporting Documents -->
                                <v-tab-item>
                                    <v-card flat>
                                        <SupportingDocuments v-if="active == 5" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="SupportingDocuments">
                                        </SupportingDocuments>
                                    </v-card>
                                </v-tab-item>
                                <!-- Resources -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Resources v-if="active == 6" :canPaste="canPaste" :copy="copy" :paste="paste"
                                            :remove="remove" :duplicate="duplicate" :items="items" ref="Resources">
                                        </Resources>
                                    </v-card>
                                </v-tab-item>
                                <!-- Stock Control -->
                                <v-tab-item>
                                    <v-card flat>
                                        <StockControl v-if="active == 7" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="StockControl">
                                        </StockControl>
                                    </v-card>
                                </v-tab-item>
                                <!-- Price And Margin -->
                                <v-tab-item>
                                    <v-card flat>
                                        <PriceAndMargin v-if="active == 8" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="PriceAndMargin">
                                        </PriceAndMargin>
                                    </v-card>
                                </v-tab-item>
                                <!-- Opening Orders -->
                                <v-tab-item>
                                    <v-card flat>
                                        <OpeningOrders v-if="active == 9" :canPaste="canPaste" :copy="copy"
                                            :paste="paste" :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="OpeningOrders">
                                        </OpeningOrders>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs>

                            <v-card v-if="items.length > 0" flat v-show="overview">
                                <table style="width: calc(100vw - 32px); overflow-x: scroll">
                                    <thead>
                                        <tr>
                                            <th style="text-align: left;">Product System ID</th>
                                            <th style="text-align: left;">Product Code</th>
                                            <th style="text-align: left;">Barcode</th>
                                            <th style="text-align: left;">Description</th>
                                            <th style="text-align: left;">Vendor No.</th>
                                            <th style="text-align: left;">Vendor Name</th>
                                            <th style="text-align: left;">Vendor Description</th>
                                            <th style="text-align: left;">Brand</th>
                                            <th style="text-align: left;">Height</th>
                                            <th style="text-align: left;">Width</th>
                                            <th style="text-align: left;">Depth</th>
                                            <th style="text-align: left;">Tray Height</th>
                                            <th style="text-align: left;">Tray Width</th>
                                            <th style="text-align: left;">Tray Depth</th>
                                            <th style="text-align: left;">Case Height</th>
                                            <th style="text-align: left;">Case Width</th>
                                            <th style="text-align: left;">Case Depth</th>
                                            <th style="text-align: left;">Shrink Height</th>
                                            <th style="text-align: left;">Shrink Width</th>
                                            <th style="text-align: left;">Shrink Depth</th>
                                            <th style="text-align: left;">Pallet Height</th>
                                            <th style="text-align: left;">Pallet Width</th>
                                            <th style="text-align: left;">Pallet Depth</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, idx) in items" :key="idx">
                                            <td>{{ item.productSystemID }}</td>
                                            <td>{{ item.productCode }}</td>
                                            <td>{{ item.barcode }}</td>
                                            <td>{{ item.description }}</td>
                                            <td>{{ item.vendorNumber }}</td>
                                            <td>{{ item.vendorName }}</td>
                                            <td>{{ item.vendorDescription }}</td>
                                            <td>{{ item.brand }}</td>
                                            <td>{{ item.height }}</td>
                                            <td>{{ item.width }}</td>
                                            <td>{{ item.depth }}</td>
                                            <td>{{ item.tray_Height }}</td>
                                            <td>{{ item.tray_Width }}</td>
                                            <td>{{ item.tray_Depth }}</td>
                                            <td>{{ item.case_Height }}</td>
                                            <td>{{ item.case_Width }}</td>
                                            <td>{{ item.case_Depth }}</td>
                                            <td>{{ item.shrink_Height }}</td>
                                            <td>{{ item.shrink_Width }}</td>
                                            <td>{{ item.shrink_Depth }}</td>
                                            <td>{{ item.pallet_Height }}</td>
                                            <td>{{ item.pallet_Width }}</td>
                                            <td>{{ item.pallet_Depth }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </v-card>
                        </div>
                    </v-card-text>
                </v-card>
                <v-snackbar v-model="snackbar" bottom :timeout="snackbarTimeout">
                    <div style="text-align: center; width: 100%;">
                        {{ snackbarText }}
                    </div>
                </v-snackbar>
            </v-dialog>
        </v-layout>
        <Prompt ref="prompt"></Prompt>
        <NewItemListingSelector ref="newItemListingSelector"></NewItemListingSelector>
        <YesNoModal ref="yesNo"></YesNoModal>
    </div>
</template>

<script>
    import Axios from 'axios';

    import Standard from '@/components/Apps/RangePlanning/ProductListing/Sections/Standard'
    import Vendor from '@/components/Apps/RangePlanning/ProductListing/Sections/Vendor'
    import Hierachy from '@/components/Apps/RangePlanning/ProductListing/Sections/Hierachy'
    import ItemStatus from '@/components/Apps/RangePlanning/ProductListing/Sections/ItemStatus'
    import ImagesAndDimensions from '@/components/Apps/RangePlanning/ProductListing/Sections/ImagesAndDimensions/Index'
    import SupportingDocuments from '@/components/Apps/RangePlanning/ProductListing/Sections/SupportingDocuments'
    import Resources from '@/components/Apps/RangePlanning/ProductListing/Sections/Resources'
    import StockControl from '@/components/Apps/RangePlanning/ProductListing/Sections/StockControl'
    import PriceAndMargin from '@/components/Apps/RangePlanning/ProductListing/Sections/PriceAndMargin'
    import OpeningOrders from '@/components/Apps/RangePlanning/ProductListing/Sections/OpeningOrders'

    import Prompt from '@/components/Common/Prompt';
    import NewItemListingSelector from '@/components/Common/NewItemListingSelector'
    import YesNoModal from '@/components/Common/YesNoModal'

    const tabs = ['Standard', 'Vendor', 'Hierachy', 'Item Status', 'Images', 'Supporting Documents', 'Resources',
        'Stock Control', 'Price and Margin', 'Opening Orders'
    ];

    export default {
        name: 'product-listing',
        components: {
            Standard,
            Vendor,
            Hierachy,
            ItemStatus,
            ImagesAndDimensions,
            SupportingDocuments,
            Resources,
            StockControl,
            PriceAndMargin,
            OpeningOrders,
            Prompt,
            NewItemListingSelector,
            YesNoModal
        },
        data() {
            return {
                isAdd: true,
                dialog: false,
                tabs: tabs,
                active: null,
                currentFileName: '',
                items: [],
                indexIncrement: 0,
                overview: false,
                clipBoardItem: null,
                snackbar: false,
                snackbarTimeout: 0,
                snackbarText: null,
                manufacturerDetails: [],
                manufacturers: [],
                brandDetails: [],
                brands: [],
                planogramDetails: [],
                planograms: [],
                categoryLinkDetails: [],
                categoryLinks: [],
                subcategoryDetails: [],
                subcategories: [],
                segmentDetails: [],
                segments: [],
                activeShopCodeDetails: [],
                activeShopCodes: [],
                itemStatusDetails: [],
                itemStatuses: []
            }
        },
        computed: {
            canPaste() {
                return this.clipBoardItem == null;
            }
        },
        created() {
            let self = this;
            self.getData();
        },
        methods: {
            show() {
                let self = this;
                self.dialog = true;
            },
            close() {
                let self = this;
                self.dialog = false;
            },
            newLine() {
                let self = this;
                self.items.push({
                    index: self.indexIncrement,
                    manufacturer_Code: '',
                    consignmentOrFixed: "Consignment",
                    replacementOrNewProduct: "New Product",
                    taxCode: "VE",
                    category_Code: '',
                    department: '',
                    subdepartment: ''
                })

                self.indexIncrement++;
            },
            openFile() {
                let self = this;

                self.$refs.newItemListingSelector.show((fileID, item) => {
                    Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
                        .then(r => {
                            self.isAdd = false;
                            self.currentFileName = item.name;
                            self.items = r.data;
                        })
                })
            },
            closeFile() {
                let self = this;
                self.isAdd = true;
                self.items = [];
            },
            duplicate(item) {
                let self = this;
                self.items.push(JSON.parse(JSON.stringify(item)));
            },
            remove(item) {
                let self = this;
                self.items.splice(self.items.indexOf(item), 1);
            },
            copy(item) {
                let self = this;
                self.clipBoardItem = item;
                self.showSnackbar("Line Copied", 2000)
            },
            paste(item) {
                let self = this;

                for (var prop in self.clipBoardItem) {
                    if (prop != "index") {
                        item[prop] = self.clipBoardItem[prop];
                    }
                }

                self.showSnackbar("Line Replaced", 2000)
            },
            showSnackbar(snackbarText, timeout) {
                let self = this;
                self.snackbarTimeout = timeout;
                self.snackbarText = snackbarText;
                self.snackbar = true;
            },
            prompt() {
                let self = this;

                if (self.isAdd) {
                    self.$refs.prompt.show("", "Save file as", 'File name', fileName => {
                        Axios.post(process.env.VUE_APP_API + "SystemFile/Exists?db=CR-Devinspire", {
                            SystemFile: {
                                SystemUser_ID: -1,
                                Folder: "New Item Listing",
                                Name: fileName,
                                Extension: '.json'
                            }
                        }).then(r => {
                            if (r.data == true) {
                                self.$refs.yesNo.show(
                                    'File already Exists, Would you like to overwrite it?',
                                    goThrough => {
                                        if (goThrough) {
                                            self.save(fileName);
                                        }
                                    })
                            } else {
                                self.save(fileName);
                            }
                        })
                    })
                } else {
                    self.save(self.currentFileName);
                }
            },
            save(name) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "New Item Listing",
                            Name: name,
                            Extension: '.json'
                        },
                        Data: self.items
                    })
                    .then(r => {
                        alert("Saved!");
                        console.log(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            getData() {
                let self = this;
                self.getManufacturers();
                self.getBrands();
                self.getPlanograms();
                self.getCategoryLinks();
                self.getSubcategories();
                self.getSegments();
                self.getActiveShopCodes();
                self.getItemStatuses();
            },
            setItemsData(idx, property, value) {
                let self = this;
                self.$nextTick(() => {
                    self.items[idx][property] = value;
                })
            },
            getManufacturers() {
                let self = this;

                self.manufacturers = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Manufacturer")
                    .then(r => {

                        self.manufacturerDetails = r.data;

                        r.data.forEach(element => {
                            self.manufacturers.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getManufacturerDetailsByID(id, callback) {
                let self = this;
                let retval = null;

                self.manufacturerDetails.forEach(el => {
                    if (el.id == id)
                        retval = el;
                })

                callback(retval);
            },
            getCategoryDetailsByID(id, callback) {
                let self = this;
                let retval = null;

                self.categoryLinkDetails.forEach(el => {
                    if (el.id == id)
                        retval = el;
                })

                callback(retval);
            },
            getBrands() {
                let self = this;

                self.brands = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Brand")
                    .then(r => {

                        self.brandDetails = r.data;

                        r.data.forEach(element => {
                            self.brands.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getPlanograms() {
                let self = this;

                self.planograms = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Planogram")
                    .then(r => {

                        self.planogramDetails = r.data.planogramList;

                        r.data.planogramList.forEach(element => {
                            self.planograms.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getCategoryLinks() {
                let self = this;

                self.categoryLinks = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Category_Link")
                    .then(r => {

                        self.categoryLinkDetails = r.data;

                        r.data.forEach(element => {
                            self.categoryLinks.push({
                                text: element.displayName,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getSubcategories() {
                let self = this;

                self.subcategories = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Subcategory")
                    .then(r => {

                        self.subcategoryDetails = r.data;

                        r.data.forEach(element => {
                            self.subcategories.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getSegments() {
                let self = this;

                self.segments = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Subcategory")
                    .then(r => {

                        self.segmentDetails = r.data;

                        r.data.forEach(element => {
                            self.segments.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getActiveShopCodes() {
                let self = this;

                self.activeShopCodes = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Active_Shop_Code")
                    .then(r => {

                        self.activeShopCodeDetails = r.data;

                        r.data.forEach(element => {
                            self.activeShopCodes.push({
                                text: element.displayName,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getItemStatuses() {
                let self = this;

                self.itemStatuses = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Item_Status")
                    .then(r => {

                        self.itemStatusDetails = r.data;

                        r.data.forEach(element => {
                            self.itemStatuses.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
    }

    table,
    th,
    td {
        border: 1px solid black;
    }
</style>