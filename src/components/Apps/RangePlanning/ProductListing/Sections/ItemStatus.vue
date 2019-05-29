<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td style="text-align: center;">
                    <v-checkbox v-model="props.item.replaceItemSAPCode" hide-details color="primary"></v-checkbox>
                </td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.itemStatus" placeholder="Item Status" dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete v-model="props.item.activeShopCode" placeholder="Active Shop Code" dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td>
                    <v-checkbox v-model="props.item.openSupplier" hide-details color="primary"></v-checkbox>
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
            text: 'Replace Item SAP Code',
            sortable: false
        },
        {
            text: 'Item Status',
            sortable: false
        },
        {
            text: 'Active Shop Code',
            sortable: false
        },
        {
            text: 'Open Supplier',
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