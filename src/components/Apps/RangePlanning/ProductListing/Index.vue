<template dark>
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
                        <v-list-tile :disabled="file_type == null" @click="prompt">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile :disabled="file_type == null" @click="closeFile">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu :disabled="file_type == null" dark offset-y style="margin-bottom: 10px;">
                    <v-btn :disabled="file_type == null" slot="activator" flat>
                        View
                    </v-btn>
                    <v-list light dense style="height: 500px; overflow-x: auto;">
                        <template v-for="(item, idx) in columnDefs">
                            <v-list-tile @click="hideShow(item.headerName)" v-if="item.children != undefined"
                                :key="idx">
                                <v-list-tile-title>{{ item.headerName }}</v-list-tile-title>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Settings
                    </v-btn>
                    <v-list light dense>
                        <v-list-tile @click="configOpen()" :class="{ 'pulse': rowData.length == 0 }"
                            color="blue-grey darken-4">Configuration
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
            <h3>{{ currentFileName == "" ? "" : currentFileName + ' - ' }} {{ file_type }}</h3>
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
            :columnDefs="columnDefs" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady"
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
                                <v-hover>
                                    <v-card @click="set_file_type(file_type.title)" style="cursor: pointer;"
                                        color="primary" dark class="elevation-3" slot-scope="{ hover }"
                                        :class="`elevation-${hover ? 12 : 2}`">
                                        <v-card-title>
                                            <div style="text-align: center; width: 100%;">{{ file_type.title }}</div>
                                        </v-card-title>
                                        <v-card-text class="pt-0" style="text-align: center;">
                                            <v-icon>{{ file_type.icon }}</v-icon>
                                        </v-card-text>
                                    </v-card>
                                </v-hover>
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
        <NewProductValidator ref="NewProductValidator"></NewProductValidator>
        <Configuration ref="config"></Configuration>
    </div>
</template>

<script>
    import Axios from 'axios';

    import {
        AgGridVue
    } from "ag-grid-vue";

    import Prompt from '@/components/Common/Prompt';
    import ProductLookup from '@/components/Common/ProductLookup';
    import NewProductValidator from '@/components/Common/NewProductValidator';
    import NewItemListingSelector from '@/components/Common/NewItemListingSelector';
    import YesNoModal from '@/components/Common/YesNoModal';
    import ImageView from "./GridComponents/Image.vue";
    import Button from "./GridComponents/button.vue";
    import OptionSelector from "./GridComponents/OptionSelector.vue";
    import PeriodItem from "./GridComponents/PeriodItem.vue";
    import DateSelector from "./GridComponents/DateSelector.vue";
    import Validator from "./GridComponents/Validator.vue";
    import YesNoSelector from "./GridComponents/YesNoSelector.vue";
    import DescriptionLength from "./GridComponents/DescriptionLength.vue";
    import Selector from "./GridComponents/Selector.vue";
    import ConsignmentSelector from "./GridComponents/ConsignmentSelector.vue";
    import Configuration from "./GridComponents/ConfigurationsComponent/Configuration.vue";
    import ResourceSelector from "./GridComponents/ResourceSelector";

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
            ProductLookup,
            NewProductValidator,
            YesNoSelector,
            DescriptionLength,
            Selector,
            ConsignmentSelector,
            Configuration,
            ResourceSelector
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
                supplierLinkDetails: [],
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
                        title: 'Promotion',
                        icon: 'grade',
                        file_type: 'PROMOTE_ITEM'
                    }
                ],
                consignment: [{
                        text: "Consignment",
                        value: true
                    },
                    {
                        text: "Fixed",
                        value: false
                    }
                ],
                suppliers: [],
                category_CodeDetails: [],
                categoryCode: [],
                resources: [],
                retail_buyers: [],
                retail_stock_planners: [],
                buyer_assistants: [],
                order_clerks: []
            }
        },
        computed: {
            canPaste() {
                return this.clipBoardItem == null;
            }
        },
        beforeMount() {
            let self = this;
        },
        created() {
            let self = this;
            setTimeout(() => {
                self.getData();
            }, 2000);
        },
        methods: {
            redrawAllRows() {
                let self = this;
                this.gridApi.redrawRows();
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            onRowEditingStarted(e) {
                if (!e.data.can_edit)
                    this.gridApi.stopEditing();

                if (!e.data.can_edit_supplier_code && e.colDef.field == 'supplier_Code')
                    this.gridApi.stopEditing();
            },
            onCellValueChanged(e) {},
            set_file_type(file_type) {
                let self = this;
                self.file_type = file_type;

                let tmpHeaders = require('./Headers/' + self.file_type);
                let formattedHeaders = self.set_selects(tmpHeaders);
                self.columnDefs = formattedHeaders;

                self.file_type_dialog = false;
            },
            set_selects(headers) {
                let self = this;

                headers.forEach(header => {
                    if (header.children != undefined) {
                        header.children.forEach(child => {
                            if (child.needsSelect) {
                                child.cellEditor = "agRichSelectCellEditor",
                                    child.cellEditorParams = {};
                                child.cellEditorParams.values = self.brands;
                            }
                        })
                    }
                })

                return headers;
            },
            show() {
                let self = this;
                self.dialog = true;

                self.gridOptions = {
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
            configOpen() {
                let self = this;
                self.$refs.config.show()
            },
            newLineAdd() {
                let self = this;

                self.$refs.NewProductValidator.show(data => {
                    self.rowData.push({
                        product_System_ID: data.product_System_ID,
                        barcode: data.barcode,
                        description: data.description,
                        can_edit: true,
                        vendor_Description: data.description,
                        final_Description: data.description,
                        description_Length: data.description.length,
                        brand: null,
                        supplier: null,
                        supplier_Code: "",
                        consignment: "FIXED",
                        vendor_Brand: "",
                        category_Code: "",
                        can_edit_supplier_code: true
                    })
                });

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

                self.$refs.newItemListingSelector.show((fileID, item, type) => {
                    self.isAdd = false;
                    self.currentFileName = item.name;

                    self.set_file_type(type)

                    Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
                        .then(r => {
                            setTimeout(() => {
                                self.gridApi.resetRowHeights();
                                self.gridApi.sizeColumnsToFit()
                            }, 60);

                            self.rowData = r.data;
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
                    if (cd.children != undefined) {
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
                            Extension: '.json',
                            Type: self.file_type
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
                self.getSuppliers();
                self.getPlanograms();
                self.getCategoryLinks();
                self.getSubcategories();
                self.getSegments();
                self.getActiveShopCodes();
                self.getItemStatuses();
                self.getResources();
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
            getCategoryDetailsByID(name) {
                let self = this;
                let retval = null;

                self.categoryLinkDetails.forEach(el => {
                    if (el.displayName == name)
                        retval = el;
                })
                return retval;
            },
            getSupplierByID(name) {
                let self = this;
                let retval = null;

                self.supplierLinkDetails.forEach(el => {

                    if (el.displayname == name)
                        retval = el;
                })

                return retval;
            },
            getResources() {
                let self = this;


                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Event_Sheet_Resource`)
                    .then(r => {
                        self.resources = r.data.event_Sheet_Resources;


                        self.resources.forEach(resource => {
                            switch (resource.resourceType) {
                                case 0: {
                                    self.retail_buyers.push(resource.firstname + " " + resource.lastname)
                                }
                                break;
                            case 1: {
                                self.retail_stock_planners.push(resource.firstname + " " + resource
                                    .lastname)
                            }
                            break;
                            case 2: {
                                self.buyer_assistants.push(resource.firstname + " " + resource.lastname)
                            }
                            break;
                            case 3: {
                                self.order_clerks.push(resource.firstname + " " + resource.lastname)
                            }
                            break;
                            }
                        });

                        console.log("This is resources", r.data.event_Sheet_Resources);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getBrands() {
                let self = this;

                self.brands = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Brand")
                    .then(r => {
                        self.brands = [];
                        r.data.forEach(brand => {
                            self.brands.push(brand.displayname)
                        })
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getSuppliers() {
                let self = this;

                self.suppliers = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Supplier")
                    .then(r => {
                        self.supplierLinkDetails = r.data;

                        r.data.forEach(el => {
                            self.suppliers.push(el.displayname)
                        })
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

                        r.data.forEach(el => {
                            self.categoryLinks.push(el.displayName)
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