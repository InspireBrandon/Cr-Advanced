<template>
    <div>
        <v-btn icon v-if="editing" @click="openCustomFilterModal">
            <v-icon>filter</v-icon>
        </v-btn>
        <!-- <v-toolbar dark flat dense>
            <v-toolbar-items>
                <v-select style="width: 300px;" label="Reports" @change="choseReport" :items="reports"
                    v-model="selectedReport"></v-select>
                <v-select style="width: 300px;" class="ml-3" label="Page" @change="chooseActivePage" :items="pages"
                    v-model="selectedPage"></v-select>
                <v-select style="width: 300px;" class="ml-3" label="Store Numbers" multiple @change="applyReportFilters"
                    :items="storeNumbers" v-model="selectedStoreNumbers"></v-select>
            </v-toolbar-items>
            <v-btn color="primary" @click="printReport">Print</v-btn> -->
        <!-- <v-btn color="primary" @click="switchMode">{{ currentMode == "edit" ? "View" : "Edit" }}</v-btn> -->
        <!-- </v-toolbar> -->
        <div ref="reportContainer" id="reportContainer" class="desktop-view"
            style="width: 100%; height: 100%;border-style: none"></div>
        <Spinner ref="Spinner" />
        <CustomFilterModal ref="CustomFilterModal" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import * as pbi from 'powerbi-client';
    import * as models from 'powerbi-models';

    import Spinner from '@/components/Common/Spinner';
    import CustomFilterModal from "../CustomFilterModal"
    import {
        setTimeout
    } from 'timers';
    export default {
        props: ["config", "editing"],
        components: {
            Spinner,
            CustomFilterModal
        },
        data() {
            return {
                report: null,
                storeNumbers: [1, 2, 3, 4, 5, 6, 7],
                selectedStoreNumbers: [],
                reports: [],
                selectedReport: null,
                pages: [],
                selectedPage: null,
                currentMode: "view"
            }
        },
        mounted() {
            let self = this;

            self.$refs.Spinner.show();
            console.log("[POWERBI]self.config", self.config);
            if (self.config != null) {
                self.selectedReport = self.config.value;
                self.getReportEmbedConfig();
            } else {
                self.getReports(() => {
                    self.getReportEmbedConfig();
                });
            }

        },
        methods: {
            openCustomFilterModal() {
                let self = this
                self.$refs.CustomFilterModal.open(callback => {})
            },
            switchMode() {
                let self = this;

                if (self.currentMode == "edit")
                    self.currentMode = "view"
                else
                    self.currentMode = "edit"

                self.report.switchMode(self.currentMode)
            },
            getActivePages() {
                let self = this;

                self.pages = [];

                self.report.getPages()
                    .then(pages => {
                        pages.forEach(page => {
                            self.pages.push({
                                value: page.name,
                                text: page.displayName
                            })
                        })

                        if (self.pages.length > 0)
                            self.selectedPage = self.pages[0].value;
                    });
            },
            getReports(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetReports")
                    .then(r => {
                        self.reports = [];

                        r.data.value.forEach(report => {
                            self.reports.push({
                                text: report.name,
                                value: report.id
                            })
                        });

                        self.selectedReport = self.reports[0].value;
                        callback();
                    })
            },
            getReportEmbedConfig() {
                let self = this;

                self.$refs.Spinner.show();

                Axios.get(process.env.VUE_APP_API +
                        `PowerBI/GetReportEmbedConfig?reportID=${self.selectedReport}`)
                    .then(r => {
                        self.generateReport(r.data);
                    })
            },
            generateReport(reportEmbedConfig) {
                let self = this;

                // const basicFilter = {
                //     $schema: "http://powerbi.com/product/schema#relativeDate",
                //     target: {
                //         table: "Store",
                //         column: "StoreNumber"
                //     },
                //     operator: "In",
                //     values: [3, 4, 5],
                //     filterType: models.FilterType.Basic,
                //     requiresSingleSelect: true // Limits selection of values to one.
                // }

                var config = {
                    type: 'report',
                    id: reportEmbedConfig.id,
                    embedUrl: reportEmbedConfig.embedUrl, // 'https://app.powerbi.com/reportEmbed',
                    tokenType: 1,
                    accessToken: reportEmbedConfig.embedToken.token,
                    settings: {
                        filterPaneEnabled: false,
                        navContentPaneEnabled: false,
                        background: models.BackgroundType.Transparent
                    }
                }

                var container = self.$refs.reportContainer;
                self.report = powerbi.embed(container, config);

                self.report.on('loaded', function (event) {
                    self.getFilters();
                    self.getActivePages();
                    self.$refs.Spinner.hide();

                })
                self.$refs.Spinner.hide();
                self.getFilters();

            },
            getvisuals(visualCallback) {
                let self = this
                let res = []
                // Get a reference to the embedded report HTML element
                var embedContainer = self.$refs.reportContainer

                // Get a reference to the embedded report.
                let report = powerbi.get(embedContainer);

                // Retrieve the page collection and get the visuals for the first page.
                report.getPages()
                    .then(function (pages) {

                        // Retrieve active page.
                        var activePage = pages.find(function (page) {
                            return page.isActive
                        });

                        activePage.getVisuals()
                            .then(function (visuals) {

                                visuals.forEach((visual, idx) => {
                                    visual.exportData(models.ExportDataType.Underlying)
                                        .then(function (data) {
                                            let object = csvToDataObject(data.data)
                                            res.push(object)
                                            if (idx + 1 == visuals.length) {
                                                visualCallback(res)
                                            }
                                        })
                                })
                            })
                            .catch(function (errors) {
                                console.log(errors);
                            });
                    })
                    .catch(function (errors) {
                        console.log(errors);
                    });
            },

            getFilters() {
                let self = this;

                self.report.getFilters()
                    .then(filters => {


                    })
            },
            applyReportFilters() {
                let self = this;

                self.$nextTick(() => {
                    if (self.selectedStoreNumbers.length == 0) {
                        self.report.removeFilters();
                    } else {
                        const basicFilter = {
                            $schema: "http://powerbi.com/product/schema#basic",
                            target: {
                                table: "Store",
                                column: "StoreNumber"
                            },
                            operator: "In",
                            values: self.selectedStoreNumbers,
                            filterType: models.FilterType.Basic,
                            requiresSingleSelect: true // Limits selection of values to one.
                        }

                        self.report.setFilters([basicFilter])
                            .catch(errors => {
                                // Handle error
                            });
                    }
                })
            },
            choseReport() {
                let self = this;

                self.$nextTick(() => {
                    self.getReportEmbedConfig();
                })
            },
            chooseActivePage() {
                let self = this;

                self.$nextTick(() => {
                    let page = self.report.page(self.selectedPage);
                    page.setActive();
                })
            },
            printReport() {
                let self = this;

                self.report.print()
                    .catch(error => {
                        console.log("Print error: ", error);
                    });
            }
        }
    }

    function csvToDataObject(data) {
        console.log(data);

        let lines = data.split('\n');
        let result = [];

        let brokenHeaders = lines[0].split(',');
        let headers = [];

        brokenHeaders.forEach(el => {
            headers.push(el.replace(/ /g, "_").replace(/"/g, "").replace(/\r/g, ""));
        })

        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentLine = lines[i].split(",");

            if (currentLine[0] != "") {
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j].replace(/"/g, "").replace(/\r/g, "");
                }

                result.push(obj);
            }

        }
        return {
            data: result,
            headers: headers
        };
    }
</script>
<style>
    #reportContainer {
        background-color: white;
        padding: 0px;
        clear: both;
    }

    .desktop-view iframe,
    .mobile-view iframe {
        border: none;
    }
</style>
<style>
    .iframe {
        border-width: 0px !important;
    }
</style>