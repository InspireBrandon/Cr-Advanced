<template>
    <div>
        <v-dialog v-model="dialog" persistent scrollable width="600px">
            <v-card>
                <v-card-title style="text-align: center; display: block;" class="headline pa-0">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Select A Retail Chain</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text height="400px" style="overflow: auto;">
                    <v-list dense hover>
                        <template v-for="(retailChain, idx) in retailChains">
                            <v-divider :key="'d' + idx"></v-divider>
                            <v-list-tile :class="{ 'highlighted': selectedRetailChain == retailChain  }" avatar
                                @click="selectedRetailChain = retailChain" :key="idx">
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="retailChain.displayname"></v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-2" color="primary" @click="returnRetailChain">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Dialog ref="dialog"></Dialog>
    </div>
</template>

<script>
    import Axios from 'axios';
    import Dialog from '@/components/Common/Dialog';

    export default {
        name: 'FileSelectorModal',
        components: {
            Dialog
        },
        data() {
            return {
                dialog: false,
                retailChains: [],
                selectedRetailChain: null,
                afterComplete: null
            }
        },
        computed: {
            filteredList() {
                return [];
            }
        },

        methods: {
            getRetailChains() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Retail_Chain")
                    .then(r => {
                        self.retailChains = [{
                            id: null,
                            displayname: "All"
                        }];

                        self.selectedRetailChain = self.retailChains[0];

                        r.data.forEach(element => {
                            self.retailChains.push(element)
                        });
                    })
                    .catch(e => {
                        alert("Failed to get retail chains");
                    })
            },
            show(afterComplete) {
                let self = this;
                self.afterComplete = afterComplete;
                self.getRetailChains();
                self.dialog = true;
            },
            returnRetailChain() {
                let self = this;
                self.afterComplete(self.selectedRetailChain);
                self.dialog = false;
            }
        }
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>