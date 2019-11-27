<template>
    <div>
        <SimpleList :passedHeaders="Headers" name="Item_Status"></SimpleList>
    </div>
</template>

<script>
    import SimpleList from '@/components/Apps/DataPreparation/Common/SimpleList.vue'

    export default {
        components: {
            SimpleList
        },
        data() {
            return {
                Headers: [{
                        "headerName": "Name",
                        "field": "displayname"
                    },
                    {
                        "headerName": "Item_Status",
                        "field": "item_Status"
                    }, {
                        "headerName": "Description",
                        "field": "description"
                    }, {
                        "headerName": "Sap Code",
                        "field": "product_System_ID"
                    }, {
                        "headerName": "Barcode",
                        "field": "barcode"
                    },
                    {
                        "headerName": "Actions",
                        "field": "",
                        "cellRendererFramework": "Button",
                        "pinned": "right"
                    }
                ]

            }
        }
    }
</script>