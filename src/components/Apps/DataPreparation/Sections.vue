<template>
    <div>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-toolbar dark dense>
                            <v-toolbar-title>Data Import</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex md4 v-for="(card, idx) in cards" :key="idx">
                                    <v-card @click="openDataImport(card.route)">
                                        <v-card-text>
                                            {{card.name}}
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    function cardItem(data) {
        this.name = data.name;
        this.route = data.route;
    }

    export default {
        name: 'DataImport',
        data: () => {
            return {
                cards: [
                    new cardItem({
                        name: 'Manufacturer',
                        route: 'Manufacturer'
                    }),
                    new cardItem({
                        name: 'Product',
                        route: 'Product'
                    }),
                    new cardItem({
                        name: 'Brand',
                        route: 'Brand'
                    }),
                     new cardItem({
                        name: 'Supergroup_A',
                        route: 'Supergroup_A'
                    }),new cardItem({
                        name: 'Supergroup_B',
                        route: 'Supergroup_B'
                    }),new cardItem({
                        name: 'Department',
                        route: 'Department'
                    }),new cardItem({
                        name: 'Supplier',
                        route: 'Supplier'
                    }),new cardItem({
                        name: 'Segment',
                        route: 'Segment'
                    }),new cardItem({
                        name: 'Item_Status',
                        route: 'Item_Status'
                    }),new cardItem({
                        name: 'Active_Shop_Code',
                        route: 'Active_Shop_Code'
                    }),new cardItem({
                        name: 'Retail_Chain',
                        route: 'Retail_Chain'
                    }),new cardItem({
                        name: 'Period',
                        route: 'Period'
                    })
                ]
            }
        },
        methods: {
            openDataImport(name) {
                let self = this;
                self.$router.push('DataPreparation/' + name)
            }
        }
    }
</script>