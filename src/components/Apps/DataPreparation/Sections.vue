<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout class="pa-0 ma-0" row wrap>
                <v-flex md2 class="pa-0 ma-0">
                    <v-list>
                        <v-list-group prepend-icon="shopping_cart">
                            <template v-slot:activator>
                                <v-list-tile>
                                    <v-list-tile-title>Product</v-list-tile-title>
                                </v-list-tile>
                            </template>
                            <v-list-tile v-for="(item, i) in product" :key="i" @click="openDataImport(item.route)">
                                <v-list-tile-title v-text="item.name"></v-list-tile-title>
                                <v-list-tile-action>

                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group>
                         <v-list-group prepend-icon="shopping_cart">
                            <template v-slot:activator>
                                <v-list-tile>
                                    <v-list-tile-title>Item Fields</v-list-tile-title>
                                </v-list-tile>
                            </template>
                            <v-list-tile v-for="(item, i) in item_fields" :key="i" @click="openDataImport(item.route)">
                                <v-list-tile-title v-text="item.name"></v-list-tile-title>
                                <v-list-tile-action>

                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-group prepend-icon="work">
                            <template v-slot:activator>
                                <v-list-tile>
                                    <v-list-tile-title>Market</v-list-tile-title>
                                </v-list-tile>
                            </template>
                            <v-list-tile v-for="(item, i) in market" :key="i" @click="openDataImport(item.route)">
                                <v-list-tile-title v-text="item.name"></v-list-tile-title>
                                <v-list-tile-action>

                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-group prepend-icon="subject">
                            <template v-slot:activator>
                                <v-list-tile>
                                    <v-list-tile-title>Fact</v-list-tile-title>
                                </v-list-tile>
                            </template>
                            <v-list-tile v-for="(item, i) in fact" :key="i" @click="openDataImport(item.route)">
                                <v-list-tile-title v-text="item.name"></v-list-tile-title>
                                <v-list-tile-action>

                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-group prepend-icon="timeline">
                            <template v-slot:activator>
                                <v-list-tile>
                                    <v-list-tile-title>Period</v-list-tile-title>
                                </v-list-tile>
                            </template>
                            <v-list-tile v-for="(item, i) in period" :key="i" @click="openDataImport(item.route)">
                                <v-list-tile-title v-text="item.name"></v-list-tile-title>
                                <v-list-tile-action>

                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group>

                    </v-list>
                </v-flex>
                <v-flex md10 class="pa-0 ma-0">
                    <router-view />
                </v-flex>
            </v-layout>
        </v-container>
    </div>
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
                item_fields:[
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
                        name: 'Department',
                        route: 'Department'
                    }),
                      new navItem({
                        name: 'Brand',
                        route: 'Brand'
                    }),
                ],
                product: [
                    new navItem({
                        name: 'Product Catalogue',
                        route: 'ProductCatalogue'
                    }),
                     new navItem({
                        name: 'Category Code',
                        route: 'CategoryCode'
                    }),
                     new navItem({
                        name: 'Supergroup_A',
                        route: 'Supergroup_A'
                    }),
                    new navItem({
                        name: 'Supergroup_B',
                        route: 'Supergroup_B'
                    }),
                     
                    new navItem({
                        name: 'Item Status',
                        route: 'Item_Status'
                    }),
                ],
                market: [
                    new navItem({
                        name: 'Store',
                        route: 'Store'
                    }),
                    new navItem({
                        name: 'Store Cluster',
                        route: 'StoreCluster'
                    }),
                    new navItem({
                        name: 'Retail_Chain',
                        route: 'Retail_Chain'
                    }),
                     new navItem({
                        name: 'Active_Shop_Code',
                        route: 'Active_Shop_Code'
                    }),
                    new navItem({
                         name: 'Geographic_Location',
                        route: 'Geographic_Location'
                    }),
                ],
                fact: [
                    new navItem({
                        name: 'Planogram Maintenance',
                        route: 'PlanogramMaintenance'
                    }),
                    new navItem({
                        name: 'Test Range',
                        route: 'TestRange'
                    }),
                ],
                period: [
                    new navItem({
                        name: 'Period',
                        route: 'Period'
                    }),
                ]
            }
        },
        methods: {
            openDataImport(name) {
                let self = this;
                self.$router.push('/DataPreparation/' + name)
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
</style>