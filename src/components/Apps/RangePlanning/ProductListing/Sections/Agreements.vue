<template>
    <v-data-table item-key="index" :expand="expand" hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td style="text-align: center;">
                    <v-checkbox color="primary" hide-details v-model="props.item.stockProtectionAgreementAttached" class="mt-0">
                    </v-checkbox>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.lOAAttached" dense full-width flat solo hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td class="clickable" @dblclick="changeConsignmentFixed(props.item)">
                    <span>{{ props.item.consignmentOrFixed }}</span>
                </td>
                <td class="clickable" @dblclick="changeReplacementOrNewProduct(props.item)">
                    <span>{{ props.item.replacementOrNewProduct }}</span>
                </td>
                <td>
                    <v-btn @click="props.expanded = !props.expanded" icon>
                        <v-icon>person</v-icon>
                    </v-btn>
                </td>
                <td style="width: 5px;">
                    <v-menu dark offset-y>
                        <v-btn slot="activator" icon>
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list light dense>
                            <v-list-tile @click="duplicateLine(props.item)">
                                <v-list-tile-title>Duplicate Line</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="copy(props.item)">
                                <v-list-tile-title>Copy</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile :disabled="canPaste" @click="paste(props.item)">
                                <v-list-tile-title>Paste</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="removeLine(props.item)">
                                <v-list-tile-title>Remove Line</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </td>
            </tr>
        </template>
        <template v-slot:expand="props">
            <v-card flat dark>
                <v-card-text>
                    <v-container class="pa-0" grid-list-md>
                        <v-layout class="pa-0" row wrap>
                            <v-flex xs12 md3>
                                <v-autocomplete label="MRP Controller" :items="users" v-model="props.item.mRPController"
                                    hide-details></v-autocomplete>
                            </v-flex>

                            <v-flex xs12 md3>
                                <v-autocomplete label="Stock Planner" :items="users" v-model="props.item.stockPlanner"
                                    hide-details></v-autocomplete>
                            </v-flex>

                            <v-flex xs12 md3>
                                <v-autocomplete label="Buyer" :items="users" v-model="props.item.buyer" hide-details>
                                </v-autocomplete>
                            </v-flex>

                            <v-flex xs12 md3>
                                <v-autocomplete label="Buyer Assistant" :items="users"
                                    v-model="props.item.buyerAssistant" hide-details></v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </template>
    </v-data-table>
</template>

<script>
    const headers = [{
            text: 'Product System ID',
            sortable: false,
            width: '10%'
        },
        {
            text: 'Barcode',
            sortable: false,
            width: '10%'
        },
        {
            text: 'Description',
            sortable: false,
            width: '10%'
        },
        {
            text: 'SPA Attached',
            sortable: false,
            width: '5%'
        },
        {
            text: 'LOA Attached',
            sortable: false
        },
        {
            text: 'Consignment/Fixed',
            sortable: false
        },
        {
            text: 'Replacement/New Product',
            sortable: false
        },
        {
            text: 'User Details',
            sortable: false,
            width: '5px'
        },
        {
            text: '',
            sortable: false,
            width: '5px'
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items', 'duplicate', 'remove', 'copy', 'canPaste', 'paste'],
        data() {
            return {
                headers: headers,
                users: [{
                        text: "Brandon Lange",
                        value: 1
                    },
                    {
                        text: "Teejay Visser",
                        value: 2
                    }, {
                        text: "Pieter Meyer",
                        value: 3
                    }
                ],
                expand: false
            }
        },
        methods: {
            duplicateLine(item) {
                let self = this;
                self.duplicate(item);
            },
            removeLine(item) {
                let self = this;
                self.remove(item);
            },
            changeConsignmentFixed(item) {
                let self = this;

                if (item.consignmentOrFixed == "Consignment") {
                    item.consignmentOrFixed = "Fixed"
                } else {
                    item.consignmentOrFixed = "Consignment"
                }
            },
            changeReplacementOrNewProduct(item) {
                let self = this;

                if (item.replacementOrNewProduct == "Replacement") {
                    item.replacementOrNewProduct = "New Product"
                } else {
                    item.replacementOrNewProduct = "Replacement"
                }
            }
        }
    }
</script>

<style scoped>
    .no-hover {
        background: white !important;
    }

    .clickable {
        cursor: pointer;
    }

    .pth {
        padding: 0px;
    }
</style>