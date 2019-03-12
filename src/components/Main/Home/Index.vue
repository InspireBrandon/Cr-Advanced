<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md>
            <v-layout row wrap>
                <v-flex lg8 md8 sm12 xs12>
                    <v-container fluid grid-list-md>
                        <v-layout row wrap>
                            <v-flex lg12 md12 sm12 xs12 v-for="i in 3" :key="i">
                                <news-feed></news-feed>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
                <!-- <v-flex lg4 md4 sm4 xs4>
                </v-flex> -->
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import news_feed from '@/components/Main/Home/news_feed.vue';

    export default {
        name: 'home',
        components: {
            'news-feed': news_feed
        },
        created() {
            let self = this;
            self.showLoader = false;
        },
        data() {
            return {
                showLoader: true
            }
        }
    }
</script>