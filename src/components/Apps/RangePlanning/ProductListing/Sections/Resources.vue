<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.mrp_Controller" placeholder="MRP Controller" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.retailer_Stock_Planner" placeholder="Stock Planner" dense full-width
                        flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.retailer_Buyer" placeholder="Buyer" dense full-width
                        flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.buyer_Assistant" placeholder="Buyer Assistant" dense full-width
                        flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.order_Clerk" placeholder="Order Clerk" dense full-width
                        flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
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
    </v-data-table>
</template>

<script>
    const headers = [{
            text: 'Product System ID',
            sortable: false,
            width: '200'
        },
        {
            text: 'Barcode',
            sortable: false,
            width: '150'
        },
        {
            text: 'Description',
            sortable: false,
            width: '300'
        },
        {
            text: 'MRP Controller',
            sortable: false
        },
        {
            text: 'Stock Planner',
            sortable: false
        },
        {
            text: 'Buyer',
            sortable: false
        },
        {
            text: 'Buyer Assistant',
            sortable: false
        },
        {
            text: 'Order Clerk',
            sortable: false
        },
        {
            text: '',
            sortable: false
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items', 'duplicate', 'remove', 'copy', 'canPaste', 'paste'],
        data() {
            return {
                headers: headers
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
            }
        }
    }
</script>

<style>
    .no-hover {
        background: white !important;
    }
</style>