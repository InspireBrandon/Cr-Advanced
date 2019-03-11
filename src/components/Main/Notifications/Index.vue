<template>
    <v-container grid-list-md>
        <v-card>
            <v-layout>
                <v-flex lg12 md12 sm12 xs12>
                    <h1>Notifications</h1>
                </v-flex>
                <v-flex lg12 md12 sm12 xs12>

                    <v-list>
                        <v-list-tile>
                        </v-list-tile>

                        <v-list-tile v-for="(item,index) in notifications" :key="index">
                            <v-flex>{{item.sender}}
                            </v-flex>
                            <v-flex> {{item.message}}
                            </v-flex>
                        </v-list-tile>
                    </v-list>

                </v-flex>
            </v-layout>
        </v-card>
    </v-container>
</template>
<script>
    export default {
        data() {
            return {
                notifications: [{
                    sender: "sender",
                    message: "message"

                }],
            }
        },
        methods: {

        }
    }
</script>