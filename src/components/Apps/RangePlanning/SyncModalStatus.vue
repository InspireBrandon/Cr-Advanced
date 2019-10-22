<template>
    <div>
        <v-dialog persistent v-model="dialog" width="800">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Range Sync Report</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-container grid-list-xs>
                        <v-layout row wrap>
                            <!-- INDICATORS -->
                            <v-flex md2>
                                <span>Indicators</span>
                            </v-flex>
                            <v-flex md2>
                                <v-progress-circular
                                    v-if="indicators == true && indicatorMessage == '' && currentLoading == 'indicators'"
                                    class="ml-3" width="3" size="20" indeterminate color="primary">
                                </v-progress-circular>
                                <v-icon class="ml-3" v-if="indicators == true && indicatorMessage == 'Success'"
                                    color="success">check</v-icon>
                                <v-icon class="ml-3" v-if="indicators == false" color="error">close</v-icon>
                            </v-flex>
                            <v-flex md8>{{ indicatorMessage }}</v-flex>
                            <!-- PRODUCTS -->
                            <v-flex md2 class="mt-3">
                                <span>Products</span>
                            </v-flex>
                            <v-flex md2 class="mt-3">
                                <v-progress-circular
                                    v-if="products == true && productMessage == '' && currentLoading == 'products'"
                                    class="ml-3" width="3" size="20" indeterminate color="primary">
                                </v-progress-circular>
                                <v-icon class="ml-3" v-if="products == true && productMessage == 'Success'"
                                    color="success">check</v-icon>
                                <v-icon class="ml-3" v-if="products == false" color="error">close</v-icon>
                            </v-flex>
                            <v-flex md8 class="mt-3">{{ productMessage }}</v-flex>
                            <!-- ACTIVE SHOP CODES -->
                            <v-flex md2 class="mt-3">
                                <span>Active Shop Codes</span>
                            </v-flex>
                            <v-flex md2 class="mt-3">
                                <v-progress-circular
                                    v-if="products == true && productMessage == '' && currentLoading == 'activeShopCodes'"
                                    class="ml-3" width="3" size="20" indeterminate color="primary">
                                </v-progress-circular>
                                <v-icon class="ml-3" v-if="products == true && productMessage == 'Success'"
                                    color="success">check</v-icon>
                                <v-icon class="ml-3" v-if="products == false" color="error">close</v-icon>
                            </v-flex>
                            <v-flex md8 class="mt-3">{{ productMessage }}</v-flex>
                            <!-- CLUSTERING -->
                            <v-flex md2 class="mt-3">
                                <span>Clusters</span>
                            </v-flex>
                            <v-flex md2 class="mt-3">
                                <v-progress-circular
                                    v-if="clusters == true && clusterMessage == '' && currentLoading == 'clusters'"
                                    class="ml-3" width="3" size="20" indeterminate color="primary">
                                </v-progress-circular>
                                <v-icon class="ml-3" v-if="clusters == true && clusterMessage == 'Success'"
                                    color="success">check</v-icon>
                                <v-icon class="ml-3" v-if="products == false" color="error">close</v-icon>
                            </v-flex>
                            <v-flex md8 class="mt-3">{{ clusterMessage }}</v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false" :disabled="!canContinue" color="primary">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                indicators: true,
                indicatorMessage: "",
                products: true,
                productMessage: "",
                activeShopCodes: true,
                activeShopCodeMessage: "",
                clusters: true,
                clusterMessage: "",
                currentLoading: "",
                canContinue: false
            }
        },
        methods: {
            show() {
                let self = this;
                self.dialog = true;
            },
            updateStatus(outputObj) {
                let self = this;

                for (var prop in outputObj) {
                    self[prop] = outputObj[prop];
                }
            }
        }
    }
</script>

<style scoped>
</style>