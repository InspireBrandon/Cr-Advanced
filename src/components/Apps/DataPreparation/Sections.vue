<template>
    <v-card tile flat>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout class="pa-0 ma-0" row wrap>
                <v-flex md2 class="pa-0 ma-0">
                    <div>
                        <h3 class="list-header mt-1">Product</h3>
                        <div v-for="(item, idx) in product" :key="'p' + idx" @click="route(item)">
                            <div class="list-item" :class="{ 'list-item-selected': isPath(item.route) }">{{ item.name }}
                            </div>
                        </div>
                        <h3 class="list-header mt-1">Item Fields</h3>
                        <div v-for="(item, idx) in item_fields" :key="'if' + idx" @click="route(item)">
                            <div class="list-item" :class="{ 'list-item-selected': isPath(item.route) }">{{ item.name }}
                            </div>
                        </div>
                        <h3 class="list-header mt-1">Market</h3>
                        <div v-for="(item, idx) in market" :key="'m' + idx" @click="route(item)">
                            <div class="list-item" :class="{ 'list-item-selected': isPath(item.route) }">{{ item.name }}
                            </div>
                        </div>
                        <h3 class="list-header mt-1">Strategy</h3>
                        <div v-for="(item, idx) in strategy" :key="'s' + idx" @click="route(item)">
                            <div class="list-item" :class="{ 'list-item-selected': isPath(item.route) }">{{ item.name }}
                            </div>
                        </div>
                        <h3 class="list-header mt-1">Product Supply</h3>
                        <div v-for="(item, idx) in productSupply" :key="'ps' + idx" @click="route(item)">
                            <div class="list-item" :class="{ 'list-item-selected': isPath(item.route) }">{{ item.name }}
                            </div>
                        </div>
                    </div>
                </v-flex>
                <v-flex md10 class="pa-0 ma-0">
                    <router-view />
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    function navItem(data) {
        this.name = data.name;
        this.route = data.route;
    }

    export default {
        name: 'DataImport',
        data: () => {
            return {
                selected: null,
                notifications: false,
                sound: false,
                video: false,
                invites: false,
                product: [
                    new navItem({
                        name: 'Product Catalogue',
                        route: 'ProductCatalogue'
                    }),
                    new navItem({
                        name: 'Data Import Structure',
                        route: 'CategoryCode'
                    }),
                    new navItem({
                        name: 'Item Status',
                        route: 'Item_Status'
                    }),
                    new navItem({
                        name: 'Planogram Maintenance',
                        route: 'PlanogramMaintenance'
                    }),
                ],
                item_fields: [
                    new navItem({
                        name: 'Supergroup A',
                        route: 'Supergroup_A'
                    }),
                    new navItem({
                        name: 'Supergroup B',
                        route: 'Supergroup_B'
                    }),
                    new navItem({
                        name: 'Department',
                        route: 'Department'
                    }),
                    new navItem({
                        name: 'Segment',
                        route: 'Segment'
                    }),
                    new navItem({
                        name: 'Manufacturer',
                        route: 'Manufacturer'
                    }),
                    new navItem({
                        name: 'Supplier',
                        route: 'Supplier'
                    }),

                    new navItem({
                        name: 'Brand',
                        route: 'Brand'
                    }),

                    // new navItem({
                    //     name: 'Stock Movement',
                    //     route: 'StockMovement'
                    // }),
                ],
                market: [
                    new navItem({
                        name: 'Store Contact Details',
                        route: 'Store'
                    }),
                    new navItem({
                        name: 'Store Address and Location',
                        route: 'Geographic_Location'
                    }),
                    new navItem({
                        name: 'Store And Category Cluster',
                        route: 'StoreCluster'
                    }),
                    new navItem({
                        name: 'Retail Chain',
                        route: 'Retail_Chain'
                    }),
                    new navItem({
                        name: 'Test Range',
                        route: 'TestRange'
                    }),
                ],
                strategy: [
                    new navItem({
                        name: 'Planogram Role',
                        route: 'PlanogramRole'
                    }),
                ],
                productSupply: [
                    new navItem({
                        name: 'Stock Movement',
                        route: 'StockMovement'
                    }),
                    new navItem({
                        name: 'Packing List',
                        route: 'PackingList'
                    }),
                ]
            }
        },
        methods: {
            openDataImport(name) {
                let self = this;
                self.$router.push('/DataPreparation/' + name)
            },
            isPath(path) {
                let self = this;
                return self.selected == path;
            },
            route(item) {
                let self = this;
                self.selected = item.route;
                self.$router.push('/DataPreparation/' + item.route);
            }
        }
    }
</script>
<style>
    #product {
        cursor: pointer;
    }

    #market {
        cursor: pointer;
    }

    #fact {
        cursor: pointer;
    }

    #period {
        cursor: pointer;
    }

    .list-header {
        padding: 4px 10px;
    }

    .list-item:hover {
        background: lightgray;
    }

    .list-item {
        padding: 1px;
        padding-left: 15px;
        cursor: pointer;
    }

    .list-item-selected {
        background: #1976d2 !important;
        color: white !important;
    }
</style>