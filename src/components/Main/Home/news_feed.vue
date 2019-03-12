<template>
    <v-card>
        <v-img src="https://picsum.photos/1920/1080" :lazy-src="`https://picsum.photos/1920/1080`" aspect-ratio="2.75">
            <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
            </template>
        </v-img>

        <v-card-title primary-title>
            <div>
                <h3 class="headline mb-0">News feed title</h3>
                <div> {{ card_text }} </div>
            </div>
        </v-card-title>

        <!-- <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
        </v-card-actions> -->
    </v-card>
</template>

<script>
    export default {
        name: 'news_feed',
        data() {
            return {
                card_text: 'news feed text'
            }
        }
    }
</script>