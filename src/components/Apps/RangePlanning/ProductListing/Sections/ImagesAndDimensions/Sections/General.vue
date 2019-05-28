<template>
    <div>
        <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
            <template v-slot:items="props">
                <tr class="no-hover">
                    <td>{{ props.item.productSystemID }}</td>
                    <td>{{ props.item.barcode }}</td>
                    <td>{{ props.item.description }}</td>
                    <td>
                        <v-text-field v-model="props.item.height" dense full-width flat solo hide-details class="mt-0">
                        </v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="props.item.width" dense full-width flat solo hide-details class="mt-0">
                        </v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="props.item.depth" dense full-width flat solo hide-details class="mt-0">
                        </v-text-field>
                    </td>
                    <td class="clickable" @click="changeImage(props.item, 'threeDimensional')">
                        <img :src="props.item.threeDimensionalImage" alt="" style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td class="clickable" @click="changeImage(props.item, 'front')">
                        <img :src="props.item.frontImage" alt="" style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td class="clickable" @click="changeImage(props.item, 'side')">
                        <img :src="props.item.sideImage" alt="" style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td class="clickable" @click="changeImage(props.item, 'top')">
                        <img :src="props.item.topImage" alt="" style="max-height: 50px; margin-top: 5px;">
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
        <input @change="onImageChange" ref="fileInput" style="display: none;" type="file">
    </div>
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
            text: 'Height (cm)',
            sortable: false,
            width: '100'
        },
        {
            text: 'Width (cm)',
            sortable: false,
            width: '100'
        },
        {
            text: 'Depth (cm)',
            sortable: false,
            width: '100'
        },
        {
            text: '3D',
            sortable: false,
            width: '100'
        },
        {
            text: 'Front',
            sortable: false,
            width: '100'
        },
        {
            text: 'Side',
            sortable: false,
            width: '100'
        },
        {
            text: 'Top',
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
                headers: headers,
                selectedItem: null,
                selectedFacing: null
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
            changeImage(item, facing) {
                let self = this;
                self.selectedItem = item;
                self.selectedFacing = facing;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    self.selectedItem[self.selectedFacing + "Image"] = url;
                })
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
        }
    }
</script>

<style>
    .no-hover {
        background: white !important;
    }

    .clickable {
        cursor: pointer;
    }
</style>