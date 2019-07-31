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
                                        <input v-model="potential_sales" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Potential Volume</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_volume" style="width: 80%; text-align: right;" type="number">
                                        <div style="margin-left: 5px;">%</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Potential Profit</td>
                                <td style="text-align: center;">Top</td>
                                <td style="padding: 0px!important;">
                                    <div style="display: flex;">
                                        <input v-model="potential_profit" style="width: 80%; text-align: right;" type="number">
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
                        </tbody>
                    </table>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog = false">Save</v-btn>
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