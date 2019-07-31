<template>
    <div>
        <v-dialog persistent v-model="dialog" width="700">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Range Report</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <table>
                        <thead>
                            <tr>
                                <th>Current</th>
                                <th>Total Category</th>
                                <th>Items Selected</th>
                                <th>Selected Stores</th>
                                <th>Discontinued</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Category Sales</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Category Units</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Category Profit</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Item Count</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>GP%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Stock On Hand - Units</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Stock On Hand - Cost</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <v-divider class="my-2"></v-divider>
                    <table>
                        <thead>
                            <tr>
                                <th>Sales Potential</th>
                                <th>Total Category</th>
                                <th>Items Selected</th>
                                <th>Selected Stores</th>
                                <th>Discontinued</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Potential Sales</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Potential Units</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Potential Profit</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Item Count</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>GP%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Stock On Hand - Units</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Stock On Hand - Cost</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </v-card-text>

                <!-- <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog = false">Print</v-btn>
                </v-card-actions> -->
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                sales_index: 100,
                profit_index: 100,
                volume_index: 100,
                sales: 80,
                volume: 80,
                profit: 80,
                potential_sales: 80,
                potential_volume: 80,
                potential_profit: 80,
                audit: false
            }
        },
        methods: {
            show(autoRangeData) {
                let self = this;
                self.dialog = true;
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px 5px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>