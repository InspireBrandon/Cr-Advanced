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
                <v-card-text v-if="reportData != null">
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
                                <td>{{ reportData.current.sales.total_category }}</td>
                                <td>{{ reportData.current.sales.items_selected }}</td>
                                <td>{{ reportData.current.sales.selected_stores }}</td>
                                <td>{{ reportData.current.sales.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Category Units</td>
                                <td>{{ reportData.current.units.total_category }}</td>
                                <td>{{ reportData.current.units.items_selected }}</td>
                                <td>{{ reportData.current.units.selected_stores }}</td>
                                <td>{{ reportData.current.units.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Category Profit</td>
                                <td>{{ reportData.current.profit.total_category }}</td>
                                <td>{{ reportData.current.profit.items_selected }}</td>
                                <td>{{ reportData.current.profit.selected_stores }}</td>
                                <td>{{ reportData.current.profit.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Item Count</td>
                                <td>{{ reportData.current.item_count.total_category }}</td>
                                <td>{{ reportData.current.item_count.items_selected }}</td>
                                <td>{{ reportData.current.item_count.selected_stores }}</td>
                                <td>{{ reportData.current.item_count.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>GP%</td>
                                <td>{{ reportData.current.gross_profit.total_category }}</td>
                                <td>{{ reportData.current.gross_profit.items_selected }}</td>
                                <td>{{ reportData.current.gross_profit.selected_stores }}</td>
                                <td>{{ reportData.current.gross_profit.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Stock On Hand - Units</td>
                                <td>{{ reportData.current.stock_on_hand_units.total_category }}</td>
                                <td>{{ reportData.current.stock_on_hand_units.items_selected }}</td>
                                <td>{{ reportData.current.stock_on_hand_units.selected_stores }}</td>
                                <td>{{ reportData.current.stock_on_hand_units.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Stock On Hand - Cost</td>
                                <td>{{ reportData.current.stock_on_hand_cost.total_category }}</td>
                                <td>{{ reportData.current.stock_on_hand_cost.items_selected }}</td>
                                <td>{{ reportData.current.stock_on_hand_cost.selected_stores }}</td>
                                <td>{{ reportData.current.stock_on_hand_cost.discontinued }}</td>
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
                                <td>{{ reportData.potential.sales.total_category }}</td>
                                <td>{{ reportData.potential.sales.items_selected }}</td>
                                <td>{{ reportData.potential.sales.selected_stores }}</td>
                                <td>{{ reportData.potential.sales.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Potential Units</td>
                                <td>{{ reportData.potential.units.total_category }}</td>
                                <td>{{ reportData.potential.units.items_selected }}</td>
                                <td>{{ reportData.potential.units.selected_stores }}</td>
                                <td>{{ reportData.potential.units.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Potential Profit</td>
                                <td>{{ reportData.potential.profit.total_category }}</td>
                                <td>{{ reportData.potential.profit.items_selected }}</td>
                                <td>{{ reportData.potential.profit.selected_stores }}</td>
                                <td>{{ reportData.potential.profit.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>Item Count</td>
                                <td>{{ reportData.potential.item_count.total_category }}</td>
                                <td>{{ reportData.potential.item_count.items_selected }}</td>
                                <td>{{ reportData.potential.item_count.selected_stores }}</td>
                                <td>{{ reportData.potential.item_count.discontinued }}</td>
                            </tr>
                            <tr>
                                <td>GP%</td>
                                <td>{{ reportData.potential.gross_profit.total_category }}</td>
                                <td>{{ reportData.potential.gross_profit.items_selected }}</td>
                                <td>{{ reportData.potential.gross_profit.selected_stores }}</td>
                                <td>{{ reportData.potential.gross_profit.discontinued }}</td>
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
                reportData: null
            }
        },
        methods: {
            show(reportData) {
                let self = this;
                self.dialog = true;
                self.reportData = reportData;
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