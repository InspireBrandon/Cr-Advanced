<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md>
            <v-layout row wrap>
                <v-flex lg12 md12 sm12 xs12>
                    <v-card flat color="transparent">
                        <h3>Features</h3>
                        <v-layout class="pa-0" row wrap>
                            <v-flex lg2 md3 sm4 xs6 v-for="i in 6">
                                <v-card color="transparent" class="elevation-0" style="text-align: center;">
                                    <div>
                                        <img style="width: 45px; height: 45px;" src="https://icons-for-free.com/free-icons/png/512/2697649.png">
                                    </div>
                                    App Name
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex lg12 md12 sm12 xs12>
                    <v-card flat color="transparent">
                        <h3>Documents</h3>
                        <v-tabs v-model="active" color="transparent" slider-color="red darken-3">
                            <v-tab ripple>Recent</v-tab>
                            <v-tab ripple>Pinned</v-tab>
                            <v-tab ripple>Shared with me</v-tab>
                            <v-tab-item v-for="n in 3" :key="n">
                                <v-card color="transparent" flat>
                                    <v-data-table color="transparent" :headers="headers" :items="desserts" :search="search" hide-actions
                                        :pagination.sync="pagination" class="elevation-0">
                                        <template v-slot:items="props">
                                            <td>
                                                <v-icon color="grey lighten-1">file_copy</v-icon>
                                                {{ props.item.name }}
                                            </td>
                                            <td>{{ props.item.lo }}</td>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-tab-item>
                        </v-tabs>
                    </v-card>
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
        },
        data() {
            return {
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
                ]
            }
        }
    }
</script>