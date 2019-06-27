<template>
    <div class="text-xs-center">
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout justify-center>
                <v-dialog v-model="dialog" width="1500">
                    <v-card>
                        <v-toolbar flat color="primary" dark>
                            <v-toolbar-title>Title</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-layout row wrap>
                            <v-flex md2 justify-start fill-height>
                                <v-list dense class="pt-0" fill-height>
                                    <v-list-tile v-for="item in items" :key="item.title">
                                        <v-list-tile-action>
                                            <v-icon>{{ item.icon }}</v-icon>
                                        </v-list-tile-action>

                                        <v-list-tile-content>
                                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-flex>
                            <v-flex md10 justify-end>
                                <v-toolbar flat color="primary" dark>
                                    <v-toolbar-title>Title</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                            </v-flex>
                            <v-flex md10>
                                <v-card-text class="pt-0">
                                    <v-data-table :headers="headers" :items="desserts" class="elevation-0">
                                        <template slot="headerCell" slot-scope="props">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <span v-on="on">
                                                        {{ props.header.text }}
                                                    </span>
                                                </template>
                                                <span>
                                                    {{ props.header.text }}
                                                </span>
                                            </v-tooltip>
                                        </template>
                                        <template v-slot:items="props">
                                            <td>{{ props.item.name }}</td>
                                            <td class="text-xs-right">{{ props.item.calories }}</td>
                                            <td class="text-xs-right">{{ props.item.fat }}</td>
                                            <td class="text-xs-right">{{ props.item.carbs }}</td>
                                            <td class="text-xs-right">{{ props.item.protein }}</td>
                                            <td class="text-xs-right">{{ props.item.iron }}</td>
                                        </template>
                                    </v-data-table>

                                </v-card-text>
                            </v-flex>
                        </v-layout>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="info" flat @click="dialog = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                drawer: null,
                items: [{
                        title: 'Event sheet',
                        icon: 'dashboard'
                    },
                    {
                        title: 'Option 2',
                        icon: 'account_box'
                    },
                    {
                        title: 'Option 3',
                        icon: 'gavel'
                    }
                ],
                headers: [{
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {
                        text: 'Calories',
                        value: 'calories'
                    },
                    {
                        text: 'Fat (g)',
                        value: 'fat'
                    },
                    {
                        text: 'Carbs (g)',
                        value: 'carbs'
                    },
                    {
                        text: 'Protein (g)',
                        value: 'protein'
                    },
                    {
                        text: 'Iron (%)',
                        value: 'iron'
                    }
                ],
                desserts: [{
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%'
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%'
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%'
                    },
                    {
                        name: 'Cupcake',
                        calories: 305,
                        fat: 3.7,
                        carbs: 67,
                        protein: 4.3,
                        iron: '8%'
                    },
                    {
                        name: 'Gingerbread',
                        calories: 356,
                        fat: 16.0,
                        carbs: 49,
                        protein: 3.9,
                        iron: '16%'
                    },
                    {
                        name: 'Jelly bean',
                        calories: 375,
                        fat: 0.0,
                        carbs: 94,
                        protein: 0.0,
                        iron: '0%'
                    },
                    {
                        name: 'Lollipop',
                        calories: 392,
                        fat: 0.2,
                        carbs: 98,
                        protein: 0,
                        iron: '2%'
                    },
                    {
                        name: 'Honeycomb',
                        calories: 408,
                        fat: 3.2,
                        carbs: 87,
                        protein: 6.5,
                        iron: '45%'
                    },
                    {
                        name: 'Donut',
                        calories: 452,
                        fat: 25.0,
                        carbs: 51,
                        protein: 4.9,
                        iron: '22%'
                    },
                    {
                        name: 'KitKat',
                        calories: 518,
                        fat: 26.0,
                        carbs: 65,
                        protein: 7,
                        iron: '6%'
                    }
                ]
            }
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
        }
    }
</script>