<template>
    <div>
        <v-card flat v-if="item.file!=null" @click="handleFolder(item)"
            :class="{ 'highlighted': selectedimage == item}">
            <v-card-text>
                <v-img :src="imageSrc(item.id) == '' ? tmpImageURL : imageSrc(item.id)" aspect-ratio="1"
                    class="grey lighten-2" width="100%" height="100" max-width="100" style="cursor: pointer;"></v-img>
            </v-card-text>
            <v-card-title> {{item.name}}</v-card-title>
        </v-card>
        <v-card height="100" max-width="100" flat v-else @click="handleFolder(item)">
            <v-card-text>
                <v-icon size="100" v-if="item.type=='back'">backspace</v-icon>
                <v-icon size="100" v-else>folder</v-icon>
            </v-card-text>
            <v-card-title> {{item.name}}</v-card-title>
        </v-card>
    </div>
</template>
<script>
    import axios from "axios"
    export default {
        props: ["item", "handleFolder", "selectedimage"],
        data() {
            return {
                tmpImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
            }
        },
        methods: {
            imageSrc(ImageID) {
                let self = this
                return process.env.VUE_APP_API +
                    `FloorplanMedia/Image?ImageID=${ImageID}&databaseID=${sessionStorage.currentDatabase}`
            }
        }
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2 !important;
    }
</style>