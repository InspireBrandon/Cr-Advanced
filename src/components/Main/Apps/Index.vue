<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md style="height: calc(100vh - 65px); overflow-x: auto;">
            <v-layout row wrap>
                <v-flex xl3 lg4 md4 sm6 xs12 v-for="(appConfigDetail, index) in appConfigDetail" :key="index">
                    <app-block :appConfigDetail="appConfigDetail"></app-block>
                </v-flex>
            </v-layout>
            <!-- <v-layout row wrap>
                <v-flex lg12 md12 sm12 xs12 v-if="!hasDatabases">
                    <v-card>
                        <v-card-text>
                            It appears as though you do not have access to any databases. Please request access to
                            continue...
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout> -->
            <!-- <PlanogramNoteViewer/> -->
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import ApplicationDetailsHelper from '@/libs/system/application/application-details-helper.js';
    import app_block from '@/components/Main/Apps/app_block.vue';
    import PlanogramNoteViewer from '@/components/Common/PlanogramNoteViewer.vue';

    export default {
        name: 'apps',
        components: {
            'app-block': app_block,
            PlanogramNoteViewer
        },
        data() {
            return {
                showLoader: true,
                apps: [],
                appConfigDetail: [],
                applicationHelper: null,
                applicationConfigHelper: null,
                applicationDetailsHelper: null,
                hasDatabases: false,
                userType: -1,
                systemUserID: -1
            }
        },
        created() {
            let self = this;

            // IF DOING KAK then set timeout
            let encoded_details = jwt.decode(sessionStorage.accessToken);

            let systemUserID = encoded_details.USER_ID;
            let tenantID = sessionStorage.currentDatabase;

            self.systemUserID = encoded_details.USER_ID;

            self.getUserDetails(systemUserID, tenantID)
                .then(userType => {
                    self.userType = userType;
                    self.getAppsFromManifest();
                })
        },
        methods: {
            getUserDetails(systemUserID, tenantID) {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API +
                            `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                        .then(r => {
                            let userType = 0;

                            if (!r.data.isDatabaseOwner) {
                                userType = r.data.tenantLink_AccessTypeList[0].accessType
                            }

                            resolve(userType);
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getAppsFromManifest() {
                let self = this;

                self.applicationDetailsHelper = new ApplicationDetailsHelper();
                self.apps = self.applicationDetailsHelper.getAllApplications();

                self.apps.forEach(app => {

                    let newConfigDetail = new ConfigDetail(
                        self.applicationDetailsHelper.getApplicationConfigBySystemCode(app.system_code),
                        self.applicationDetailsHelper.getApplicationDetailsBySystemCode(app.system_code),
                        app.system_code
                    )

                    let handledUserApp = self.handleUserApps(newConfigDetail)

                    self.appConfigDetail.push(handledUserApp);
                })

                self.showLoader = false;
            },
            handleUserApps(app) {
                let self = this;

                switch (self.userType) {
                    case 1: {
                        // Handle Super User
                        app = self.handleBuyer(app);
                    }
                    break;
                case 1: {
                    // Handle Buyer
                    app = self.handleBuyer(app);
                }
                break;
                case 2: {
                    // Handle Supplier
                    app = self.handleSupplier(app);
                }
                break;
                case 3: {
                    // Handle Store
                    app = self.handleSuperUser(app);
                }
                break;
                }

                return app;
            },
            handleSuperUser(app) {
                switch (app.system_code) {
                    case "RANGE-PLANNING": {
                        app["demo"] = false;
                    }
                    break;
                case "SPACE-PLANNING": {
                    app.config.routes = [{
                        "route": "/SpacePlanning",
                        "routeName": "space_planning",
                        "title": "Space Planning",
                        "openInNewWindow": false
                    }, {
                        "route": "/Fixtures",
                        "routeName": "fixtures",
                        "title": "Default Fixtures",
                        "openInNewWindow": false
                    }, {
                        "route": "/PlanogramImplementation",
                        "routeName": "plannogram_implementation",
                        "title": "Planogram Implementation",
                        "openInNewWindow": false
                    }];

                    app["demo"] = false;
                }
                break;
                case "PRODUCT-MAINTENANCE": {
                    app["demo"] = false;
                }
                break;
                case "DATA-IMPORT": {
                    app["demo"] = false;
                }
                break;
                case "PROJECT-PLANNING": {
                    app["demo"] = false;
                }
                break;
                case "TASKS": {
                    app["demo"] = false;
                }
                break;
                case "FLOOR-PLANNING": {
                    app["demo"] = false;
                }
                break;
                case "CLUSTERING": {
                    app["demo"] = false;
                }
                break;
                }

                return app;
            },
            handleBuyer(app) {
                let self = this;

                switch (app.system_code) {
                    case "RANGE-PLANNING": {
                        app["demo"] = true;
                    }
                    break;
                case "SPACE-PLANNING": {
                    if (self.systemUserID == 16 || self.systemUserID == 48 || self.systemUserID == 43) {
                        app.config.routes = [{
                            "route": "/PlanogramDistribution/null/null",
                            "routeName": "plannogram_distribution",
                            "title": "Planogram Distribution",
                            "openInNewWindow": false
                        }];

                        app["demo"] = false;
                    } else
                        app["demo"] = true;
                }
                break;
                case "PRODUCT-MAINTENANCE": {
                    app["demo"] = true;
                }
                break;
                case "DATA-IMPORT": {
                    app["demo"] = true;
                }
                break;
                case "PROJECT-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "TASKS": {
                    app["demo"] = false;
                }
                break;
                case "FLOOR-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "CLUSTERING": {
                    app["demo"] = true;
                }
                break;
                }

                return app;
            },
            handleSupplier(app) {
                switch (app.system_code) {
                    case "RANGE-PLANNING": {
                        app["demo"] = true;
                    }
                    break;
                case "SPACE-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "PRODUCT-MAINTENANCE": {
                    app["demo"] = true;
                }
                break;
                case "DATA-IMPORT": {
                    app["demo"] = true;
                }
                break;
                case "PROJECT-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "TASKS": {
                    app["demo"] = false;
                }
                break;
                case "FLOOR-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "CLUSTERING": {
                    app["demo"] = true;
                }
                break;
                }

                return app;
            },
            handleStore(app) {
                switch (app.system_code) {
                    case "RANGE-PLANNING": {
                        app["demo"] = true;
                    }
                    break;
                case "SPACE-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "PRODUCT-MAINTENANCE": {
                    app["demo"] = true;
                }
                break;
                case "DATA-IMPORT": {
                    app["demo"] = true;
                }
                break;
                case "PROJECT-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "TASKS": {
                    app["demo"] = false;
                }
                break;
                case "FLOOR-PLANNING": {
                    app["demo"] = true;
                }
                break;
                case "CLUSTERING": {
                    app["demo"] = true;
                }
                break;
                }

                return app;
            }
        }
    }

    function ConfigDetail(config, detail, system_code) {
        this.config = config;
        this.detail = detail;
        this.system_code = system_code;
    }
</script>