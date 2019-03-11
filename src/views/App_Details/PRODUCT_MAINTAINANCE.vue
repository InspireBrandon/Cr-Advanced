<template>
    <v-card>
    <div>
        <details-header :data="details_header_data"></details-header>
        <details-description :data="details_description_data"></details-description>
    </div>
    </v-card>
</template>

<script>
    import details_header from '@/components/Common/App/Details/Header'
    import details_description from '@/components/Common/App/Details/Description'

    export default {
        name: 'range_planning_details',
        components: {
            'details-header': details_header,
            'details-description': details_description
        },
        data() {
            return {
                details_header_data: {
                    imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
                },
                details_description_data: {
                    desciption:{
                        patchNotes:"No Change",
                        desciption:"This tool is used to set up and maintain your list of products that you will use throughout the system.",
                    },
                      patchNotes: [{
                        version: "v1.0.0.0",
                        notes: [{
                                type: "Improvement",
                                details: "Added patch Notes"
                            },
                           
                        ]

                    },{
                        version: "v1.0.0",
                        notes: [{
                                type: "Improvement",
                                details: "Added patch Notes"
                            },
                            {
                                type: "Bug Fix",
                                details: "Fixed patch notes not loading corretly"
                            },
                            {
                                type: "improvement",
                                details: "Added style to patch notes and repositioned the layout"
                            }
                        ]

                    }],
                    headline: 'Product Maintainance',
                    imgSrc: 'https://i.pinimg.com/originals/68/1c/88/681c886f512869534e77ceb578a13c30.jpg'
                }
            }
        }
    }
</script>