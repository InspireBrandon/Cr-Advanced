<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
                <v-tabs fixed-tabs v-model="active" dark color="grey darken-4">
                    <v-tab v-for="tab in tabs" :key="tab.name" ripple @click="handleMap(tab)">
                        {{ tab.name }}
                    </v-tab>
                </v-tabs>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Clustering</span>
                <v-btn icon @click="showSettingsModal">
                    <v-icon>settings</v-icon>
                </v-btn>
            </v-toolbar-title>
        </v-toolbar>
        <v-tabs-items v-model="active">
            <v-tab-item v-for="tab in tabs" :key="tab.name">
                <v-card flat tile>
                    <component ref="component" :is="tab.component"></component>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
        <SettingsModal ref="settingsModal" />
        <Spinner ref="spinner"></Spinner>
    </v-card>
</template>

<script>
    import Main from '../Main/Index'
    import BasketAnalysis from '../BasketAnalysis/Index'
    import ListingClusters from '../ListingClusters/Index'
    import StoreAnalysis from '../StoreAnalysis/Index'
    import Research from '../Research/Index'
    import Custom from '../Custom/Index'
    import Brand from "../Brand/Index.vue"
    import Department from "../Department/Index.vue"

    import SettingsModal from './SettingsModal.vue'

    function TabItem(name, component) {
        this.name = name;
        this.component = component;
    }

    export default {
        components: {
            Main,
            Department,
            BasketAnalysis,
            ListingClusters,
            StoreAnalysis,
            Map,
            Research,
            Custom,
            Brand,
            SettingsModal
        },
        data() {
            return {
                active: 0,
                tabs: [
                    new TabItem("Main", "Main"),
                    new TabItem("Store", "StoreAnalysis"),
                    new TabItem("Basket", "BasketAnalysis"),
                    new TabItem("Listing", "ListingClusters"),
                    new TabItem("Category", "Brand"),
                    new TabItem("Department", "Department"),
                    // new TabItem("Custom", "Custom"),
                    // new TabItem("Import", "Research")
                ]
            }
        },
        methods: {
            next() {
                const active = parseInt(this.active)
                this.active = (active < 2 ? active + 1 : 0)
            },
            handleMap(tab) {
                let self = this;

                setTimeout(() => {
                    if (tab.name == "Map") {
                        self.$refs.component[4].drawMap();
                    }
                }, 1000);
            },
            showSettingsModal() {
                let self = this;

                self.$refs.settingsModal.show(() => {

                })
            },
        }
    }
</script>