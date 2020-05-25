<template>
    <div>
        <v-dialog persistent v-model="dialog" width="800">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Role Configuration</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-0" style="height: 600px; overflow-y: scroll;">
                    <div style="width: 300px">
                        <v-select @change="onRoleChange" v-model="selectedRole" label="Role" :items="categoryRoles"
                            item-text="displayname" item-value="id" flat hide-details></v-select>
                    </div>
                    <div>
                        <h3>Auto Range</h3>
                        <h4 class="font-weight-light">Highlights</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Sales_Index" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Sales Index</td>
                                    <td style="text-align: center;">></td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.sales_Index" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Profit_Index" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Profit Index</td>
                                    <td style="text-align: center;">></td>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.profit_Index" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Volume_Index" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Volume Index</td>
                                    <td style="text-align: center;">></td>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.volume_Index" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Sales" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Sales</td>
                                    <td style="text-align: center;">Top</td>
                                    <td style="padding: 02px!important;">
                                        <div style="display: flex;">
                                            <input v-model="data.sales" style="width: 80%; text-align: right;"
                                                type="number" />
                                            <div style="margin-left: 5px;">%</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Volume" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Volume</td>
                                    <td style="text-align: center;">Top</td>
                                    <td style="padding: 02px!important;">
                                        <div style="display: flex;">
                                            <input v-model="data.volume" style="width: 80%; text-align: right;"
                                                type="number" />
                                            <div style="margin-left: 5px;">%</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Profit" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Profit</td>
                                    <td style="text-align: center;">Top</td>
                                    <td style="padding: 02px!important;">
                                        <div style="display: flex;">
                                            <input v-model="data.profit" style="width: 80%; text-align: right;"
                                                type="number" />
                                            <div style="margin-left: 5px;">%</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Potential_Sales" type="checkbox"
                                            style="width: 100%;" />
                                    </td>
                                    <td>Potential Sales</td>
                                    <td style="text-align: center;">Top</td>
                                    <td style="padding: 02px!important;">
                                        <div style="display: flex;">
                                            <input v-model="data.potential_Sales" style="width: 80%; text-align: right;"
                                                type="number" />
                                            <div style="margin-left: 5px;">%</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Potential_Volume" type="checkbox"
                                            style="width: 100%;" />
                                    </td>
                                    <td>Potential Volume</td>
                                    <td style="text-align: center;">Top</td>
                                    <td style="padding: 02px!important;">
                                        <div style="display: flex;">
                                            <input v-model="data.potential_Volume"
                                                style="width: 80%; text-align: right;" type="number" />
                                            <div style="margin-left: 5px;">%</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Potential_Profit" type="checkbox"
                                            style="width: 100%;" />
                                    </td>
                                    <td>Potential Profit</td>
                                    <td style="text-align: center;">Top</td>
                                    <td style="padding: 02px!important;">
                                        <div style="display: flex;">
                                            <input v-model="data.potential_Profit"
                                                style="width: 80%; text-align: right;" type="number" />
                                            <div style="margin-left: 5px;">%</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Inclusive_Units" type="checkbox"
                                            style="width: 100%;" />
                                    </td>
                                    <td>Inclusive Units</td>
                                    <td style="text-align: center;">></td>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.inclusive_Units" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.use_Minimum_Units" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>Minimum Units</td>
                                    <td style="text-align: center;">&lt;</td>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.minimum_Units" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 02px!important;">
                                        <!-- <input v-model="use_audit" type="checkbox" style="width: 100%;"> -->
                                    </td>
                                    <td>Audit</td>
                                    <td style="text-align: center;">On/Off</td>
                                    <td style="padding: 02px!important;">
                                        <input v-model="data.audit" type="checkbox" style="width: 100%;" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="font-weight-light">Values</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="padding: 02px!important;"></td>
                                    <td>DOS Units</td>
                                    <td style="text-align: center; width: 200px;">Value</td>
                                    <td style="padding: 02px!important; width: 100px;">
                                        <input v-model="data.doS_Units" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h3>Product Supply</h3>
                        <h4 class="font-weight-light">Highlights</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Safety Stock</td>
                                    <td style="text-align: center; width: 60px;">&lt;</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.safety_Stock_Highlight"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                    <td style="width: 60px;">
                                        Weeks
                                    </td>
                                </tr>
                                <tr>
                                    <td>Casepack Qty</td>
                                    <td style="text-align: center; width: 60px;">></td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.casepack_Qty" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td style="width: 60px;">
                                        Weeks
                                    </td>
                                </tr>
                                <tr>
                                    <td>Surplus Stock</td>
                                    <td style="text-align: center;">></td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.surplus_Stock" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td>
                                        Weeks
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 class="font-weight-light mt-2">Values</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Minumum Stock</td>
                                    <td style="text-align: center; width: 60px;">=</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.minumum_Stock" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td style="width: 60px;">
                                        Weeks
                                    </td>
                                </tr>
                                <tr>
                                    <td>Maximum Stock</td>
                                    <td style="text-align: center;">=</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.maximum_Stock" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td>
                                        Weeks
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="mt-1">
                            <tbody>
                                <tr>
                                    <td>Default Minimum Units</td>
                                    <td style="text-align: center;">=</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.default_Minimum" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td>Then Max Units</td>
                                    <td style="text-align: center;">=</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.default_Minimum_Max"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="mt-1">
                            <tbody>
                                <tr>
                                    <td>Default Price Minimum</td>
                                    <td style="text-align: center;">&lt;</td>
                                    <td style="padding: 0px!important; width: 50px">
                                        <input v-model="data.default_Price_Minimum"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                    <td>
                                        Rand
                                    </td>
                                    <td>Then Min Units</td>
                                    <td style="text-align: center;">=</td>
                                    <td style="padding: 0px!important; width: 50px">
                                        <input v-model="data.default_Price_Minimum_Min"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                    <td>Then Max Units</td>
                                    <td style="text-align: center;">=</td>
                                    <td style="padding: 0px!important; width: 50px">
                                        <input v-model="data.default_Price_Minimum_Max"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="mt-1">
                            <tbody>
                                <tr>
                                    <td>Supplier Lead Time</td>
                                    <td style="text-align: center; width: 60px;">=</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.lead_Time" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td style="width: 60px;">
                                        Days
                                    </td>
                                </tr>
                                <tr>
                                    <td>Safety Stock</td>
                                    <td style="text-align: center; width: 60px;">=</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.safety_Stock_Value" style="width: 100%; text-align: right;"
                                            type="number" />
                                    </td>
                                    <td style="width: 60px;">
                                        Weeks
                                    </td>
                                </tr>
                                <tr>
                                    <td>Use Seasonal Index</td>
                                    <td style="text-align: center;">On/Off</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.use_Seasonal_Index" type="checkbox" style="width: 100%;" />
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Excess Distribution Weeks</td>
                                    <td style="text-align: center;">></td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.excess_Distribution_Weeks"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                    <td>
                                        Weeks
                                    </td>
                                </tr>
                                <tr>
                                    <td>Excess Receivable Stock</td>
                                    <td style="text-align: center;">&lt;</td>
                                    <td style="padding: 0px!important; width: 100px">
                                        <input v-model="data.excess_Recievable_Stock"
                                            style="width: 100%; text-align: right;" type="number" />
                                    </td>
                                    <td>
                                        Weeks
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" flat @click="defaults">Default</v-btn>
                    <v-btn color="primary" :loading="loading" flat @click="submit">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from "axios";
    export default {
        data() {
            return {
                loading: false,
                categoryRoles: [],
                selectedRole: null,
                dialog: false,
                data: {
                    id: null,
                    category_Role_ID: null,
                    use_Sales_Index: true,
                    use_Profit_Index: true,
                    use_Volume_Index: true,
                    use_Sales: true,
                    use_Volume: true,
                    use_Profit: true,
                    use_Potential_Sales: true,
                    use_Potential_Volume: true,
                    use_Potential_Profit: true,
                    use_Inclusive_Units: true,
                    use_Minimum_Units: true,
                    use_Audit: true,
                    sales_Index: 100,
                    profit_Index: 100,
                    volume_Index: 100,
                    sales: 60,
                    volume: 60,
                    profit: 60,
                    potential_Sales: 60,
                    potential_Volume: 60,
                    potential_Profit: 60,
                    inclusive_Units: 6,
                    audit: false,
                    doS_Units: 6,
                    minimum_Units: 1,
                    // Product Supply Fields
                    safety_Stock_Highlight: 1,
                    casepack_Qty: 12,
                    surplus_Stock: 12,
                    minumum_Stock: 4,
                    maximum_Stock: 6,
                    default_Minimum: 2,
                    default_Minimum_Max: 0,
                    default_Price_Minimum: 100,
                    default_Price_Minimum_Min: 3,
                    default_Price_Minimum_Max: 5,
                    lead_Time: 21,
                    safety_Stock_Value: 1,
                    use_Seasonal_Index: false,
                    excess_Distribution_Weeks: 12,
                    excess_Recievable_Stock: 8
                }
            };
        },
        methods: {
            defaults() {
                let self = this;

                self.data.sales_Index = 100;
                self.data.profit_Index = 100;
                self.data.volume_Index = 100;
                self.data.sales = 60;
                self.data.volume = 60;
                self.data.profit = 60;
                self.data.potential_Sales = 60;
                self.data.potential_Volume = 60;
                self.data.potential_Profit = 60;
                self.data.doS_Units = 6;
                self.data.minimum_Units = 1;
                self.data.inclusive_Units = 6;
                self.data.audit = false;

                self.data.use_Sales_Index = true;
                self.data.use_Profit_Index = true;
                self.data.use_Volume_Index = true;
                self.data.use_Sales = true;
                self.data.use_Volume = true;
                self.data.use_Profit = true;
                self.data.use_Potential_Sales = true;
                self.data.use_Potential_Volume = true;
                self.data.use_Potential_Profit = true;
                self.data.use_Audit = true;
                self.data.use_Inclusive_Units = true;
                self.data.use_Minimum_Units = true;

                // Product Supply Fields
                self.data.safety_Stock_Highlight = 1;
                self.data.casepack_Qty = 12;
                self.data.surplus_Stock = 12;
                self.data.minumum_Stock = 4;
                self.data.maximum_Stock = 6;
                self.data.default_Minimum = 2;
                self.data.default_Minimum_Max = 0;
                self.data.default_Price_Minimum = 100;
                self.data.default_Price_Minimum_Min = 3;
                self.data.default_Price_Minimum_Max = 5;
                self.data.lead_Time = 21;
                self.data.safety_Stock_Value = 1;
                self.data.use_Seasonal_Index = false;
                self.data.excess_Distribution_Weeks = 12;
                self.data.excess_Recievable_Stock = 8;
            },
            show() {
                let self = this;
                self.getRoles();
                self.dialog = true;
            },
            submit() {
                let self = this;

                self.saveRoleConfig(() => {});
            },
            getRoles() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "CategoryRole")
                    .then(r => {
                        self.categoryRoles = r.data;
                        self.selectedRole = r.data[0].id;
                        self.getConfigByRoleID();
                    })
                    .catch(e => {});
            },
            getConfigByRoleID() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                self.$nextTick(() => {
                    Axios.get(
                            process.env.VUE_APP_API +
                            "AutoRangeConfig?roleID=" +
                            self.selectedRole
                        )
                        .then(r => {
                            let data = r.data;

                            for (var prop in self.data) {
                                self.data[prop] = data[prop];
                            }
                        })
                        .catch(e => {});
                });
            },
            onRoleChange() {
                let self = this;

                self.$nextTick(() => {
                    // SAVE CURRENT CONFIG
                    self.saveRoleConfig(() => {
                        self.getConfigByRoleID();
                    });
                });
            },
            saveRoleConfig(callback) {
                let self = this;

                self.loading = true;

                Axios.post(process.env.VUE_APP_API + "AutoRangeConfig", self.data)
                    .then(r => {
                        self.loading = false;
                        callback();
                    })
                    .catch(e => {});
            }
        }
    };
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