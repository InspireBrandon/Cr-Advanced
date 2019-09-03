<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Store Basket Report - {{ basketName }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>

        </v-toolbar>
        <v-card>
            <Grid ref="grid" :data="Data" />
        </v-card>
        <DateRangeSelector ref="DateRangeSelector" />

    </v-dialog>
</template>

<script>
    import DateRangeSelector from "@/components/Common/DateRangeSelector"
    import Grid from './Grid.vue'
    import Axios from 'axios'
    export default {
        components: {
            DateRangeSelector,
            Grid

        },
        data() {
            return {
                dialog: false,
                basketName: "",
                Data: [],
                basket_ID: null,
            }
        },
        methods: {
            getReport(basket_ID, callback) {
                let self = this
                self.$refs.DateRangeSelector.show(dateCall => {

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `StoreBasketReport?basket_ID=${basket_ID}&PeriodFrom=${dateCall.dateFrom}&PeriodTo=${dateCall.dateTo}`)
                        .then(r => {
                            self.Data = r.data
                            console.log(self.Data);
                            callback(r.data)
                        })

                })


            },
            show(basketName, basket_ID) {
                let self = this;
                self.basket_ID = basket_ID
                self.basketName = basketName;
                self.getReport(basket_ID, callback => {
                    self.dialog = true;
                    self.$refs.grid.resize();
                })
            }
        }
    }
</script>