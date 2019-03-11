<template>
    <v-card>
        <v-container grid-list-md>

            <v-layout row wrap>
                <v-flex lg12 md12 sm12 xs12>

                    <v-toolbar>
                        <!-- <v-btn icon >
                            <v-icon>arrow_back_ios</v-icon>
                        </v-btn> -->
                        <v-toolbar-title>Notifications</v-toolbar-title>
                        
                       

                    </v-toolbar>
                </v-flex>
                <v-flex lg12 md12 sm12 xs12>
                    <v-list>
                        <hr>
                        <div v-for="(item,index) in notifications" :key="index">
                            <v-list-tile @click.prevent="openRoute(item.route)">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{item.message}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </div>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
    export default {
        data() {
            return {
                notifications: [],
            }
        },
        created() {
            this.getMessages()
        },
        methods: {
            openRoute(route) {

            },
            getMessages() {
                var self = this
                self.notifications = [{
                    sender: "sender",
                    message: "message"

                }, {
                    sender: "sender",
                    message: "message"

                }, {
                    sender: "sender",
                    message: "message"

                }, {
                    sender: "sender",
                    message: "message"

                }]
            }
        }
    }
</script>