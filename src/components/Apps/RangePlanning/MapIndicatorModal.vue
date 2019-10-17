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
                    <th style="min-width: 130px;">Product</th>
                    <th>Cluster Indicator</th>
                    <th>System Indicator</th>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in indicators" :key="idx">
                        <td>{{ item.displayName }}</td>
                        <td>
                            <input v-model="item.useCluster" @change="handelClusterIndicator(item)"
                                style="width: 100%; text-align: right;" type="checkbox">
                        </td>
                        <td>
                            <input v-model="item.useSystem" @change="handelClusterIndicator(item)"
                                style="width: 100%; text-align: right;" type="checkbox">
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
                    displayName: "Product 1",
                    useCluster: false,
                    useSystem: true,
                }],
                callback:null,

            }
        },methods:{
            open(callback){
                let self = this
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