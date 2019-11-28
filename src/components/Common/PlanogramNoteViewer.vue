<template>
    <div>
        <v-card flat>
            <v-card-text class="pa-0" style="height: calc(100vh - 160px); overflow-y: scroll;">
                <v-container fluid grid-list-xs>
                    <v-layout row wrap>
                        <template v-for="(item, idx) in items">
                            <v-flex xs7 :key="idx">
                                <v-card flat style="border: 1px solid lightgrey">
                                    <v-card-text>
                                        <div>
                                            <span class="font-weight-bold">{{ item.userName }}</span>
                                        </div>
                                        <div v-html="item.html"></div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <span class="font-weight-light" style="font-size: 12px">{{ newFullDate(item.dateTime) }}</span>
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
        },
        methods: {
            getTransactions(type, planogramID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PlanogramNoteTX?type=${type}&planogramID=${planogramID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.items = r.data;
                    })
            },
            newFullDate(date) {
                let self = this;
                var d = new Date(date);
                return (
                    d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2)
                );
            },
        }
    }
</script>