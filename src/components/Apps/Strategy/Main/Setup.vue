<template>
    <div>
        <v-dialog v-model="dialog" width="800" persistent>
            <v-card style="overflow: auto;">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Cluster Setup</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <div class="text-xs-left mt-0">
                        <div class="ml-2">Store</div>
                        <v-chip label color="primary" text-color="white">Store</v-chip>
                    </div>
                    <div class="text-xs-left mt-1">
                        <div class="ml-2">Basket</div>
                        <v-chip label color="primary" text-color="white">Premium Basket</v-chip>
                        <v-chip label color="primary" text-color="white">Sheep Farming</v-chip>
                        <v-chip label color="primary" text-color="white">Cattle Farming</v-chip>
                        <v-chip label color="primary" text-color="white">Dairy Farming</v-chip>
                    </div>
                    <div class="text-xs-left mt-1">
                        <div class="ml-2">Listing</div>
                        <v-chip label color="primary" text-color="white">ADHESIVES AND SEALANTS</v-chip>
                        <v-chip label color="primary" text-color="white">AIR RIFLES AND BB GUNS</v-chip>
                        <v-chip label color="primary" text-color="white">AMMUNITION</v-chip>
                    </div>
                    <div class="text-xs-left mt-1">
                        <div class="ml-2">Custom</div>
                        <v-chip label color="primary" text-color="white">SWAVET</v-chip>
                    </div>
                    <div class="text-xs-left mt-5">
                        <div class="ml-2 headline">Final Cluster</div>
                        <v-chip label color="success" text-color="white">Store</v-chip>
                        <v-chip label color="success" text-color="white">Premium Basket</v-chip>
                    </div>
                </v-card-text>
                <v-divider class="mx-2"></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="returnSetupConfig">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'RangeSelectorModal',
        data() {
            return {
                dialog: false,
                afterComplete: null
            }
        },
        methods: {
            show(afterComplete) {
                let self = this;
                self.dialog = true;
                self.afterComplete = afterComplete;
            },
            returnSetupConfig() {
                let self = this;

                self.dialog = false;
                self.afterComplete();
            }
        }
    }
</script>