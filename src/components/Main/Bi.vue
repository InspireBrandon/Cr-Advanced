<template>
    <div>
        <v-toolbar dark flat dense>
            <v-toolbar-items>
                <v-select style="width: 300px;" label="Reports" @change="choseReport" :items="reports"
                    v-model="selectedReport"></v-select>
                <v-select style="width: 300px;" class="ml-3" label="Page" @change="chooseActivePage" :items="pages"
                    v-model="selectedPage"></v-select>
                <v-select style="width: 300px;" class="ml-3" label="Store Numbers" multiple @change="applyReportFilters"
                    :items="storeNumbers" v-model="selectedStoreNumbers"></v-select>
            </v-toolbar-items>
            <v-btn color="primary" @click="printReport">Print</v-btn>
            <!-- <v-btn color="primary" @click="switchMode">{{ currentMode == "edit" ? "View" : "Edit" }}</v-btn> -->
        </v-toolbar>
        <div ref="reportContainer" id="reportContainer" style="width: 100%; height: calc(100vh - 128px);"></div>
        <Spinner ref="Spinner" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import * as pbi from 'powerbi-client';
    import * as models from 'powerbi-models';

    import Spinner from '@/components/Common/Spinner';

    export default {
        components: {
            Spinner
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

            self.getReports(() => {
                self.getReportEmbedConfig();
            });
        },
        methods: {
            switchMode() {
                let self = this;

                if(self.currentMode == "edit") 
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

                self.getFilters();
            },
            getFilters() {
                let self = this;

                self.report.getFilters()
                    .then(filters => {})
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
</script>