<template>
    <v-container :style="{ background: data.background }" grid-list-md>
        <v-layout row wrap>
            <v-flex lg4 md4 sm4 xs4 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                <h1>{{ data.headline }}</h1>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </v-flex>
            <v-flex lg4 md4 sm4 xs4>
                <v-img :aspect-ratio="16/9" :src="data.imgSrc"></v-img>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'app_details_description',
    props: ['data']
}
</script>

