<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td class="px-2">
                    <v-text-field v-model="props.item.productSystemID" placeholder="Product System ID" dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.productCode" placeholder="Product Code" dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.barcode" placeholder="Barcode" dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px">
                    </v-text-field>
                </td>
                <td class="px-2">
                    <v-text-field v-model="props.item.description" placeholder="Description" dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px">
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
            sortable: false
        },
        {
            text: 'Product Code',
            sortable: false
        },
        {
            text: 'Barcode',
            sortable: false
        },
        {
            text: 'Description',
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