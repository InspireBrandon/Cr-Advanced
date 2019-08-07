<template>
    <div>
        <v-dialog persistent v-model="dialog" width="500">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Auto Range Configuration</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <table>
                        <tbody>
                            <tr>
                                <td>Sales Index</td>
                                <td style="text-align: center;">></td>
                                <td style="padding: 0px!important; width: 100px">
                                    <input v-model="sales_index" style="width: 100%; text-align: right;" type="number">
                                </td>
                            </tr>
                            <tr>
                                <td>Profit Index</td>
                                <td style="text-align: center;">></td>
                                <td style="padding: 0px!important;">
                                    <input v-model="profit_index" style="width: 100%; text-align: right;" type="number">
                                </td>
                            </tr>
                            <tr>
                                <td>Volume Index</td>
                                <td style="text-align: center;">></td>
                                <td style="padding: 0px!important;">
                                    <input v-model="volume_index" style="width: 100%; text-align: right;" type="number">
                                </td>
                            </tr>
                            <tr>
                                <td>Sales</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="sales" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Volume</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="volume" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Profit</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="profit" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Potential Sales</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_sales" style="width: 80%; text-align: right;"
                                            type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Potential Volume</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_volume" style="width: 80%; text-align: right;"
                                            type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Potential Profit</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_profit" style="width: 80%; text-align: right;"
                                            type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Audit</td>
                                <td style="text-align: center;">On/Off</td>
                                <td style="padding: 0px!important;">
                                    <input v-model="audit" type="checkbox" style="width: 100%;">
                                </td>
                            </tr>
                            <tr>
                                <td>DOS Units</td>
                                <td style="text-align: center;">Value</td>
                                <td style="padding: 0px!important;">
                                    <input v-model="dos_units" type="number" style="width: 100%;">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="submit">Save</v-btn>
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
                sales_index: 100,
                profit_index: 100,
                volume_index: 100,
                sales: 80,
                volume: 80,
                profit: 80,
                potential_sales: 80,
                potential_volume: 80,
                potential_profit: 80,
                audit: false,
                dos_units: 6,
                afterComplete: null
            }
        },
        methods: {
            show(config, afterComplete) {
                let self = this;
                self.afterComplete = afterComplete;

                self.sales_index = config.sales_index;
                self.profit_index = config.profit_index;
                self.volume_index = config.volume_index;
                self.sales = config.sales;
                self.volume = config.volume;
                self.profit = config.profit;
                self.potential_sales = config.potential_sales;
                self.potential_volume = config.potential_volume;
                self.potential_profit = config.potential_profit;
                self.dos_units = config.dos_units;
                self.audit = config.audit;

                self.dialog = true;
            },
            submit() {
                let self = this;
                self.dialog = false;

                let arc = {
                    sales_index: self.sales_index,
                    profit_index: self.profit_index,
                    volume_index: self.volume_index,
                    sales: self.sales,
                    volume: self.volume,
                    profit: self.profit,
                    potential_sales: self.potential_sales,
                    potential_volume: self.potential_volume,
                    potential_profit: self.potential_profit,
                    audit: self.audit,
                    dos_units: self.dos_units
                }

                self.afterComplete(arc);
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