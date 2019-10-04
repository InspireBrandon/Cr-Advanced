<template>
    <v-dialog v-model="dialog" persistent width="500px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Select System Store</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text style="height: 260px; overflow: auto;">
                <v-container grid-list-md fluid class="pa-0 ma-0">
                    <v-layout row wrap>
                        <v-flex md12>
                            <v-autocomplete @change="getLocationFile" v-model="selectedRetailerGroup"
                                :items="retailerGroups" label="Location Group"></v-autocomplete>
                        </v-flex>
                        <v-flex md12>
                            <v-autocomplete @change="getLocation" v-model="selectedRetailer" :items="retailers"
                                label="Location File">
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md12>
                            <v-autocomplete v-model="selectedRetailerStore" :items="retailerStores" label="Location">
                            </v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <Prompt ref="Prompt" />
            <YesNoModal ref="YesNoModal" />
        </v-card>
        <v-card-actions class="pa-0">
            <v-toolbar flat>
                <v-spacer></v-spacer>
                <v-btn @click="close" color="primary">Select</v-btn>
            </v-toolbar>
        </v-card-actions>
    </v-dialog>

</template>
<script>
    import Axios from 'axios'
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                retailerGroups: [],
                selectedRetailerGroup: null,
                retailers: [],
                selectedRetailer: null,
                retailerStores: [],
                selectedRetailerStore: null
            }
        },
        components: {
            Prompt,
            YesNoModal
        },
        methods: {
            show(callback) {
                let self = this;
                self.getLocationGroups();
                self.selectedRetailerStore = null;
                self.callback = callback
                self.dialog = true
            },
            close() {
                let self = this
                self.dialog = false
                self.callback(self.selectedRetailerStore);
            },
            getLocationGroups() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "RetailerGroup")
                    .then(r => {
                        self.retailerGroups = [];
                        let retailerGroupList = r.data.retailerGroupList;

                        retailerGroupList.forEach(el => {
                            self.retailerGroups.push({
                                text: el.name,
                                value: el.id
                            })
                        });
                    })
            },
            getLocationFile() {
                let self = this;

                self.$nextTick(() => {
                    Axios.get(process.env.VUE_APP_API + "Retailer?retailerGroupID=" + self
                            .selectedRetailerGroup)
                        .then(r => {
                            self.retailers = [];
                            let retailers = r.data.retailerList;

                            retailers.forEach(el => {
                                self.retailers.push({
                                    text: el.name,
                                    value: el.id
                                })
                            });
                        })
                })
            },
            getLocation() {
                let self = this;

                self.$nextTick(() => {
                    Axios.get(process.env.VUE_APP_API + "RetailerStore?retailerID=" + self.selectedRetailer)
                        .then(r => {
                            self.retailerStores = [];
                            let retailerStores = r.data.retailerStoreList;

                            retailerStores.forEach(el => {
                                self.retailerStores.push({
                                    text: el.name,
                                    value: el.id
                                })
                            });
                        })
                })
            }
        }
    }
</script>