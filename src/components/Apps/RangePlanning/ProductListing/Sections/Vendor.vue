<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="px-2">
                    <v-text-field v-model="props.item.vendorNumber" dense full-width flat solo hide-details class="mt-0"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.vendorName" dense full-width flat solo hide-details class="mt-0"></v-text-field>
                </td>
                <td class="px-2"> 
                    <v-text-field v-model="props.item.vendorDescription" dense full-width flat solo hide-details class="mt-0"></v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.brand" dense full-width flat solo hide-details class="mt-0"></v-text-field>
                </td>
                <td style="width: 5px;">
                    <v-menu dark offset-y>
                        <v-btn slot="activator" icon>
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list light dense>
                            <v-list-tile>
                                <v-list-tile-title>New Line</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Open</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Save</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Close</v-list-tile-title>
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
            text: 'Vendor No.',
            sortable: false
        },
        {
            text: 'Vendor Name',
            sortable: false
        },
        {
            text: 'Vendor Description',
            sortable: false
        },
        {
            text: 'Brand',
            sortable: false
        },
        {
            text: '',
            sortable: false
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items'],
        data() {
            return {
                headers: headers
            }
        }
    }
</script>

<style>
    .no-hover {
        background: white !important;
    }
</style>