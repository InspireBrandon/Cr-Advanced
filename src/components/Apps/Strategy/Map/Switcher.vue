<template>
    <div>
        <v-toolbar  dense dark flat color="grey darken-2">
            <v-toolbar-title>
                Market Share
            </v-toolbar-title>
            <v-toolbar-items>
                <!-- <v-menu dark offset-y style="margin-bottom: 10px;">
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
                </v-menu> -->
                <v-spacer></v-spacer>

            </v-toolbar-items>

            <v-spacer></v-spacer>
          
        </v-toolbar>
        <v-tabs class="elevation-0" centered dark fixed-tabs justify-content: center>
            <v-tabs-slider color="white"></v-tabs-slider>

            <!-- <v-tab href="#tab-1" justify-content: center>
                            Map Image
                        </v-tab> -->
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
        </v-tabs>
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
            return {}

        }
    }
</script>