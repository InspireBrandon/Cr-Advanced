<template>
    <div>
        <v-card flat>
            <v-card-text class="pa-0" style="height: calc(100vh - 200px); overflow-y: scroll;">
                <v-container fluid grid-list-xs>
                    <v-layout row wrap>
                        <template v-for="(item, idx) in items">
                            <v-flex v-if="item.userID == systemUserID" xs5 :key="idx + 'o'"></v-flex>
                            <v-flex xs7 :key="idx">
                                <v-card>
                                    <v-card-text>
                                        <div class="font-weight-bold">{{ item.userName }}</div>
                                        <div v-html="item.html"></div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <div class="font-weight-light">{{ item.dateTime }}</div>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </template>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-text-field solo></v-text-field>
        </v-card>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from "jsonwebtoken";

    export default {
        data() {
            return {
                items: [],
                systemUserID: null
            }
        },
        mounted() {
            let self = this;
            let encoded_details = jwt.decode(sessionStorage.accessToken);
            self.systemUserID = encoded_details.USER_ID;

            self.getTransactions();
        },
        methods: {
            getTransactions() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PlanogramNoteTX?planogramID=28`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.items = r.data;
                    })
            }
        }
    }
</script>