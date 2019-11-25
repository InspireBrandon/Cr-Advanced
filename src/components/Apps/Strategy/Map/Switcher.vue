<template>
    <div>
        <v-toolbar color="grey darken-3" dense flat dark>
            <v-menu dark offset-y v-if="!viewOnlyMode">
                <v-btn slot="activator" flat>Setup</v-btn>
                <v-list>
                    <v-list-tile @click="openRetailerModal()">
                        <v-list-tile-title>Locations</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="linkRetailerStore()">
                        <v-list-tile-title>Link Retailer Stores</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="openRetailerSupplierStorDialog()">
                        <v-list-tile-title>Link Supplier Stores</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-menu v-if="!viewOnlyMode" dark offset-y>
                <v-btn slot="activator" flat>Image</v-btn>
                <v-list>
                    <v-list-tile @click="mapImageAdd()">
                        <v-list-tile-title>Add</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showSelector()">
                        <v-list-tile-title>Manage</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-btn v-if="!viewOnlyMode" flat @click="openImport">Import</v-btn>

            <v-spacer></v-spacer>
            <v-toolbar-title>Maps</v-toolbar-title>
        </v-toolbar>
      
                <Research ref="Research" />
        <RetailerImportModal ref="RetailerImportModal" />
        <LinkRetailerStore ref="LinkRetailerStore" />
        <MapComponent ref="MapComponent" />
        <MapImageSelector ref="MapImageSelector" />
        <RetailerSupplierStoreDialog ref="RetailerSupplierStoreDialog" />
        <MapImageAdd ref="MapImageAdd" />
    </div>
</template>
<script>
    import Research from "../Research/Index";
    import LinkStores from "../Research/LinkStores";
    import RetailerImportModal from "../Main/RetailerImportModal";
    import LinkRetailerStore from "../Main/LinkRetailerStores/Index";
    import RetailerSupplierStoreDialog from "../Research/RetailerSupplierStore/RetailerSupplier";
    import MapImageSelector from "./MapImageSelector";
    import MapImageAdd from "../Main/MapImageModal"

    import MapComponent from "./Index";
    export default {
        components: {
            MapComponent,
            Research,
            LinkStores,
            RetailerImportModal,
            LinkRetailerStore,
            RetailerSupplierStoreDialog,
            MapImageSelector,
            MapImageAdd
        },
        data() {
            return {
                importDialog: false,
                showItem: 0,
                dialogHeader: "",
                viewOnlyMode: false
            };
        },
        mounted() {
            let self = this
            if (self.$route.params.params != null) {
                self.viewOnlyMode = true
            } else {
                self.viewOnlyMode = false
            }
        },
        methods: {
            openImport(){
                let self = this 
                self.$refs.Research.open()
            },
            openRetailerModal() {
                let self = this;
                self.$refs.RetailerImportModal.open(callback => {});
            },
            mapImageSelector() {
                let self = this;
                self.$refs.MapImageSelector.show(callback => {});
            },
            mapImageAdd() {
                let self = this;
                self.$refs.MapImageAdd.open(true, null, callback => {});
            },
            openRetailerSupplierStorDialog() {
                let self = this;

                self.$refs.RetailerSupplierStoreDialog.show();
            },

            linkRetailerStore() {
                let self = this;
                self.$refs.LinkRetailerStore.show(() => {});
            },
            showSelector() {
                let self = this;
                self.$refs.MapImageSelector.show(callback => {
                    console.log(callback);

                    self.openMapImageModal(false, callback, anything => {})
                    // self.selectedmap=callback.id
                    // self.onMapChange()
                })
            },
            openMapImageModal(type, item) {
                let self = this
                self.$refs.MapImageAdd.open(type, item, callback => {

                })
            },
        }
    };
</script>




<!-- 
        Old Code !!!!
        <v-toolbar  dense dark flat color="grey darken-2">
            <v-toolbar-title>
                Market Share
            </v-toolbar-title>
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                     
                        <v-list-tile>
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-spacer></v-spacer>

            </v-toolbar-items>

            <v-spacer></v-spacer>
          
        </v-toolbar>
        <v-tabs class="elevation-0" centered dark fixed-tabs justify-content: center>
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab href="#tab-1" justify-content: center>
                Map
            </v-tab>
            <v-tab href="#tab-2" justify-content: center>
                Import
            </v-tab>
            <v-tab href="#tab-3" justify-content: center>
                Link Stores
            </v-tab>

            <v-tab-item id="tab-1" class="elevation-2" justify-content: center>
                <MapComponent ref="MapComponent" />
            </v-tab-item>
            <v-tab-item id="tab-2" class="elevation-2" justify-content: center>
                <Research ref="Research" />
            </v-tab-item>
            <v-tab-item id="tab-3" class="elevation-2" justify-content: center>
                <LinkStores ref="LinkStores" />
            </v-tab-item>
        </v-tabs> -->