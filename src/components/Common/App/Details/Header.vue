<template>
    <div>
        <v-img :aspect-ratio="16/4" :src="data.imgSrc">
            <v-layout pa-2 column fill-height class="lightbox white--text">
                <v-flex shrink>
                    <div class="body-1">
                        <v-btn @click="$router.go(-1)" flat>
                            <v-icon>arrow_back_ios</v-icon>
                            <span>back</span>
                        </v-btn>
                    </div>
                </v-flex>
            </v-layout>
        </v-img>
    </div>
</template>

<script>
export default {
    name: 'app_details_header',
    props: ['data']
}
</script>
