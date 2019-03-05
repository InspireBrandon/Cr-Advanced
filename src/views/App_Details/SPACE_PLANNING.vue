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
        name: 'space_planning_details',
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
                    headline: 'Space Planning',
                    imgSrc: 'https://i.ytimg.com/vi/L4hK7jXGxg0/maxresdefault.jpg',
                    background: "transparent"
                }
            }
        }
    }
</script>