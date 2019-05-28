<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.costPrice" dense full-width flat solo hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.markupPercent" dense full-width flat solo hide-details
                        class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.rSPExclusive" dense full-width flat solo hide-details
                        class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.rSPInclusive" dense full-width flat solo hide-details
                        class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.roundedSellingPrice" dense full-width flat solo hide-details
                        class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.grossProfitPercentage" dense full-width flat solo hide-details
                        class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.grossProfitPercentageForCategory" dense full-width flat solo
                        hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.discountPercentageAllowed" dense full-width flat solo hide-details
                        class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.taxCode" dense full-width flat solo hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td class="pa-0">
                    <v-text-field v-model="props.item.taxClass" dense full-width flat solo hide-details class="mt-0">
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
            text: 'Cost Price',
            sortable: false
        },
        {
            text: 'Markup %',
            sortable: false
        },
        {
            text: 'RSP (EXCL)',
            sortable: false
        },
        {
            text: 'RSP (INCL)',
            sortable: false
        },
        {
            text: 'Rounded Selling Price',
            sortable: false
        },
        {
            text: 'GP %',
            sortable: false
        },
        {
            text: '%GP Budget For Category',
            sortable: false
        },
        {
            text: 'Discount % Allowed',
            sortable: false
        },
        {
            text: 'Tax Code',
            sortable: false
        },
        {
            text: 'Tax Class',
            sortable: false
        },
        {
            text: '',
            sortable: false
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items', 'duplicate', 'remove'],
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