<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
                <v-tabs fixed-tabs v-model="active" dark color="grey darken-4">
                    <v-tab v-for="tab in tabs" :key="tab.name" ripple>
                        {{ tab.name }}
                    </v-tab>
                </v-tabs>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Clustering</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-tabs-items v-model="active">
            <v-tab-item v-for="tab in tabs" :key="tab.name">
                <v-card flat tile>
                    <component :is="tab.component"></component>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
    import BasketAnalysis from '../BasketAnalysis/Index'
    import ListingClusters from '../ListingClusters/Index'
    import StoreAnalysis from '../StoreAnalysis/Index'        

    function TabItem(name, component) {
        this.name = name;
        this.component = component;
    }

    export default {
        components: { BasketAnalysis, ListingClusters, StoreAnalysis },
        data() {
            return {
                active: null,
                tabs: [
                    new TabItem("Main", "Main"),
                    new TabItem("Basket", "BasketAnalysis"),
                    new TabItem("Listing", "ListingClusters"),
                    new TabItem("Store", "StoreAnalysis"),
                    // new TabItem("User", "Main"),
                ]
            }
        },
        methods: {
            next() {
                const active = parseInt(this.active)
                this.active = (active < 2 ? active + 1 : 0)
            }
        }
    }
</script>