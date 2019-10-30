<template>
    <div>
        <v-toolbar color='grey darken-3' dense flat dark>
            <v-menu dark offset-y>
                <v-btn slot="activator" flat>
                    Setup
                </v-btn>
                <v-list>
                    <v-list-tile @click="sharedDialog(1)">
                        <v-list-tile-title>Locations</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="sharedDialog(2)">
                        <v-list-tile-title>Link Retailer Stores</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="getHinterlandStores">
                        <v-list-tile-title>Link Supplier</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-menu dark offset-y>
                <v-btn slot="activator" flat>
                    Image
                </v-btn>
                <v-list>
                    <v-list-tile @click="saveFile">
                        <v-list-tile-title>Add</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="openFile">
                        <v-list-tile-title>Manage</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-spacer></v-spacer>
            <v-toolbar-title>Maps</v-toolbar-title>
        </v-toolbar>
        <v-dialog v-model="dialog" >
            <v-card>
                <v-toolbar dark color="primary">

                    <v-toolbar-title>{{dialogHeader}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card>
            <Research style="overflow: hidden; scroll:no" v-if='showItem == 1' ref="Research" />
            <LinkStores v-if='showItem == 2' ref="LinkStores" />
        </v-dialog>
        <MapComponent ref="MapComponent" />
    </div>

</template>
<script>
    import Research from '../Research/Index'
    import LinkStores from "../Research/LinkStores" 

    import MapComponent from "./Index"
    export default {
        components: {
            MapComponent,
            Research,
            LinkStores
        },
        data() {
            return {
                dialog: false,
                showItem: 0,
                dialogHeader: ''
            }

        },
        methods: {
            sharedDialog(item) {
                let self = this
                if (item == 1) {
                    self.showItem = 1;
                    self.dialog = true;
                    self.dialogHeader = 'Locations';
                }
                if (item == 2) {
                    self.showItem = 2;
                    self.dialog = true;
                    self.dialogHeader = 'Link Retailer Stores';
                }
            }
        }
    }
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