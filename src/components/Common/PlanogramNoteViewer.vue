<template>
    <div>
        <v-card flat>
            <v-card-text class="pa-0" style="height: calc(100vh - 160px); overflow-y: scroll;">
                <v-container fluid grid-list-xs>
                    <v-layout row wrap>
                        <template v-for="(item, idx) in items">
                            <v-flex xs7 :key="idx">
                                <v-card flat style="border: 1px solid lightgrey">
                                    <v-toolbar flat color="white">
                                        <v-toolbar-title>
                                            {{ item.userName }}
                                        </v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click="editTransaction(item)">
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn icon @click="deleteTransaction(item)">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </v-toolbar>
                                    <v-card-text class="px-4 py-0">
                                        <div class="anyimg" v-html="item.html"></div>
                                    </v-card-text>
                                    <v-card-actions class="px-4">
                                        <v-spacer></v-spacer>
                                        <span class="font-weight-light"
                                            style="font-size: 12px">{{ newFullDate(item.dateTime) }}</span>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </template>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-text-field solo></v-text-field>
        </v-card>
        <PlanogramNoteModal ref="PlanogramNoteModal" />
        <YesNoModal ref="YesNoModal" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from "jsonwebtoken";
    import PlanogramNoteModal from '@/components/Common/PlanogramNoteModal';
    import YesNoModal from '@/components/Common/YesNoModal';

    export default {
        components: {
            PlanogramNoteModal,
            YesNoModal
        },
        data() {
            return {
                items: [],
                systemUserID: null,
                selectedType: null,
                selectedValue: null
            }
        },
        mounted() {
            let self = this;
            let encoded_details = jwt.decode(sessionStorage.accessToken);
            self.systemUserID = encoded_details.USER_ID;
        },
        methods: {
            getTransactions(type, value) {
                let self = this;

                self.selectedType = type;
                self.selectedValue = value;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PlanogramNoteTX?type=${type}&value=${value}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.items = r.data;
                    })
            },
            refresh() {
                let self = this;

                self.getTransactions(self.selectedType, self.selectedValue)
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
            editTransaction(item) {
                let self = this;

                self.$refs.PlanogramNoteModal.showEdit(item, data => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.put(process.env.VUE_APP_API + "PlanogramNoteTX", data)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            self.refresh();
                        })
                })
            },
            deleteTransaction(item) {
                let self = this;

                self.$refs.YesNoModal.show("Delete note?", val => {
                    if (val) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `PlanogramNoteTX?id=${item.id}`)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];

                                self.refresh();
                            })
                    }
                })
            }
        }
    }
</script>

<style>
    .anyimg img {
        max-width: 60%;
    }
</style>