<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="px-2">
                    <v-text-field v-model="props.item.stock_Units" placeholder="Units" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.stock_Cost" placeholder="Cost" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.stock_Retailer" placeholder="Retail" dense full-width flat
                        solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.outstanding_Order_Units" placeholder="Order Units"
                        dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.outstanding_Order_Value" placeholder="Order Value"
                        dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.action_Plan" placeholder="Plan" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.return_By_Date" placeholder="Return By" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.lead_Time" placeholder="Lead Time" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td>
                    <v-checkbox v-model="props.item.consignment" hide-details color="primary"></v-checkbox>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.minimum_Order_Value" placeholder="Minimum Order Value" dense full-width
                        flat solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
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
            text: 'Stock Units',
            sortable: false
        },
        {
            text: 'Stock Cost',
            sortable: false
        },
        {
            text: 'Stock Retil',
            sortable: false
        },
        {
            text: 'Outstanding Order Units',
            sortable: false
        },
        {
            text: 'Outstanding Order Value',
            sortable: false
        },
        {
            text: 'Action Plan',
            sortable: false,
            width: '25%'
        },
        {
            text: 'Returns By Date',
            sortable: false
        },
        {
            text: 'Lead Time',
            sortable: false,
            width: '200px'
        },
        {
            text: 'Consignment',
            sortable: false
        },
        {
            text: 'Minimum Order Value',
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