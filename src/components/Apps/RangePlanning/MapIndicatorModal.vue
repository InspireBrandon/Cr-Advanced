<template>
    <v-dialog v-model="dialog" width="70%" persistent>
        <v-toolbar dark flat color="primary">
            <v-toolbar-title>Map Indicators </v-toolbar-title>
            <v-spacer> </v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close </v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <table style="width: 100%;">
                <thead>
                    <th style="min-width: 130px;">Cluster Type</th>
                    <th>Cluster Value</th>
                    <th>Product</th>
                    <th>Cluster Indicator</th>
                    <th>System Indicator</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in indicators" :key="idx">
                        <td>{{ item.clusterType }}</td>
                        <td>
                            {{item.clusterValue}}
                        </td>
                        <td>
                            {{item.productDescription}}
                        </td>
                        <td v-if="item.useSystem" @click="item.useSystem=false">{{item.clusterIndicator}}</td>
                        <td v-if="!item.useSystem" style="background:red;color:white;">{{item.clusterIndicator}}</td>
                        <td v-if="item.useSystem" style="background:red;color:white;">{{item.systemIndicator}}</td>
                        <td v-if="!item.useSystem" @click="item.useSystem=true">{{item.systemIndicator}}</td>
                        <td class="ma-0;pa-0">
                            <div class="ma-0">
                                <v-btn fab small class="ma-0" icon flat color="red">
                                    <v-icon class="ma-0">check </v-icon>
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                indicators: [{
                    clusterType: "Product 1",
                    useSystem: null,
                    clusterIndicator: "awsd"
                }, {
                    displayName: "Product 1",
                    useSystem: null,
                }],
                callback: null,

            }
        },
        methods: {
            open(callback) {
                let self = this
                self.dialog = true
                self.callback = callback
            }
        }
    }
</script>
<style scoped>
    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>