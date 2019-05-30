<template>
    <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
        <template v-slot:items="props">
            <tr class="no-hover">
                <td>{{ props.item.productSystemID }}</td>
                <td>{{ props.item.barcode }}</td>
                <td>{{ props.item.description }}</td>
                <td class="px-2">
                    <v-autocomplete :items="planograms" v-model="props.item.planogramName" placeholder="Planogram Name"
                        dense full-width flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete @change="onCategoryLinkChange(props.item)" :items="categoryLinks" v-model="props.item.category" placeholder="Category" dense
                        full-width flat solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td>{{ props.item.category_Code }}</td>
                <td>{{ props.item.department }}</td>
                <td>{{ props.item.subdepartment }}</td>
                <td class="px-2">
                    <v-autocomplete :items="subcategories" v-model="props.item.subcategory" placeholder="Subcategory" dense full-width flat
                        solo hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
                </td>
                <td class="px-2">
                    <v-autocomplete :items="segments" v-model="props.item.segment" placeholder="Segment" dense full-width flat solo
                        hide-details class="mt-0" style="margin-top: 0px"></v-autocomplete>
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
            text: 'Planogram Name',
            sortable: false
        },
        {
            text: 'Category',
            sortable: false
        },
        {
            text: 'Category Code',
            sortable: false
        },
        {
            text: 'Department',
            sortable: false
        },
        {
            text: 'Subdepartment',
            sortable: false
        },
        {
            text: 'Subcategory',
            sortable: false
        },
        {
            text: 'Segment',
            sortable: false
        },
        {
            text: '',
            sortable: false
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items', 'duplicate', 'remove', 'copy', 
            'canPaste', 'paste', 'planograms', 'categoryLinks', 
            'subcategories', 'segments', 'getCategoryDetailsByID', 'setItemsData'
        ],
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
            },
            onCategoryLinkChange(item) {
                let self = this;

                self.$nextTick(() => {
                    self.getCategoryDetailsByID(item.category, categoryDetails => {
                        self.setItemsData(item.index, "category_Code", categoryDetails.category_Code);
                        self.setItemsData(item.index, "department", categoryDetails.subdepartmentName);
                        self.setItemsData(item.index, "subdepartment", categoryDetails.departmentName);
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