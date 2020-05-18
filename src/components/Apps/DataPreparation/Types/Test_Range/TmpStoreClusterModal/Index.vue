<template>
    <div>
        <v-dialog v-model="dialog" persistent scrollable width="700">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Edit Temporary Cluster</v-toolbar-title>
                </v-toolbar>
                <!-- <v-card-text class="pb-1">
                    <div style="display: flex;">
                        <div style="padding: 5px; width: 100%;">
                            <h3>Stores</h3>
                            <div class="store-items">
                                <div class="store-item" v-for="(store, idx) in stores" :key="idx"
                                    @click="moveToOtherArray('stores', store)">
                                    {{ store.storeName }}</div>
                            </div>
                        </div>
                        <div style="padding: 5px; width: 100%;">
                            <h3>Selected</h3>
                            <div class="store-items">
                                <div class="store-item" v-for="(store, idx) in selectedStores" :key="idx"
                                    @click="moveToOtherArray('selectedStores', store)">
                                    {{ store.storeName }}</div>
                            </div>
                        </div>
                    </div>
                </v-card-text> -->

                <Grid ref="grid" />

                <v-divider class="mx-3"></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false" color="secondary">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    import Grid from './Grid'

    export default {
        components: {
            Grid
        },
        name: 'RangeSelectorModal',
        data() {
            return {
                dialog: false,
                stores: [],
                selectedStores: []
            }
        },
        mounted() {
            let self = this;
        },
        computed: {},
        methods: {
            show(afterComplete) {
                let self = this;
                self.dialog = true;
                self.$refs.grid.getSelectedStores();
                self.afterComplete = afterComplete;
            },
            moveToOtherArray(currentArray, item) {
                let self = this;

                let newArray = currentArray == 'stores' ? 'selectedStores' : 'stores';

                self[currentArray].splice(self[currentArray].indexOf(item), 1);
                self[newArray].push(item);

                self[currentArray].sort((a, b) => (a.storeName > b.storeName) ? 1 : -1);
                self[newArray].sort((a, b) => (a.storeName > b.storeName) ? 1 : -1);
            }
        }
    }
</script>

<style scoped>
    .store-items {
        border: 1px solid;
        height: 380px;
        overflow-y: scroll;
        width: 100%;
    }

    .store-item {
        padding: 2px;
        border-bottom: 1px solid lightgray;
        cursor: pointer;
    }

    .store-item:hover {
        background: lightgray;
    }
</style>