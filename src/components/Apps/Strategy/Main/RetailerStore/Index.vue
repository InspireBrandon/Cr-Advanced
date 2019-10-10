<template>
    <v-dialog v-model="dialog" persistent width="1000px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>{{ retailerName }} Stores</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <v-spacer></v-spacer>
                <v-btn @click="uploadMany" color="grey darken-3">Add Many</v-btn>
                <v-btn @click="addRetailerStore" color="grey darken-3">Add Single</v-btn>
            </v-toolbar>
            <v-card-text class="pa-0" style="height: 600px; overflow: auto;">
                <Grid :deleteRetailerStore="deleteRetailerStore" :updateRetailerStore="updateRetailerStore"
                    :rowData="retailerStores" ref="Grid" />
            </v-card-text>
        </v-card>
        <YesNoModal ref="YesNoModal" />
        <CopyPasteModal ref="CopyPasteModal" />
    </v-dialog>

</template>
<script>
    import Axios from 'axios'
    import Grid from './Grid'
    import YesNoModal from '@/components/Common/YesNoModal'
    import CopyPasteModal from '../CopyPasteModal'

    export default {
        components: {
            Grid,
            YesNoModal,
            CopyPasteModal
        },
        data() {
            return {
                retailerName: '',
                retailerID: -1,
                dialog: false,
                callback: null,
                selected: null,
                retailerStores: [],
            }
        },
        methods: {
            getRetailerStores(retailerID) {
                let self = this

                Axios.get(process.env.VUE_APP_API + "RetailerStore?retailerID=" + retailerID)
                    .then(r => {
                        self.retailerStores = r.data.retailerStoreList;
                    })
            },
            open(retailer, callback) {
                let self = this
                self.retailerName = retailer.name;
                self.retailerID = retailer.id;
                self.getRetailerStores(retailer.id);
                self.callback = callback
                self.dialog = true
            },
            close() {
                let self = this
                self.dialog = false
                self.callback()
            },
            addRetailerStore() {
                let self = this;

                Axios.post(process.env.VUE_APP_API + "RetailerStore", {
                        retailerID: self.retailerID,
                        name: ''
                    })
                    .then(r => {
                        self.retailerStores.unshift(r.data.retailerStore);
                    })
            },
            uploadMany() {
                let self = this;
                
                self.$refs.CopyPasteModal.open(data => {
                    console.log(data);
                })
            },
            updateRetailerStore(e) {
                let self = this;

                if (e.newValue != e.oldValue) {
                    self.updateRetailerStoreTX(e.data);
                }
            },
            updateRetailerStoreTX(item) {
                let self = this;

                Axios.put(process.env.VUE_APP_API + "RetailerStore", item)
                    .then(r => {

                    })
            },
            deleteRetailerStore(retailerStore) {
                let self = this;

                self.$refs.YesNoModal.show("Are you sure that you want to delete this retailer store?", value => {
                    if (value) {
                        Axios.delete(process.env.VUE_APP_API + "RetailerStore?retailerStoreID=" + retailerStore.id)
                            .then(r => {
                                self.retailerStores.splice(self.retailerStores.indexOf(retailerStore), 1);
                            })
                    }
                })
            }
        }
    }
</script>