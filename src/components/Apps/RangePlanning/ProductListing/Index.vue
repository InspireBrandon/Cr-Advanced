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
                    <v-card-text>
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
                                            <v-list-tile @click="save">
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

                            <v-tabs v-show="!overview" v-model="active" grow dark slider-color="primary">
                                <v-tab ripple v-for="(tab, idx) in tabs" :key="idx">{{ tab }}</v-tab>
                                <!-- Standard -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Standard :canPaste="canPaste" :copy="copy" :paste="paste" :remove="remove"
                                            :duplicate="duplicate" :items="items" ref="Standard">
                                        </Standard>
                                    </v-card>
                                </v-tab-item>
                                <!-- Vendor -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Vendor :canPaste="canPaste" :copy="copy" :paste="paste" :remove="remove"
                                            :duplicate="duplicate" :items="items" ref="Vendor">
                                        </Vendor>
                                    </v-card>
                                </v-tab-item>
                                <!-- Hierachy -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Hierachy :canPaste="canPaste" :copy="copy" :paste="paste" :remove="remove"
                                            :duplicate="duplicate" :items="items" ref="Hierachy">
                                        </Hierachy>
                                    </v-card>
                                </v-tab-item>
                                <!-- Item Status -->
                                <v-tab-item>
                                    <v-card flat>
                                        <ItemStatus :canPaste="canPaste" :copy="copy" :paste="paste" :remove="remove"
                                            :duplicate="duplicate" :items="items" ref="ItemStatus">
                                        </ItemStatus>
                                    </v-card>
                                </v-tab-item>
                                <!-- Images -->
                                <v-tab-item>
                                    <v-card flat>
                                        <ImagesAndDimensions :canPaste="canPaste" :copy="copy" :paste="paste"
                                            :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="ImagesAndDimensions">
                                        </ImagesAndDimensions>
                                    </v-card>
                                </v-tab-item>
                                <!-- Supporting Documents -->
                                <v-tab-item>
                                    <v-card flat>
                                        <SupportingDocuments :canPaste="canPaste" :copy="copy" :paste="paste"
                                            :remove="remove" :duplicate="duplicate" :items="items"
                                            ref="SupportingDocuments">
                                        </SupportingDocuments>
                                    </v-card>
                                </v-tab-item>
                                <!-- Resources -->
                                <v-tab-item>
                                    <v-card flat>
                                        <Resources :canPaste="canPaste" :copy="copy" :paste="paste" :remove="remove"
                                            :duplicate="duplicate" :items="items" ref="Resources">
                                        </Resources>
                                    </v-card>
                                </v-tab-item>
                                <!-- Stock Control -->
                                <v-tab-item>
                                    <v-card flat>
                                        <StockControl :canPaste="canPaste" :copy="copy" :paste="paste" :remove="remove"
                                            :duplicate="duplicate" :items="items" ref="StockControl">
                                        </StockControl>
                                    </v-card>
                                </v-tab-item>
                                <!-- Price And Margin -->
                                <v-tab-item>
                                    <v-card flat>
                                        <PriceAndMargin :canPaste="canPaste" :copy="copy" :paste="paste"
                                            :remove="remove" :duplicate="duplicate" :items="items" ref="PriceAndMargin">
                                        </PriceAndMargin>
                                    </v-card>
                                </v-tab-item>
                                <!-- Opening Orders -->
                                <v-tab-item>
                                    <v-card flat>
                                        <OpeningOrders :canPaste="canPaste" :copy="copy" :paste="paste"
                                            :remove="remove" :duplicate="duplicate" :items="items" ref="OpeningOrders">
                                        </OpeningOrders>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs>

                            <v-card flat v-show="overview">
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
    </div>
</template>

<script>
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
    // TODO ADD LISTING
    import Agreements from '@/components/Apps/RangePlanning/ProductListing/Sections/Agreements'

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
            Agreements,
            SupportingDocuments,
            Resources,
            StockControl,
            PriceAndMargin,
            OpeningOrders
        },
        data() {
            return {
                dialog: true,
                tabs: tabs,
                active: null,
                items: [],
                overview: false,
                clipBoardItem: null,
                snackbar: false,
                snackbarTimeout: 0,
                snackbarText: null
            }
        },
        computed: {
            canPaste() {
                return this.clipBoardItem == null;
            }
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
                    threeDimensionalImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                    frontImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                    sideImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                    topImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                    consignmentOrFixed: "Consignment",
                    replacementOrNewProduct: "New Product",
                    taxCode: "VE"
                })
            },
            openFile() {
                let self = this;
                self.items = [];

                for (var i = 1; i < 6; i++) {
                    self.items.push({
                        threeDimensionalImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                        frontImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                        sideImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                        topImage: 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png',
                        consignmentOrFixed: "Consignment",
                        replacementOrNewProduct: "New Product",
                        taxCode: "VE"
                    })
                }
            },
            closeFile() {
                let self = this;
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
            save() {
                let self = this;
                console.log(self.items)
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