<template>
    <div>
        <SimpleList hasCode="false" :passedHeaders="Headers" name="Supergroup_B"></SimpleList>
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
                        "field": "supergroup_B"
                    },
                    {
                        "headerName": "Category",
                        "field": "category"
                    },{
                        "headerName": "Department",
                        "field": "department"
                    },{
                        "headerName": "Subdepartment",
                        "field": "subdepartment"
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
