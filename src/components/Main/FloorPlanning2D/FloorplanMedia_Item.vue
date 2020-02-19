<template>
    <v-card height="200" width="200" flat @click="handleFolder(item)" :class="{ 'highlighted': selectedimage == item}">
        <v-card-text v-if="item.file!=null">
            <v-img :src="imageSrc(item.id) == '' ? tmpImageURL : imageSrc(item.id)" aspect-ratio="1"
                class="grey lighten-2" width="100%" height="100" style="cursor: pointer;"></v-img>
        </v-card-text>
        <v-card-text v-else>
            <v-icon style="cursor: pointer;" size="100" v-if="item.type=='back'">backspace</v-icon>
            <v-icon  style="cursor: pointer;" size="100" v-else>folder</v-icon>
        </v-card-text>
        <v-card-title v-if="EditName==true">
            <v-text-field v-on:keyup.enter="endEdit" v-model="item.name" v-on:blur="endEdit">
            </v-text-field>
        </v-card-title>
        <v-card-title v-else>
            {{item.name}}
        </v-card-title>
    </v-card>
</template>
<script>
    import axios from "axios"
    export default {
        props: ["item", "handleFolder", "selectedimage", "EditName","Rename"],
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
            },
            endEdit() {
                let self = this
                console.log("end edit");

                let req = {
                    id:self.item.id,
                    parent_ID: self.item.parentID,
                    name: self.item.name,
                    folder: self.item.folder,
                    file: self.item.file
                }
                axios.post(process.env.VUE_APP_API + `FloorplanMedia/save`, req).then(r => {
                    console.log("end Edit", r);
                    self.Rename(self.item)
                })

            }
        }
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2 !important;
    }
</style>