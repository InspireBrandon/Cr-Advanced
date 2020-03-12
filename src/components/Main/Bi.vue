<template>
    <div>
        <v-toolbar dark flat dense>
            <v-toolbar-items>
                <v-select style="width: 350px;" class="ml-3" label="Page" @change="chooseActivePage" :items="pages"
                    v-model="selectedPage"></v-select>

                <v-autocomplete :items="planograms" v-model="selectedPlanograms" class="ml-3"
                    placeholder="Planogram Filter" multiple style="width: 300px;margin-left:8px;" @change="applyFilter"
                    hide-details>
                </v-autocomplete>
                <!-- <v-select style="width: 300px;" class="ml-3" label="Store Numbers" multiple @change="applyReportFilters"
                    :items="storeNumbers" v-model="selectedStoreNumbers"></v-select> -->
                <!-- <v-btn @click="applyReportFilters">
                    name
                </v-btn> -->
            </v-toolbar-items>

            <div v-show="showCluster"
                style="height: 100vh; width: 40%; background: white; top: 0px; position: fixed; right: 0px; top: 48px;">
                <v-toolbar color="primary">{{ planogramName }}</v-toolbar>
                <BICluster ref="biCluster" />
            </div>

            <v-btn color="primary" @click="printReport">Print</v-btn>
            <v-btn color="primary" :disabled="updating" v-if="userAccess==0" @click="RefreshTables">refresh db</v-btn>
            <v-progress-circular indeterminate v-if="updating"></v-progress-circular>
            <v-btn color="primary" v-if="userAccess==0" @click="CleanTables">Clean</v-btn>
            <v-btn color="primary" @click="showCluster = !showCluster">Edit Clusters</v-btn>
            <v-btn v-if="selectedPlanograms.length == 1" icon color="primary" @click="updateBIPlanogramBaskets">
                <v-icon>settings</v-icon>
            </v-btn>

            <!-- <v-btn color="primary" @click="switchMode">{{ currentMode == "edit" ? "View" : "Edit" }}</v-btn> -->
        </v-toolbar>
        <div ref="reportContainer" id="reportContainer" style="width: 100%; height: calc(100vh - 110px);"></div>
        <Spinner ref="Spinner" />
        <BIPlanogramBaskets ref="BIPlanogramBaskets" />
    </div>
</template>

<script>
    import jwt from 'jsonwebtoken';
    import Axios from 'axios';
    import * as pbi from 'powerbi-client';
    import * as models from 'powerbi-models';

    import Spinner from '@/components/Common/Spinner';

    import BIPlanogramBaskets from './BIPlanogramBaskets'
    import BICluster from './BICluster'

    export default {
        components: {
            Spinner,
            BIPlanogramBaskets,
            BICluster
        },
        data() {
            return {
                showCluster: false,
                planograms: [],
                selectedPlanograms: [],
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
                updating: true,
                timeout: null,
                drawer: true,
                planogramName: ""
            }
        },
        mounted() {
            let self = this;

            self.$refs.Spinner.show();
            clearTimeout(self.timeout)

            self.checkCanRefresh();

            self.checkAccessType(access => {
                self.getPlanograms()
                self.getPage(() => {
                    self.getReportEmbedConfig();
                })
            })


            // self.getReports(() => {
            // });
        },
        methods: {
            // changeCategory

            checkCanRefresh() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "BIQue")
                    .then(r => {
                        if (r.data == null) {
                            self.updating = false;
                        } else {
                            self.updating = true;
                        }

                        delete Axios.defaults.headers.common["TenantID"];
                        clearTimeout(self.timeout);

                        self.timeout = setTimeout(() => {
                            self.checkCanRefresh();
                        }, 10000);
                    })
            },
            RefreshTables() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.updating = true;

                let request = {
                    userID: 1,
                    planogramID: "",
                    queStatus: 1
                }

                Axios.post(process.env.VUE_APP_API + "BIQue", request)
                    .then(r => {})
            },
            CleanTables() {
                let self = this
            },
            getPlanograms() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + 'TopLinePlanos')
                        .then(r => {

                            r.data.forEach(e => {
                                if (self.userAccess == 2) {
                                    self.planogramAccess.forEach(planogram => {
                                        if (planogram == e.value) {
                                            self.planograms.push({
                                                text: e.text,
                                                value: e.value
                                            })
                                        }
                                    })
                                } else {
                                    self.planograms.push({
                                        text: e.text,
                                        value: e.value
                                    })
                                }
                            })
                            if (self.userAccess == 2) {
                                self.selectedPlanograms = self.planogramAccess
                            }

                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            applyFilter() {
                let self = this
                self.report.removeFilters();
                // self.planogramAccess.forEach(item => {
                //     self.selectedPlanograms.push(item)
                // })
                let supplierFilter = {
                    $schema: "http://powerbi.com/product/schema#basic",
                    target: {
                        table: "BI_Topline",
                        column: "Planogram_ID"
                    },
                    operator: "In",
                    values: self.selectedPlanograms,
                    filterType: models.FilterType.Basic,
                    requiresSingleSelect: false // Limits selection of values to one.
                }

                let supplierFilter2 = {
                    $schema: "http://powerbi.com/product/schema#basic",
                    target: {
                        table: "BI_Category",
                        column: "Planogram_ID"
                    },
                    operator: "In",
                    values: self.selectedPlanograms,
                    filterType: models.FilterType.Basic,
                    requiresSingleSelect: false // Limits selection of values to one.
                }


                if (self.selectedPlanograms.length > 0) {
                    if (self.selectedPlanograms.length == 1 || self.selectedPlanograms.length == 0) {
                        self.$refs.biCluster.changeCategory(self.selectedPlanograms[0])

                        var planogramID = self.selectedPlanograms[0];

                        var planogramName = self.planograms.find(e => {
                            return e.value == planogramID;
                        }).text;

                        self.planogramName = planogramName;
                    }
                    self.report.setFilters([supplierFilter, supplierFilter2]).catch(errors => {});
                } else {
                    self.applyReportFilters()
                }
            },
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

                        if (r.data.isDatabaseOwner == true) {
                            self.userAccess = 0
                        } else {

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
                self.$nextTick(() => {
                    let supplierFilter
                    let supplierFilter2
                    // apply filter

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
                        self.report.setFilters([supplierFilter, supplierFilter2])
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
                    self.applyReportFilters()
                })
            },
            printReport() {
                let self = this;

                self.report.print()
                    .catch(error => {
                        console.log("Print error: ", error);
                    });
            },
            updateBIPlanogramBaskets() {
                let self = this;

                var planogramID = self.selectedPlanograms[0];

                var planogramName = self.planograms.find(e => {
                    return e.value == planogramID;
                }).text;

                self.$refs.BIPlanogramBaskets.show(planogramID, planogramName, () => {
                    Axios.get(process.env.VUE_APP_API + "PowerBI/UpdateDatasets")
                        .then(r => {
                            console.log("Busy with refresh")
                        })
                })
            }
        }
    }
</script>