<template>
    <div>
        <v-dialog v-model="dialog" width="800" persistent>
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Store Cluster Setup</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container grid-list-md class="pa-0">
                        <v-layout row wrap>
                            <v-flex md12>
                                <v-switch v-model="useSystemValues" hide-details label="Use system values"></v-switch>
                            </v-flex>
                            <v-flex md4>
                                <v-checkbox color="primary" v-for="(item, idx) in items" :key="idx" v-model="selected" :value="item"
                                    hide-details :label="item"></v-checkbox>
                            </v-flex>
                            <v-flex md8>
                                <v-card flat>
                                    <v-list dense>
                                        <v-list-tile v-for="(item, idx) in selected" :key="idx">
                                            <v-list-tile-avatar>{{ (idx + 1) }}</v-list-tile-avatar>
                                            <v-list-tile-content>{{ item }}</v-list-tile-content>
                                            <v-btn @click="swapUp(idx)" flat small :disabled="idx == 0"
                                                style="width: 30px">
                                                <v-icon>arrow_upward</v-icon>
                                            </v-btn>
                                            <v-btn @click="swapDown(idx)" flat small style="width: 30px"
                                                :disabled="idx == selected.length - 1">
                                                <v-icon>arrow_downward</v-icon>
                                            </v-btn>
                                            <v-icon @click="remove(idx)">close</v-icon>
                                        </v-list-tile>
                                    </v-list>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
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
        data() {
            return {
                dialog: false,
                afterComplete: null,
                selected: [],
                useSystemValues: false,
                items: []
            }
        },
        methods: {
            show(items, afterComplete) {
                let self = this;
                self.items = [];
                self.dialog = true;

                items = JSON.parse(JSON.stringify(items))

                items = items.splice(4, items.length - 1);

                items.forEach(el => {
                    self.items.push(el.headerName);
                })

                self.afterComplete = afterComplete;
            },
            returnSetupConfig() {
                let self = this;

                self.dialog = false;
                self.afterComplete({
                    selectedItems: self.selected,
                    useSystemValues: self.useSystemValues
                });
            },
            remove(idx) {
                let self = this;
                self.selected.splice(idx, 1);
            },
            swapUp(index) {
                let self = this;

                let aboveIndex = index - 1;

                self.swapArrayElements(index, aboveIndex);
            },
            swapDown(index) {
                let self = this;

                let belowIndex = index + 1;

                self.swapArrayElements(belowIndex, index);
            },
            swapArrayElements(indexA, indexB) {
                let self = this;
                let tmpArr = JSON.parse(JSON.stringify(self.selected));

                var temp = tmpArr[indexA];
                tmpArr[indexA] = tmpArr[indexB];
                tmpArr[indexB] = temp;

                self.selected = tmpArr;
            },
        }
    }
</script>