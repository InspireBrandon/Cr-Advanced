<template>
    <div>
        <v-dialog persistent v-model="dialog" width="800">
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
                                <td style="padding: 02px!important;">
                                    <input v-model="use_sales_index" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Sales Index</td>
                                <td style="text-align: center;">></td>
                                <td style="padding: 0px!important; width: 100px">
                                    <input v-model="sales_index" style="width: 100%; text-align: right;" type="number">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_profit_index" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Profit Index</td>
                                <td style="text-align: center;">></td>
                                <td style="padding: 02px!important;">
                                    <input v-model="profit_index" style="width: 100%; text-align: right;" type="number">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_volume_index" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Volume Index</td>
                                <td style="text-align: center;">></td>
                                <td style="padding: 02px!important;">
                                    <input v-model="volume_index" style="width: 100%; text-align: right;" type="number">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_sales" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Sales</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 02px!important;">
                                    <div style="display: flex;">
                                        <input v-model="sales" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_volume" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Volume</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 02px!important;">
                                    <div style="display: flex;">
                                        <input v-model="volume" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_profit" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Profit</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 02px!important;">
                                    <div style="display: flex;">
                                        <input v-model="profit" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_potential_sales" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Potential Sales</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 02px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_sales" style="width: 80%; text-align: right;"
                                            type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_potential_volume" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Potential Volume</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 02px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_volume" style="width: 80%; text-align: right;"
                                            type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_potential_profit" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Potential Profit</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 02px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_profit" style="width: 80%; text-align: right;"
                                            type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                    <input v-model="use_audit" type="checkbox" style="width: 100%;">
                                </td>
                                <td>Audit</td>
                                <td style="text-align: center;">On/Off</td>
                                <td style="padding: 02px!important;">
                                    <input v-model="audit" type="checkbox" style="width: 100%;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 02px!important;">
                                </td>
                                <td>DOS Units</td>
                                <td style="text-align: center;">Value</td>
                                <td style="padding: 02px!important;">
                                    <input v-model="dos_units" style="width: 80%; text-align: right;"
                                        type="number">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" flat @click="defaults">Default</v-btn>
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
                use_sales_index: true,
                use_profit_index: true,
                use_volume_index: true,
                use_sales: true,
                use_volume: true,
                use_profit: true,
                use_potential_sales: true,
                use_potential_volume: true,
                use_potential_profit: true,
                use_audit: true,
                sales_index: 100,
                profit_index: 100,
                volume_index: 100,
                sales: 60,
                volume: 60,
                profit: 60,
                potential_sales: 60,
                potential_volume: 60,
                potential_profit: 60,
                audit: false,
                dos_units: 6,
                afterComplete: null
            }
        },
        methods: {
            defaults() {
                let self = this;

                self.sales_index = 100;
                self.profit_index = 100;
                self.volume_index = 100;
                self.sales = 60;
                self.volume = 60;
                self.profit = 60;
                self.potential_sales = 60;
                self.potential_volume = 60;
                self.potential_profit = 60;
                self.dos_units = 6;
                self.audit = false;

                self.use_sales_index = true;
                self.use_profit_index = true
                self.use_volume_index = true
                self.use_sales = true
                self.use_volume = true
                self.use_profit = true
                self.use_potential_sales = true
                self.use_potential_volume = true
                self.use_potential_profit = true
                self.use_audit = true
            },
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

                self.use_sales_index = config.use_sales_index;
                self.use_profit_index = config.use_profit_index
                self.use_volume_index = config.use_volume_index
                self.use_sales = config.use_sales
                self.use_volume = config.use_volume
                self.use_profit = config.use_profit
                self.use_potential_sales = config.use_potential_sales
                self.use_potential_volume = config.use_potential_volume
                self.use_potential_profit = config.use_potential_profit
                self.use_audit = config.use_audit

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
                    dos_units: self.dos_units,

                    use_sales_index: self.use_sales_index,
                    use_profit_index: self.use_profit_index,
                    use_volume_index: self.use_volume_index,
                    use_sales: self.use_sales,
                    use_volume: self.use_volume,
                    use_profit: self.use_profit,
                    use_potential_sales: self.use_potential_sales,
                    use_potential_volume: self.use_potential_volume,
                    use_potential_profit: self.use_potential_profit,
                    use_audit: self.use_audit,
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