<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar dark color="primary" prominent>
                <v-btn icon @click="modalShow = false">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" icon @click="submit">
                    <v-icon>check</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg3 md3 sm6 xs12 v-for="(featureAccessItem, idx) in featureAccessItems" :key="idx">
                        <v-card light>
                            <v-toolbar dark dense>
                                <h3>{{ featureAccessItem.featureName }}</h3>
                            </v-toolbar>
                            <v-list dense>
                                <v-list-tile avatar>
                                    <v-list-tile-avatar>
                                        <v-icon v-if="featureAccessItem.access">lock_open</v-icon>
                                        <v-icon v-else>lock</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Access</v-list-tile-title>
                                    <v-list-tile-action>
                                        <v-checkbox color="grey darken-1" @change="onAccessChange(featureAccessItem)"
                                            v-model="featureAccessItem.access" hide-details></v-checkbox>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile avatar :disabled="!featureAccessItem.access">
                                    <v-list-tile-avatar>
                                        <v-icon :disabled="!featureAccessItem.access">add</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Create</v-list-tile-title>
                                    <v-list-tile-action>
                                        <v-checkbox color="grey darken-1" :disabled="!featureAccessItem.access" v-model="featureAccessItem.crud_Create"
                                            hide-details></v-checkbox>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile avatar :disabled="!featureAccessItem.access">
                                    <v-list-tile-avatar>
                                        <v-icon :disabled="!featureAccessItem.access">edit</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Modify</v-list-tile-title>
                                    <v-list-tile-action>
                                        <v-checkbox color="grey darken-1" :disabled="!featureAccessItem.access" v-model="featureAccessItem.crud_Update"
                                            hide-details></v-checkbox>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <v-list-tile avatar :disabled="!featureAccessItem.access">
                                    <v-list-tile-avatar>
                                        <v-icon :disabled="!featureAccessItem.access">delete</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Delete</v-list-tile-title>
                                    <v-list-tile-action>
                                        <v-checkbox color="grey darken-1" :disabled="!featureAccessItem.access" v-model="featureAccessItem.crud_Delete"
                                            hide-details></v-checkbox>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    export default {

        data() {
            return {
                modalShow: false,
                features: [],
                featureAccessItems: [],
                tenantID: null,
                systemUserID: null,
                loading: false
            }
        },
        methods: {
            getAccountFeatures(systemUserFeatureAccess) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.featureAccessItems = [];

                Axios.get(process.env.VUE_APP_API + `Features?systemUserID=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.features = r.data;

                        r.data.forEach(feature => {
                            self.featureAccessItems.push(new FeatureAccessItem(feature,
                                systemUserFeatureAccess));
                        })

                        self.modalShow = true;
                    })
            },
            getFeatureAccess() {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemUserFeatureAccess?systemUserID=${self.systemUserID}&tenantID=${self.tenantID}`)
                    .then(r => {
                        self.getAccountFeatures(r.data.systemUserFeatureAccess);
                    })
            },
            open(tenantID, systemUserID) {
                let self = this;
                self.tenantID = tenantID;
                self.systemUserID = systemUserID;
                self.getFeatureAccess();
            },
            close() {
                let self = this
                self.modalShow = false;
            },
            submit() {
                let self = this;

                let request = {
                    tenantID: self.tenantID,
                    systemUserID: self.systemUserID,
                    SystemUserFeatureAccessList: self.featureAccessItems
                }

                self.loading = true;

                Axios.post(process.env.VUE_APP_API + `SystemUserFeatureAccess`, request)
                    .then(r => {
                        self.loading = false;
                        self.modalShow = false
                    })
            },
            onAccessChange(accessItem) {
                let self = this;

                self.$nextTick(() => {
                    if (!accessItem.access)
                        accessItem.setOptionsToFalse();
                })
            }
        }
    }

    function FeatureAccessItem(data, featureAccess) {
        let self = this;

        self.systemUserFeatureAccessID = -1;
        self.systemUserFeatureAccessUID = "";
        self.systemUserTenantLinkID = -1;
        self.featureID = data.featureID;
        self.access = false;
        self.crud_Create = false;
        self.crud_Update = false;
        self.crud_Delete = false;

        self.featureName = data.name;

        featureAccess.forEach(el => {
            if (el.featureID == data.featureID) {
                for (var prop in el)
                    self[prop] = el[prop];
            }
        })

        self.setOptionsToFalse = function () {
            self.crud_Create = false;
            self.crud_Update = false;
            self.crud_Delete = false;
        }
    }
</script>