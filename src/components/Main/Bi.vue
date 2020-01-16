<template>
    <div>
        <v-toolbar dark flat dense>
            <v-toolbar-items>
                <v-select style="width: 300px;" class="ml-3" label="Page" @change="chooseActivePage" :items="pages"
                    v-model="selectedPage"></v-select>
                <!-- <v-select style="width: 300px;" class="ml-3" label="Store Numbers" multiple @change="applyReportFilters"
                    :items="storeNumbers" v-model="selectedStoreNumbers"></v-select> -->
                <!-- <v-btn @click="applyReportFilters">
                    name
                </v-btn> -->
            </v-toolbar-items>
            <v-btn color="primary" @click="printReport">Print</v-btn>
            <!-- <v-btn color="primary" @click="switchMode">{{ currentMode == "edit" ? "View" : "Edit" }}</v-btn> -->
        </v-toolbar>
        <div ref="reportContainer" id="reportContainer" style="width: 100%; height: calc(100vh - 110px);"></div>
        <Spinner ref="Spinner" />
    </div>
</template>

<script>
    import jwt from 'jsonwebtoken';
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
                userAccess: null,
                userAccessTypeID: null,
                systemUserID: null,

                planogramAccess: [],
                report: null,
                storeNumbers: [1, 2, 3, 4, 5, 6, 7],
                selectedStoreNumbers: [],
                reports: [],
                selectedReport: null,
                pages: [],
                selectedPage: null,
                currentMode: "view",
            }
        },
        mounted() {
            let self = this;

            self.$refs.Spinner.show();
            self.checkAccessType(access => {
                self.getPage(() => {
                    self.getReportEmbedConfig();

                })
            })


            // self.getReports(() => {
            // });
        },
        methods: {
            switchMode() {
                let self = this;

                if (self.currentMode == "edit")
                    self.currentMode = "view"
                else
                    self.currentMode = "edit"

                self.report.switchMode(self.currentMode)
            },
            getPage(callback) {
                let self = this;

                let folderFileID = self.$route.params.folderFileID

                Axios.get(process.env.VUE_APP_API + "SystemPage?systemFolderFileID=" + folderFileID)
                    .then(r => {
                        if (r.data.systemPage != null) {
                            if (r.data.systemPage.systemPageSectionList.length > 0) {
                                self.selectedReport = r.data.systemPage.systemPageSectionList[0].bI_ReportID;
                            }
                        }

                        callback();
                    })
            },
            getActivePages(callback) {
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
                        callback(self.selectedPage)

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
                console.log("[generateReport]", reportEmbedConfig);

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
                    self.getActivePages(() => {
                        self.applyReportFilters()
                    });

                    self.$refs.Spinner.hide();
                })

                self.getFilters();
            },
            getFilters() {
                let self = this;

                self.report.getFilters()
                    .then(filters => {})
            },
            checkAccessType(callback) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                self.systemUserID = systemUserID;

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${sessionStorage.currentDatabase}`)
                    .then(r => {
                        console.log("[CHECK ACCESS]", r.data);

                        if (r.data.isDatabaseOwner == true) {
                            self.userAccess = 0
                        } else {
                            console.log("[tenenant]");
                            console.log(r.data);

                            self.userAccess = r.data.tenantLink_AccessTypeList[0].accessType
                            self.userAccessTypeID = r.data.tenantLink_AccessTypeList[0].tenantLink_AccessTypeID
                            self.planogramAccess = []
                            r.data.tenantLink_AccessTypeList[0].supplierPlanogramList.forEach(planogram => {
                                self.planogramAccess.push(planogram.planogram_ID)
                            })
                            if (self.userAccess == 3) {
                                self.selectedStore = r.data.tenantLink_AccessTypeList[0].storeID
                                self.store_ID = r.data.tenantLink_AccessTypeList[0].storeID
                            }
                        }
                        callback();
                    })
            },
            applyReportFilters() {
                let self = this;
                // let visuals = self.report.page(self.selectedPage).getVisuals()
                //     .then(data => {
                //         console.log("[DATYA]",data);
                        
                //         data.forEach((item, idx) => {
                //             item.exportData(models.ExportDataType.Summarized , 100)
                //                 .then(function (data) {
                //                     console.log("[VISUALS]" + idx, data);
                //                 })
                //         })
                //     })
                // console.log("[export]", visuals);


                // self.report.exportData(models.ExportDataType.Summarized, 100)
                //     .then(function (data) {
                //         console.log("[exportData]",data);
                //     })
                self.$nextTick(() => {
                    let supplierFilter
                    let supplierFilter2
                    // apply filter

                    console.log("[supplierFilter]", self.planogramAccess);

                    supplierFilter = {
                        $schema: "http://powerbi.com/product/schema#basic",
                        target: {
                            table: "BI_Topline",
                            column: "Planogram_ID"
                        },
                        operator: "In",
                        values: self.planogramAccess,
                        filterType: models.FilterType.Basic,
                        requiresSingleSelect: false // Limits selection of values to one.
                    }

                    supplierFilter2 = {
                        $schema: "http://powerbi.com/product/schema#basic",
                        target: {
                            table: "BI_Category",
                            column: "Planogram_ID"
                        },
                        operator: "In",
                        values: self.planogramAccess,
                        filterType: models.FilterType.Basic,
                        requiresSingleSelect: false // Limits selection of values to one.
                    }

                    if (self.planogramAccess.length > 0) {
                        self.report.setFilters([supplierFilter,supplierFilter2])
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
                    console.log("[page]", page);

                    page.setActive();
                    self.applyReportFilters()
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