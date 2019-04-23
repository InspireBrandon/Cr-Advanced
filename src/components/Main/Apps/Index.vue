<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md>
            <v-layout row wrap v-if="hasDatabases">
                <v-flex lg3 md4 sm6 xs12 v-for="(appConfigDetail, index) in appConfigDetail" :key="index">
                    <app-block :appConfigDetail="appConfigDetail"></app-block>
                </v-flex>
            </v-layout>
            <v-layout row wrap v-else>
                <v-flex lg12 md12 sm12 xs12 v-if="!hasDatabases">
                    <v-card>
                        <v-card-text>
                            It appears as though you do not have access to any databases. Please request access to
                            continue...
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import ApplicationDetailsHelper from '@/libs/system/application/application-details-helper.js';
    import app_block from '@/components/Main/Apps/app_block.vue';

    export default {
        name: 'apps',
        components: {
            'app-block': app_block
        },
        data() {
            return {
                showLoader: true,
                apps: [],
                appConfigDetail: [],
                applicationHelper: null,
                applicationConfigHelper: null,
                applicationDetailsHelper: null,
                hasDatabases: false
            }
        },
        created() {
            let self = this;
            self.getAppsTmpAll();

        },
        methods: {
            appAccess(apps, callback) {
                var self = this
                let storeapptmp = apps
                let buyerapptmp = apps
                let storeApps = []
                let buyerApps = []
                self.checkAccessType(accessType => {

                    console.log("apps");
                    console.log(apps);

                    console.log("accessType", accessType)
                    console.log(accessType)

                    if (accessType.isDatabaseOwner == true) {
                        console.log("isOwner");
                        return
                    } else {
                        if (accessType.tenantLink_AccessTypeList[0].accessType == 3 || accessType
                            .tenantLink_AccessTypeList[0].accessType == 2) {
                            // store  or supplier
                            storeapptmp.forEach(e => {
                                if (e.config.configName == "SpacePlanning") {

                                    let tmpRoutes = [{
                                        "route": "/PlanogramImplementation",
                                        "routeName": "plannogram_implementation",
                                        "title": "Planogram Implementation",
                                        "openInNewWindow": false
                                    }]

                                    e.config.routes = tmpRoutes;

                                    storeApps.push(e)
                                }
                            })

                            self.appConfigDetail = storeApps
                        }

                        if (accessType.tenantLink_AccessTypeList[0].accessType == 1) {
                            // buyer  
                            buyerapptmp.forEach(e => {
                                if (e.config.configName == "SpacePlanning" || e.config.configName ==
                                    "ProductMaintenance" || e.config.configName == "RangePlanning") {

                                    buyerApps.push(e)
                                    console.log(e);

                                    // console.log("buyerApps");
                                    // console.log(buyerApps);
                                    // for (let index = 0; index < e.config.routes.length; index++) {
                                    //     const element = e.config.routes[index];

                                    //     // if (element.routeName != "plannogram_implementation") {
                                    //     //     e.config.routes.splice(element, 1)
                                    //     // }

                                    // }
                                }

                            })
                            // console.log("edited buyerApps");
                            // console.log(buyerApps);

                            self.appConfigDetail = buyerApps
                        }

                    }

                })
                callback(self.appConfigDetail)
            },
            getInstalledApps() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `TenantAccess?systemUserID=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.getAppsFromManifest(r.data)
                    })
            },
            getAppsFromManifest(installedApps) {
                let self = this;

                self.applicationDetailsHelper = new ApplicationDetailsHelper();
                self.apps = self.applicationDetailsHelper.getAllApplications();

                self.apps.forEach(app => {
                    let appInstalled = false

                    installedApps.forEach(installedApp => {
                        if (app.system_code == installedApp.systemCode)
                            appInstalled = true;
                    })

                    if (appInstalled) {
                        self.appConfigDetail.push(new ConfigDetail(
                            self.applicationDetailsHelper.getApplicationConfigBySystemCode(app
                                .system_code),
                            self.applicationDetailsHelper.getApplicationDetailsBySystemCode(app
                                .system_code)
                        ));
                    }


                })

                self.showLoader = false;
            },
            checkAccessType(callback) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${encoded_details.USER_ID}&tenantID=${sessionStorage.currentDatabase}`
                    )
                    .then(r => {



                        // if (r.data.isDatabaseOwner) {
                        //     callback("DATABASE-OWNER");
                        //     return;
                        // }
                        callback(r.data)
                        let tenantType = r.data.tenantLink_AccessTypeList[0].accessType;

                        // switch (tenantType) {
                        //     case 0:
                        //         {
                        //             callback("SUPERUSER");
                        //         }
                        //         break;
                        //     case 1:
                        //         {
                        //             callback("GENERAL");
                        //         }
                        //         break;
                        //     case 2:
                        //         {
                        //             callback("RETAILER");
                        //         }
                        //         break;
                        //     case 3:
                        //         {
                        //             callback("STORE");
                        //         }
                        //         break;
                        // }
                    })
            },
            getDatabases(userID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `TenantAccess?systemUserID=${userID}`)
                    .then(r => {

                        if (r.data.length > 0)
                            self.hasDatabases = true;
                        callback();
                    })
            },
            getAppsTmpAll() {
                let self = this;
                self.appConfigDetail = []
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.getDatabases(encoded_details.USER_ID, () => {
                    Axios.get(process.env.VUE_APP_API + `SystemUser?id=${encoded_details.USER_ID}`)
                        .then(r => {
                            self.applicationDetailsHelper = new ApplicationDetailsHelper();
                            self.apps = self.applicationDetailsHelper.getAllApplications();

                            self.apps.forEach(app => {
                                self.appConfigDetail.push(new ConfigDetail(
                                    self.applicationDetailsHelper
                                    .getApplicationConfigBySystemCode(
                                        app
                                        .system_code),
                                    self.applicationDetailsHelper
                                    .getApplicationDetailsBySystemCode(
                                        app
                                        .system_code)
                                ));
                            })

                            self.appAccess(self.appConfigDetail, callback => {
                                console.log("self.appConfigDetail");
                                console.log(self.appConfigDetail);
                                self.showLoader = false;

                            })

                        })
                })
            },
            getAppsTmpStore() {
                let self = this;

                self.applicationDetailsHelper = new ApplicationDetailsHelper();
                self.apps = self.applicationDetailsHelper.getAllApplications();

                self.apps.forEach(app => {
                    if (app.system_code == "SPACE-PLANNING") {
                        self.appConfigDetail.push(new ConfigDetail(
                            self.applicationDetailsHelper.getApplicationConfigBySystemCode(app
                                .system_code),
                            self.applicationDetailsHelper.getApplicationDetailsBySystemCode(app
                                .system_code)
                        ));
                    }
                })

                self.showLoader = false;
            }
        }
    }

    function ConfigDetail(config, detail, system_code) {
        this.config = config;
        this.detail = detail;
        this.system_code = system_code;
    }
</script>