<template>
    <div>
        <v-toolbar dark dense flat>
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list light dense>
                        <v-list-tile @click="file_type_dialog = true">
                            <v-list-tile-title>New</v-list-tile-title>
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
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        View
                    </v-btn>
                    <v-list light dense>
                        <v-list-tile @click="hideShow('Standard')">
                            <v-list-tile-title>Standard</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Vendor')">
                            <v-list-tile-title>Vendor</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Hierarchy')">
                            <v-list-tile-title>Hierarchy</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Item Status')">
                            <v-list-tile-title>Item Status</v-list-tile-title>
                        </v-list-tile>
                        <v-list dense>
                            <v-menu offset-x right open-on-hover>
                                <v-list-tile style="width: 100%" slot="activator">
                                    <v-list-tile-title>Change Image</v-list-tile-title>
                                    <v-spacer></v-spacer>
                                    <v-list-tile-action class="justify-end">
                                        <v-icon>play_arrow</v-icon>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-list dense>
                                    <v-list-tile @click="hideShow('Unit')">
                                        <v-list-tile-title>Unit</v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile @click="hideShow('Tray')">
                                        <v-list-tile-title>Tray</v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile @click="hideShow('Shrink')">
                                        <v-list-tile-title>Shrink</v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile @click="hideShow('Case')">
                                        <v-list-tile-title>Case</v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile @click="hideShow('Pallet')">
                                        <v-list-tile-title>Pallet</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-list>
                        <v-list-tile @click="hideShow('Supporting Documents')">
                            <v-list-tile-title>Supporting Documents</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Resources')">
                            <v-list-tile-title>Resources</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Stock Control')">
                            <v-list-tile-title>Stock Control</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Price And Margin')">
                            <v-list-tile-title>Price And Margin</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Opening Orders')">
                            <v-list-tile-title>Opening Orders</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="hideShow('Evaluation')">
                            <v-list-tile-title>Evaluation</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn :class="{ 'pulse': rowData.length == 0 }" @click="newLineAdd()"
                    v-if="file_type != null && file_type == 'Add Item'" color="success" slot="activator">Add new line
                </v-btn>
                <v-btn :class="{ 'pulse': rowData.length == 0 }" @click="newLineChange()"
                    v-if="file_type != null && file_type == 'Change Item'" color="success" slot="activator">Add new line
                </v-btn>
            </v-toolbar-items>
            <v-spacer />
            <h3>{{ file_type }}</h3>
            <v-spacer />
            <v-progress-circular v-if="showLoader" indeterminate color="primary"></v-progress-circular>
            <span>{{ successText }}</span>
            <span style="color: red;">{{ errorText }}</span>
        </v-toolbar>
        <v-card v-if="file_type == null">
            <v-card-text>
                select a file template to get started <a @click.prevent="file_type_dialog = true" href="#">click
                    here</a>
            </v-card-text>
        </v-card>
        <ag-grid-vue v-if="file_type != null" :gridOptions="gridOptions"
            style="width: 100%;  height: calc(100vh - 113px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="columnDefs" :selectionChanged="onSelectionChanged" :rowData="rowData" :enableSorting="true"
            :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :gridReady="onGridReady"
            :groupMultiAutoColumn="true" :cellEditingStarted="onRowEditingStarted">
        </ag-grid-vue>
        <v-snackbar v-model="snackbar" bottom :timeout="snackbarTimeout">
            <div style="text-align: center; width: 100%;">
                {{ snackbarText }}
            </div>
        </v-snackbar>
        <!-- FILE TYPE DIALOG -->
        <v-dialog v-model="file_type_dialog" persistent width="500">
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>File templates</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pt-0">
                    <v-container fluid grid-list-xl>
                        <v-layout row wrap>
                            <v-flex md12><span class="font-weight-light">Please select a file type:</span></v-flex>
                            <v-flex md4 v-for="file_type in file_types" :key="file_type.title">
                                <v-card @click="set_file_type(file_type.title)" style="cursor: pointer;" color="primary"
                                    dark class="elevation-3">
                                    <v-card-title>
                                        <div style="text-align: center; width: 100%;">{{ file_type.title }}</div>
                                    </v-card-title>
                                    <v-card-text class="pt-0" style="text-align: center;">
                                        <v-icon>{{ file_type.icon }}</v-icon>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat @click="file_type_dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- END FILE TYPE DIALOG -->
        <Prompt ref="prompt"></Prompt>
        <NewItemListingSelector ref="newItemListingSelector"></NewItemListingSelector>
        <YesNoModal ref="yesNo"></YesNoModal>
        <ProductLookup ref="ProductLookup"></ProductLookup>
    </div>
</template>

<script>
    import Axios from 'axios';

    import {
        AgGridVue
    } from "ag-grid-vue";

    import Prompt from '@/components/Common/Prompt';
    import ProductLookup from '@/components/Common/ProductLookup';
    import NewItemListingSelector from '@/components/Common/NewItemListingSelector'
    import YesNoModal from '@/components/Common/YesNoModal'
    import ImageView from "./GridComponents/Image.vue"
    import Button from "./GridComponents/button.vue"
    import OptionSelector from "./GridComponents/OptionSelector.vue"
    import PeriodItem from "./GridComponents/PeriodItem.vue"
    import DateSelector from "./GridComponents/DateSelector.vue"
    import Validator from "./GridComponents/Validator.vue"

    const tabs = ['Standard', 'Vendor', 'Hierachy', 'Item Status', 'Images', 'Supporting Documents', 'Resources',
        'Stock Control', 'Price and Margin', 'Opening Orders'
    ];

    export default {
        name: 'product-listing',
        components: {
            Prompt,
            NewItemListingSelector,
            YesNoModal,
            ImageView,
            AgGridVue,
            Button,
            OptionSelector,
            PeriodItem,
            DateSelector,
            Validator,
            ProductLookup
        },
        data() {
            return {
                file_type_dialog: false,
                currentFileType: null,
                isAdd: true,
                dialog: false,
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
                itemStatuses: [],
                columnDefs: [],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    }
                },
                showLoader: false,
                successText: "",
                errorText: "",
                file_type: null,
                file_types: [{
                        title: 'Add Item',
                        icon: 'add',
                        file_type: 'ADD_ITEM'
                    },
                    {
                        title: 'Change Item',
                        icon: 'edit',
                        file_type: 'CHANGE_ITEM'
                    },
                    {
                        title: 'Delist Item',
                        icon: 'delete',
                        file_type: 'DELIST_ITEM'
                    },
                    {
                        title: 'Promote Item',
                        icon: 'grade',
                        file_type: 'PROMOTE_ITEM'
                    }
                ]
            }
        },
        computed: {
            canPaste() {
                return this.clipBoardItem == null;
            }
        },
        beforeMount() {
            let self = this;
            self.columnDefs = require('./headers.json');
        },
        created() {
            let self = this;
            setTimeout(() => {
                self.setColumnDefs();
                self.getData();
            }, 2000);
        },
        methods: {
            setColumnDefs() {},
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
            },
            onSelectionChanged() {

            },
            onRowEditingStarted(e) {
                if (!e.data.can_edit)
                    this.gridApi.stopEditing();
            },
            onCellValueChanged(e) {},
            set_file_type(file_type) {
                let self = this;
                self.file_type = file_type;
                self.file_type_dialog = false;
            },
            show() {
                let self = this;
                self.dialog = true;

                self.gridOptions = {
                    rowHeight: 30,
                    context: {
                        componentParent: self
                    }
                };
            },
            close() {
                let self = this;
                self.dialog = false;
                self.file_type = null;
            },
            newLineAdd() {
                let self = this;
                self.rowData.push({})

                setTimeout(() => {
                    self.gridApi.resetRowHeights();
                    self.gridApi.sizeColumnsToFit()
                }, 60);
            },
            newLineChange() {
                let self = this;

                self.$refs.ProductLookup.show(product_data => {
                    self.getProductByID(product_data.id)
                        .then(product => {
                            let tmp1 = JSON.parse(JSON.stringify(product));
                            tmp1.can_edit = false;
                            self.rowData.push(tmp1);
                            let tmp2 = JSON.parse(JSON.stringify(tmp1));
                            tmp2.can_edit = true;
                            self.rowData.push(tmp2);
                        })
                });
            },
            getProductByID(id) {
                let self = this;

                return new Promise((res, rej) => {
                    Axios.get(process.env.VUE_APP_API + `Product/${id}?db=CR-HINTERLAND-LIVE`)
                        .then(r => {
                            res(r.data);
                        })
                        .catch(e => {
                            rej();
                        })
                })
            },
            openFile() {
                let self = this;

                self.$refs.newItemListingSelector.show((fileID, item) => {
                    Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
                        .then(r => {
                            self.isAdd = false;
                            self.currentFileName = item.name;
                            self.rowData = r.data;

                            setTimeout(() => {
                                self.gridApi.resetRowHeights();
                                self.gridApi.sizeColumnsToFit()
                            }, 60);
                        })
                })
            },
            closeFile() {
                let self = this;
                self.isAdd = true;
                self.rowData = [];
                self.file_type = null;
            },
            hideShow(headerGroup) {
                let self = this;

                let tmp = JSON.parse(JSON.stringify(self.columnDefs));

                tmp.forEach(cd => {
                    if (cd.headerName == "Product System ID" || cd.headerName == "Barcode" || cd.headerName ==
                        "Description" || cd.headerName == "" || cd.headerName == "Type") {} else {
                        if (cd.headerName == headerGroup) {
                            cd.children.forEach(ce => {
                                ce.hide = false;
                            })
                        } else {
                            cd.children.forEach(ce => {
                                ce.hide = true;
                            })
                        }
                    }
                })

                self.columnDefs = [];
                self.columnDefs = tmp;

                setTimeout(() => {
                    self.gridApi.resetRowHeights();
                    self.gridApi.sizeColumnsToFit()
                }, 60);
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

                let finalArr = [];

                self.gridApi.forEachNode(node => {
                    finalArr.push(node.data);
                })

                self.showLoader = true;

                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "New Item Listing",
                            Name: name,
                            Extension: '.json'
                        },
                        Data: finalArr
                    })
                    .then(r => {
                        setTimeout(() => {
                            self.showLoader = false;
                            self.successText = "Successfully saved";
                            setTimeout(() => {
                                self.successText = "";
                            }, 2000);
                        }, 1000);
                    })
                    .catch(e => {
                        self.showLoader = false;
                        self.errorText = "Failed to save";
                        setTimeout(() => {
                            self.errorText = "";
                        }, 2000);
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

<style>
    .active-tab {
        background: #131313 !important;
    }

    .disabled-line {
        background: green;
    }

    .pulse {
        animation: pulse 2s infinite;
    }

    .pulse:hover {
        animation: none;
    }

    @-webkit-keyframes pulse {
        0% {
            -webkit-box-shadow: 0 0 0 0 rgba(76, 204, 44, 0.637);
        }

        70% {
            -webkit-box-shadow: 0 0 0 0 rgba(76, 204, 44, 0.637);
        }

        100% {
            -webkit-box-shadow: 0 0 0 0 rgba(76, 204, 44, 0.637);
        }
    }

    @keyframes pulse {
        0% {
            -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0.4);
            box-shadow: 0 0 0 0 rgba(204, 169, 44, 0.4);
        }

        70% {
            -moz-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
            box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
        }

        100% {
            -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
            box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
        }
    }
</style>


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