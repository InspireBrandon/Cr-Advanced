<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="px-2">
                    <v-text-field v-model="props.item.unit_Cost" placeholder="Cost" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.markup_Percent" placeholder="Markup" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.currentRSP" placeholder="RSP" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.unit_Price" placeholder="Price" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.gross_Profit_Percentage" placeholder="GP %" dense full-width flat
                        solo hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.category_Gross_Profit_Percentage" placeholder="GP %" dense
                        full-width flat solo hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.shortfall_Percentage" placeholder="Shortfall" dense full-width
                        flat solo hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.tax_Class" placeholder="Class" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.purchase_Group" placeholder="Purchase Group" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.tax_Code" placeholder="Code" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-text-field>
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
            text: 'Unit Cost',
            sortable: false
        },
        {
            text: 'Markup %',
            sortable: false
        },
        {
            text: 'Current RSP',
            sortable: false
        },
        {
            text: 'Unit Price',
            sortable: false
        },
        {
            text: 'GP %',
            sortable: false
        },
        {
            text: 'Category GP %',
            sortable: false
        },
        {
            text: 'Shortfall %',
            sortable: false
        },
        {
            text: 'Tax Class',
            sortable: false
        },
        {
            text: 'Purchase Group',
            sortable: false
        },
        {
            text: 'Tax Code',
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