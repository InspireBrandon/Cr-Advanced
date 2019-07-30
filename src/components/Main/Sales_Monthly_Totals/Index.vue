<template>
    <v-card class="pa-0" tile>
        <v-toolbar dark flat>
            <v-toolbar-title>Sales Monthly Totals</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="openDialog" color="primary">Add</v-btn>
        </v-toolbar>
        <v-dialog persistent v-model="dialog" width="500">
            <v-card>
                <v-form @submit.prevent="submit">
                    <v-toolbar dark flat color="primary">
                        <v-toolbar-title>Create</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-card-text>
                        <v-autocomplete required v-model="selected_period_from" :items="periods_from"
                            label="Date From:">
                        </v-autocomplete>
                        <v-autocomplete required v-model="selected_period_to" :items="periods_to" label="Date To:">
                        </v-autocomplete>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :loading="save_loading" type="submit" color="primary" flat>Continue</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <Grid :rowData="gridData" />
    </v-card>
</template>

<script>
    import Grid from './Grid/Index.vue'
    import Axios from 'axios';

    export default {
        components: {
            Grid
        },
        name: 'sales-monthly-totals',
        data() {
            return {
                gridData: [],
                periods_from: [],
                selected_period_from: null,
                periods_to: [],
                selected_period_to: null,
                dialog: false,
                save_loading: false
            }
        },
        mounted() {
            let self = this;
            self.getPeriods();
            self.getTotals();
        },
        methods: {
            openDialog() {
                let self = this;
                self.selected_period_from = null;
                self.selected_period_to = null;
                self.dialog = true;
            },
            getTotals() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Sales_Monthly_Total").then(r => {
                    console.log("[TOTALS]");
                    console.log(r);

                    self.gridData=r.data.sales_Monthly_Total_List

                })
            },
            getPeriods() {
                let self = this;
                console.log("here");

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/period")
                    .then(r => {
                        let periods = r.data;
                        console.log(r.data);

                        self.periods_from = [];
                        self.periods_to = [];

                        periods.forEach(period => {
                            self.periods_from.push({
                                text: period.period_From_Date.split("T")[0],
                                value: period.id
                            });
                            self.periods_to.push({
                                text: period.period_To_Date.split("T")[0],
                                value: period.id
                            });
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        console.error("Failed to get period. " + exc);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            submit() {
                let self = this;

                if (self.selected_period_from == null)
                    alert("Please select a period from date");
                else if (self.selected_period_to == null)
                    alert("Please select a period to date");
                else {
                    self.save();
                }
            },
            save() {
                let self = this;
                self.save_loading = true;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API +
                        `Sales_Monthly_Total?period_from_id=${self.selected_period_from}&period_to_id=${self.selected_period_to}`
                        )
                    .then(r => {
                        console.log(r.data);
                        self.save_loading = false;
                        self.dialog = false;
                        self.gridData.push(r.data.sales_Monthly_Total)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        alert("Failed to create sales monthly total. Please try again later");
                        console.error("Failed to create sales monthly total. " + exc);
                        self.save_loading = false;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            }
        }
    }
</script>