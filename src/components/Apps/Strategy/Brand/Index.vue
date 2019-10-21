<template>
    <div>
        <v-toolbar dark dense color="grey darken-3">
            <v-toolbar-items>
                <v-btn @click="openDataSelector()" color="primary">test</v-btn>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <!-- <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="closeFile">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile> -->
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Brand
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <!-- <v-toolbar-items>
                <v-select placeholder="select brands" multiple></v-select>
            </v-toolbar-items> -->
        </v-toolbar>
        <PlanogramSelector ref="PlanogramSelector" />
        <DateRangeSelector ref="DateRangeSelector" />
        <DataSelector ref="DataSelector" />
        <BrandGrid ref="BrandGrid" :rowData="rowData" />

    </div>
</template>
<script>
    import BrandGrid from "./Grid"
    import Axios from 'axios'
    import DateRangeSelector from '@/components/Common/DateRangeSelector';
    import PlanogramSelector from '../ListingClusters/PlanogramSelector'
    import DataSelector from "./DataSelector"

    export default {
        components: {
            BrandGrid,
            DateRangeSelector,
            PlanogramSelector,
            DataSelector
        },
        data() {
            return {
                rowData: [],
                brands: [],
                selectedBrands: null,
                selectedPlanogram: null,
                selectedPlanogram: null,
            }

        },
        methods: {
            openDataSelector() {
                let self = this
                self.$refs.DataSelector.show(data => {
                    console.log(data);
                })
            },
            newFile() {
                let self = this;

                self.$refs.PlanogramSelector.show(planogram => {
                    self.$refs.DateRangeSelector.show(dateRange => {
                        self.$refs.DataSelector.show(dataSelectorCallback => {
                            self.selectedPlanogram = planogram;
                            self.selectedPeriod = dateRange;
                            self.runQuery(planogram.id, dateRange.dateFrom, dateRange.dateTo,
                                dataSelectorCallback)
                        })
                    })
                })
            },
            runQuery(planogram_ID, dateFrom, dateTo, dataSelectorData) {
                let self = this

            },
            
        }
    }
</script>