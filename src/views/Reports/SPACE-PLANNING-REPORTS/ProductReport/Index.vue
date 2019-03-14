<template>
    <v-card>

        <v-toolbar color="primary">
            <v-btn color="primary" icon @click="$router.go(-1)">
                <v-icon dark>arrow_back_ios</v-icon>
            </v-btn>
            <v-toolbar-title>
                Space Planning Product Report
            </v-toolbar-title>

        </v-toolbar>
        <v-toolbar>
            <v-flex lg3 md4 sm12 xs12>
                <v-select label="Store"></v-select>
            </v-flex>
            <v-flex lg6 md4 sm12 xs12>
                <v-select label="Planogram" v-model="planogram" :items="planograms" @change="LoadReport(planogram)"></v-select>
            </v-flex>
            <v-flex lg3 md4 sm12 xs12>
            </v-flex>

        </v-toolbar>
        <ag-grid-vue :columnDefs="columnDefs" :rowData="rowData" class="ag-theme-balham" :gridOptions="gridOptions"
            :sideBar='true' style="width: 100%;height: calc(70vh - 25px)" @grid-ready="onGridReady">
        </ag-grid-vue>
        <!-- :gridOptions="gridOptions" :sideBar='true' style="  height: calc(70vh - 25px);"
                    :defaultColDef="defaultColDef"  :columnDefs="columnDefs" :selectionChanged="onSelectionChanged"
                    :rowData="rowData" :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                    :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                    :floatingFilter="true"  :groupMultiAutoColumn="true" -->
    </v-card>
</template>

<script>
    import PlanogramFetcher from "@/libs/helpers/PlanoGramDataFetcher"
    import {
        AgGridVue
    } from "ag-grid-vue";
    import Axios from 'axios'
    import {
        exists
    } from 'fs';
    export default {
        components: {
            AgGridVue,
        },
        data() {
            return {
                data: null,
                gondolas: [],
                planograms: [],
                planogram: null,
                columnDefs: [],
                rowData: [],
                gridOptions: {
                    context: {
                        componentParent: this
                    },
                    groupMultiAutoColumn: true,
                },
            }
        },
        created() {
            let self = this
            self.getData()
            let tmp = require('./headers.json');
            tmp.forEach(element => {
                self.columnDefs.push({
                    headerName: element.headerName,
                    field: element.field
                })
            });
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getData() {
                var self = this
                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning").then(r => {
                    r.data.forEach(element => {
                        self.planograms.push({
                            text: element.name,
                            value: element.id
                        })
                    })
                })
            },
            LoadReport(planogram) {
                let self = this
                let planogramFetcher = new PlanogramFetcher()
                let tmp = planogramFetcher.getPlanoData("CR-devinspire", planogram, callback => {
                    self.data = callback.data
                    for (let index = 0; index < self.data.planogramData.length; index++) {
                        const e = self.data.planogramData[index];
                        if (e.Type == "PRODUCT") {
                            e.ParentID = e.Data.ID
                            self.gondolas.push(e)
                        }
                    }
                    // for (let index = 0; index < self.data.planogramData.length; index++) {
                    //     const e = self.data.planogramData[index];
                    //     if (e.Type != "GONDOLA" && e.Type != "PRODUCT" && e.Type != "OBSTRUCTION") {
                    //         e.ParentID = e.Data.ParentID
                    //         self.gondolas.push(e)
                    //     }
                    // }
                    console.log(self.gondolas);
                    
                    self.rowData = self.gondolas
                })


            },
        }
    }
</script>