<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="px-2">
                    <v-autocomplete @change="onManufacturerChange(props.item)" :items="manufacturers"
                        v-model="props.item.manufacturer" placeholder="Manufacturer" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td>{{ props.item.manufacturer_Code }}</td>
                <td class="px-2">
                    <v-autocomplete :items="brands" v-model="props.item.brand" placeholder="Brand" dense full-width flat
                        solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-text-field placeholder="Product Code" v-model="props.item.product_Code" dense full-width flat
                        solo hide-details class="mt-0"></v-text-field>
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
            text: 'Manufacturer',
            sortable: false
        },
        {
            text: 'Manufacturer Code',
            sortable: false
        },
        // {
        //     text: 'Supplier',
        //     sortable: false
        // },
        // {
        //     text: 'Supplier Code',
        //     sortable: false
        // },
        {
            text: 'Brand',
            sortable: false
        },
        {
            text: 'Product Code',
            sortable: false
        },
        {
            text: '',
            sortable: false
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items', 'manufacturers', 'brands', 'duplicate', 'remove', 'copy', 'canPaste', 'paste',
            'getManufacturerDetailsByID', 'setItemsData'
        ],
        data() {
            return {
                headers: headers,
                manufacturer: null
            }
        },
        methods: {
            onManufacturerChange(item) {
                let self = this;

                self.$nextTick(() => {
                    self.getManufacturerDetailsByID(item.manufacturer, manufacturerDetails => {
                        self.setItemsData(item.index, "manufacturer_Code", manufacturerDetails
                            .manufacturer_Code);
                    });
                })
            }
        }
    }
</script>

<style>
    .no-hover {
        background: white !important;
    }
</style>