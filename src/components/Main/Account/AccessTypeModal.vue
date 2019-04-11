<template>
    <v-dialog persistent v-model="modalShow" width="500">
        <v-card>
            <v-toolbar flat dark color="primary">
                <v-toolbar-title>Access Type</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="close" icon>
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg12 md12 sm12 xs12>
                        <v-select :items="types" v-model="form.accessType" label="Type"></v-select>
                    </v-flex>
                    <v-flex v-if="form.accessType == 2" lg12 md12 sm12 xs12>
                        <v-autocomplete multiple :items="planograms" v-model="selectedPlanograms" label="Planograms"></v-autocomplete>
                    </v-flex>
                    <v-flex v-if="form.accessType == 3" lg12 md12 sm12 xs12>
                        <v-autocomplete :items="stores" v-model="form.storeID" label="Store"></v-autocomplete>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="submit" color="primary">save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    export default {
        data() {
            return {
                modalShow: false,
                afterClose: null,
                types: [{
                        text: 'Super User',
                        value: 0
                    },
                    {
                        text: 'Buyer',
                        value: 1
                    },
                    {
                        text: 'Supplier',
                        value: 2
                    },
                    {
                        text: 'Store',
                        value: 3
                    }
                ],
                type: null,
                stores: [],
                store: null,
                planograms: [],
                selectedPlanograms: [],
              form: {
                    accessType: null,
                    storeID: null
                },
                systemUserID: null,
                tenantID: null
            }
        },
        methods: {
            getAccessType(systemUserID, tenantID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                    .then(r => {
                        if (r.data.tenantLink_AccessTypeList.length > 0) {
                            self.form = r.data.tenantLink_AccessTypeList[0];
                        } else {
                            for (var prop in self.form) {
                                self.form[prop] = null
                            }
                        }
                        self.getStores(callback);
                    })
            },
            getStores(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Store?db=CR-HINTERLAND-LIVE")
                    .then(r => {
                        self.stores = [];
                        r.data.forEach(element => {
                            self.stores.push({
                                text: element.storeName,
                                value: element.storeID
                            })
                        });
                        self.getPlanograms(callback);
                    })
            },
            getPlanograms(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Planogram")
                    .then(r => {
                        self.planograms = [];
                        
                        r.data.planogramList.forEach(element => {
                            self.planograms.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });
                        callback();
                    })
            },
            submit() {
                let self = this;

                Axios.post(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${self.systemUserID}&tenantID=${self.tenantID}`, self.form)
                    .then(r => {
                        let accessType = "";

                        switch (self.form.accessType) {
                            case 0:
                                {
                                    accessType = "Super User";
                                }
                                break;
                            case 1:
                                {
                                    accessType = "Buyer";
                                }
                                break;
                            case 2:
                                {
                                    accessType = "Supplier";
                                }
                                break;
                            case 3:
                                {
                                    accessType = "Store";
                                }
                                break;
                        }

                        self.afterClose(accessType);
                        self.close();
                    })
            },
            close() {
                let self = this
                self.modalShow = false
            },
            open(systemUserID, tenantID, callback) {
                let self = this;

                self.getAccessType(systemUserID, tenantID, function () {
                    self.type = null;
                    self.store = null;
                    self.systemUserID = systemUserID;
                    self.tenantID = tenantID;
                    self.afterClose = callback;
                    self.modalShow = true
                })
            }
        }
    }
</script>