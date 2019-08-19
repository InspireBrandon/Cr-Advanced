<template>
    <v-card flat>
        <v-card-text>
            <v-btn v-for="(item, index) in items" :key="index" color="primary" dark @click="$router.push(item.route)">
                {{ item.name }}</v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                items: [{
                    name: "Product Listing",
                    route: "/ProductListing"
                }, {
                    name: "Graphs",
                    route: "/Graphs"
                }, {
                    name: "File Status",
                    route: "FileStatus"
                }, {
                    name: "Basket Analysis",
                    route: "BasketAnalysis"
                },{
                    name: "ListingClusters",
                    route: "ListingClusters"
                }]
            }
        }
    }
</script>