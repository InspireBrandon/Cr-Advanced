<template>
    <v-container :style="{ background: data.background }" grid-list-md>
        <v-layout row wrap>
            <v-flex lg4 md4 sm4 xs4 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                <h1>{{ data.headline }}</h1>
                <br>
                <p>Description:</p>
                <hr>
                <p>{{data.desciption.desciption}}</p>
                <br>
                <div v-for="(patch,count) in data.patchNotes" :key="count">
                    <p>Patch Notes: {{patch.version}}</p>
                    <hr>
                    <div flat v-for="(item,index) in patch.notes" :key="index">
                        <v-card flat dark>
                            <v-card-title>
                                {{item.type}}:
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-layout>
                                    * {{item.details}}
                                </v-layout>
                            </v-container>
                        </v-card>
                        <br>
                    </div>
                </div>
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
<style>


</style>