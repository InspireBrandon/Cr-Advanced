<template>
    <div>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-toolbar dark dense>
                            <v-toolbar-title>Data Preparation</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex md12>
                                    <v-card dark dense color="blue-grey darken-2">
                                        <v-card-title class="title font-weight-bold font-italic">Product
                                            <v-spacer></v-spacer>
                                            <v-icon right>shopping_cart</v-icon>
                                        </v-card-title>
                                    </v-card>
                                </v-flex>
                                <v-flex md4 v-for="(card, idx) in product" :key="idx">
                                    <v-card @click="openDataImport(card.route)">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-hover>
                                                    <v-card-text dark v-on="on" id="fact"
                                                        class="subheading font-weight-regular font-italic"
                                                        slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                                        {{card.name}}
                                                    </v-card-text>
                                                </v-hover>
                                            </template>
                                            <span>Route is: {{card.route}}</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-flex>
                                <v-flex md12>
                                    <v-card dark dense color="blue-grey darken-2">
                                        <v-card-title class="title font-weight-bold font-italic">Market
                                            <v-spacer></v-spacer>
                                            <v-icon right>work</v-icon>
                                        </v-card-title>
                                    </v-card>
                                </v-flex>
                                <v-flex md4 v-for="(card, idx) in market" :key="idx">
                                    <v-card @click="openDataImport(card.route)">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-hover>
                                                    <v-card-text dark v-on="on" id="fact"
                                                        class="subheading font-weight-regular font-italic"
                                                        slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                                        {{card.name}}
                                                    </v-card-text>
                                                </v-hover>
                                            </template>
                                            <span>Route is: {{card.route}}</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-flex>
                                <v-flex md12>
                                    <v-card dark dense color="blue-grey darken-2">
                                        <v-card-title class="title font-weight-bold font-italic">Fact
                                            <v-spacer></v-spacer>
                                            <v-icon right>subject</v-icon>
                                        </v-card-title>
                                    </v-card>
                                </v-flex>
                                <v-flex md4 v-for="(card, idx) in fact" :key="idx">
                                    <v-card @click="openDataImport(card.route)">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-hover>
                                                    <v-card-text dark v-on="on" id="fact"
                                                        class="subheading font-weight-regular font-italic"
                                                        slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                                        {{card.name}}
                                                    </v-card-text>
                                                </v-hover>
                                            </template>
                                            <span>Route is: {{card.route}}</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-flex>
                                <v-flex md12>
                                    <v-card dark dense color="blue-grey darken-2">
                                        <v-card-title class="title font-weight-bold font-italic">Period
                                            <v-spacer></v-spacer>
                                            <v-icon right>timeline</v-icon>
                                        </v-card-title>
                                    </v-card>
                                </v-flex>
                                <v-flex md4 v-for="(card, idx) in period" :key="idx">
                                    <v-card @click="openDataImport(card.route)">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-hover>
                                                    <v-card-text dark v-on="on" id="fact"
                                                        class="subheading font-weight-regular font-italic"
                                                        slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                                                        {{card.name}}
                                                    </v-card-text>
                                                </v-hover>
                                            </template>
                                            <span>Route is: {{card.route}}</span>
                                        </v-tooltip>
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
                product: [
                    new cardItem({
                        name: 'Brand',
                        route: 'Brand'
                    }),
                    new cardItem({
                        name: 'Manufacturer',
                        route: 'Manufacturer'
                    }),
                    new cardItem({
                        name: 'Supplier',
                        route: 'Supplier'
                    }),
                    new cardItem({
                        name: 'Department',
                        route: 'Department'
                    }),
                ],
                market: [
                    new cardItem({
                        name: 'Store',
                        route: 'Store'
                    }),
                ],
                fact: [
                    new cardItem({
                        name: 'Planogram Maintenance',
                        route: 'PlanogramMaintenance'
                    }),
                    new cardItem({
                        name: 'Supergroup_A',
                        route: 'Supergroup_A'
                    }), 
                    new cardItem({
                        name: 'Supergroup_B',
                        route: 'Supergroup_B'
                    }),
                    new cardItem({
                        name: 'Segment',
                        route: 'Segment'
                    }),
                    new cardItem({
                        name: 'Item_Status',
                        route: 'Item_Status'
                    }), 
                    new cardItem({
                        name: 'Active_Shop_Code',
                        route: 'Active_Shop_Code'
                    }), 
                    new cardItem({
                        name: 'Retail_Chain',
                        route: 'Retail_Chain'
                    }), 
                    new cardItem({
                        name: 'Product Catalogue',
                        route: 'ProductCatalogue'
                    })
                ],
                period: [
                    new cardItem({
                        name: 'Period',
                        route: 'Period'
                    }),
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