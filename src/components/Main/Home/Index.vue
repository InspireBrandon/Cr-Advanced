<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" justify-center fluid grid-list-md align-center>
            <v-layout row wrap justify-center>
                <v-flex md5>
                    <v-layout row wrap>
                        <v-flex md12>
                            <v-card>
                                <v-img
                                    src="https://png.pngtree.com/thumb_back/fh260/back_pic/03/68/74/1657b3cea5bb265.jpg">
                                    <v-layout pa-2 column fill-height class="lightbox white--text">
                                        <v-spacer></v-spacer>
                                        <v-flex shrink style="margin-left: 20px;">
                                            <h2>Welcome Back John</h2>
                                            <div class="subheading">You are currently connected to CR-Hinterland-Live
                                            </div>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                    </v-layout>
                                </v-img>
                            </v-card>
                        </v-flex>
                        <v-flex md12>
                            <v-card>
                                <v-card-title>
                                    <h2>Recent Projects</h2>
                                    <v-spacer></v-spacer>
                                    <!-- <v-btn flat small class="pa-0 ma-0">
                                        <span>view all</span>
                                        <v-icon>arrow_right_alt</v-icon>
                                    </v-btn> -->
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-list class="pa-0">
                                    <template>
                                        <template v-for="(item, index) in items">
                                            <v-list-tile :key="item.title" @click="">
                                                <v-list-tile-content>
                                                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                                                </v-list-tile-content>
                                                <v-spacer></v-spacer>
                                                <v-list-tile-action>
                                                    <div class="subheading">2019-01-01</div>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-divider :key="'d' + item.title"></v-divider>
                                        </template>
                                    </template>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex md3>
                    <v-layout row wrap>
                        <v-flex md12>
                            <v-card>
                                <v-card-title>
                                    <h2>Activity</h2>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <span>Planograms Approved</span>
                                    <span style="margin-left: 5px;">(1/4)</span>
                                    <v-progress-linear class="my-1" v-model="valueDeterminate"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md12>
                            <v-card>
                                <v-card-title>
                                    <h2>Quick Links</h2>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-layout row wrap>
                                        <v-flex md2>
                                            <v-img
                                                src="https://99designs-blog.imgix.net/wp-content/uploads/2017/04/attachment_82290822-e1492536097660.png?auto=format&q=60&fit=max&w=930">
                                            </v-img>
                                        </v-flex>
                                        <v-flex md2>
                                            <v-img
                                                src="https://99designs-blog.imgix.net/wp-content/uploads/2017/04/attachment_82290822-e1492536097660.png?auto=format&q=60&fit=max&w=930">
                                            </v-img>
                                        </v-flex>
                                        <v-flex md2>
                                            <v-img
                                                src="https://99designs-blog.imgix.net/wp-content/uploads/2017/04/attachment_82290822-e1492536097660.png?auto=format&q=60&fit=max&w=930">
                                            </v-img>
                                        </v-flex>
                                        <v-flex md2>
                                            <v-img
                                                src="https://99designs-blog.imgix.net/wp-content/uploads/2017/04/attachment_82290822-e1492536097660.png?auto=format&q=60&fit=max&w=930">
                                            </v-img>
                                        </v-flex>
                                        <v-flex md2>
                                            <v-img
                                                src="https://99designs-blog.imgix.net/wp-content/uploads/2017/04/attachment_82290822-e1492536097660.png?auto=format&q=60&fit=max&w=930">
                                            </v-img>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
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
            this.takePulse(false)
        },
        data() {
            return {
                valueDeterminate: 25,
                showLoader: true,
                active: null,
                text: "ASDF",
                headers: [{
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {
                        text: 'Last opened',
                        align: 'left',
                        sortable: false,
                        value: 'lo',
                    }
                ],
                desserts: [{
                        name: 'File 1',
                        lo: '14 March',
                    },
                    {
                        name: 'File 2',
                        lo: '14 March',
                    }, {
                        name: 'File 3',
                        lo: '14 March',
                    }, {
                        name: 'File 4',
                        lo: '14 March',
                    }, {
                        name: 'File 5',
                        lo: '14 March',
                    }
                ],
                checking: false,
                heartbeats: [],
                items: [{
                        title: 'File 1',
                        subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
                    },
                    {
                        title: 'File 2',
                        subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
                    },
                    {
                        title: 'File 3',
                        subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
                    },
                    {
                        title: 'File 4',
                        subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
                    },
                    {
                        title: 'File 5',
                        subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
                    }
                ]
            }
        },
        computed: {
            avg() {
                const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0)
                const length = this.heartbeats.length

                if (!sum && !length) return 0

                return Math.ceil(sum / length)
            }
        },
        methods: {
            heartbeat() {
                return Math.ceil(Math.random() * (120 - 80) + 80)
            },
            async takePulse(inhale = true) {
                this.checking = true

                inhale && await exhale(1000)

                this.heartbeats = Array.from({
                    length: 20
                }, this.heartbeat)

                this.checking = false
            }
        }
    }
</script>