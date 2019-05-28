<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td>
                    <v-text-field v-model="props.item.case_Height" dense full-width flat solo hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td>
                    <v-text-field v-model="props.item.case_Width" dense full-width flat solo hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td>
                    <v-text-field v-model="props.item.case_Depth" dense full-width flat solo hide-details class="mt-0">
                    </v-text-field>
                </td>
                <td>
                    <img src="http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png"
                        alt="" style="max-height: 50px; margin-top: 5px;">
                </td>
                <td>
                    <img src="http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png"
                        alt="" style="max-height: 50px; margin-top: 5px;">
                </td>
                <td>
                    <img src="http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png"
                        alt="" style="max-height: 50px; margin-top: 5px;">
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
            text: 'Case Height',
            sortable: false,
            width: '100'
        },
        {
            text: 'Case Width',
            sortable: false,
            width: '100'
        },
        {
            text: 'Case Depth',
            sortable: false,
            width: '100'
        },
        {
            text: 'Case Front',
            sortable: false,
            width: '100'
        },
        {
            text: 'Case Side',
            sortable: false,
            width: '100'
        },
        {
            text: 'Case Top',
            sortable: false,
            width: '100'
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
                currentView: 0,
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