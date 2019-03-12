<template>
    <v-card>
        <v-container grid-list-md>
            <v-layout row wrap>

                <v-toolbar>
                    <v-btn fab dark small @click="$router.go(-1)">
                        <v-icon dark>arrow_back_ios</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                        Space Plan Reports
                    </v-toolbar-title>
                   
                </v-toolbar>
                <v-flex lg12 md12 sm12 xs12>
                    <v-list dense two-line>
                        <v-list-tile>
                            Reports
                        </v-list-tile>
                        <hr>
                        <v-list-tile v-for="(item,index) in appReports" :key="index" @click.prevent="$router.push(item.route)">
                            {{item.title}}
                        </v-list-tile>
                        <v-divider></v-divider>
                    </v-list>
                </v-flex>

            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
    import ApplicationReportHelper from '@/libs/system/application/application-report-helper.js'

    export default {

        data() {
            return {
                applicationReportHelper: null,
                appReports: [],

                categories: [],
                applicationReports: [

                ]
            }


        },
        created() {
            var self = this
            self.applicationReportHelper = new ApplicationReportHelper();
            let tmp = self.applicationReportHelper.applicationList
            tmp.forEach(element => {
                let config = self.applicationReportHelper.getApplicationConfigBySystemCode(element.system_code)
                if (config.report) {
                    let detail = self.applicationReportHelper.getApplicationDetailsBySystemCode(element.system_code)
                    let reports = self.applicationReportHelper.getApplicationReports(element.system_code)
                    let reportDetails = []
                    reports.forEach(report => {

                        reportDetails.push(self.applicationReportHelper.getReportConfig(element.system_code,
                            report.system_report_code))
                    })
                    self.applicationReports.push(new ReportDetail(reportDetails, detail))


                    self.applicationReports.forEach(report => {
                        if (report.component == "Space Planning")
                            report.reports.forEach(element => {
                                self.appReports.push(element)
                            });

                    })


                }
            });

        },
        methods: {

        }

    }

    function ReportDetail(reports, detail) {
        let self = this;
        self.component = detail.name;
        self.reports = [];

        reports.forEach(report => {
            self.reports.push({
                title: report.title,
                route: report.route
            })
        })
    }
</script>