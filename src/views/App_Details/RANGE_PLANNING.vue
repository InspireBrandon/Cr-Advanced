<template>
    <div>
        <details-header :data="details_header_data"></details-header>
        <details-description :data="details_description_data"></details-description>
    </div>
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
                        desciption:"With the range planning toolkit you will be able to build up a foundational layer of products in no time.",
                    },
                      patchNotes: [{
                        version: "v1.2.0",
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
                    headline: 'Range Planning',
                    imgSrc: 'https://www.icagruppen.se/globalassets/4.-hallbarhet/4.-hallbarhetsarbete/6.-historiskt-material/99.-halsa/halso-sortiment-lx-ny.jpg'
                }
            }
        }
    }
</script>