<template>
    <div>
        <v-toolbar dark>
            <v-toolbar-title>
                Department
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <div v-if="selectedBasket != null">{{ generateName() }}</div> -->
            <v-spacer></v-spacer>

        </v-toolbar>
        <storeGrid v-if="selectedView==0  && storeRowData.length > 0" ref="storeGrid" :rowData="storeRowData" />
        <BrandGrid ref="BrandGrid" :rowData="rowData" :headers="headers" v-if="selectedView==1 && rowData.length > 0"
            :stores="stores" />
        <Spinner ref="Spinner" />
    </div>
</template>
<script>
    import Spinner from '@/components/Common/Spinner';
    import BrandGrid from "./Grid"
    import Axios from 'axios'
    import ListingClusterController from '../../Department/controller.js';
    import storeGrid from './storeGrid';

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    export default {
        components: {
            BrandGrid,
            Spinner,
            storeGrid,
        },
        data() {
            return {
                projectsGroupItems: [],
                selectedProjectGroup: null,
                storeRowData: [],
                selectedView: 1,
                headers: [],
                stores: [],
                primaryCluster: 5,
                primaryClusters: [{
                        text: "10%",
                        value: 1
                    },
                    {
                        text: "20%",
                        value: 2
                    },
                    {
                        text: "30%",
                        value: 3
                    },
                    {
                        text: "40%",
                        value: 4
                    },
                    {
                        text: "50%",
                        value: 5
                    },
                    {
                        text: "60%",
                        value: 6
                    },
                    {
                        text: "70%",
                        value: 7
                    },
                    {
                        text: "80%",
                        value: 8
                    },
                    {
                        text: "90%",
                        value: 9
                    },
                    {
                        text: "100%",
                        value: 10
                    },
                ],
                secondaryCluster: 3,
                secondaryClusters: [{
                        text: "10%",
                        value: 1
                    },
                    {
                        text: "20%",
                        value: 2
                    },
                    {
                        text: "30%",
                        value: 3
                    },
                    {
                        text: "40%",
                        value: 4
                    },
                    {
                        text: "50%",
                        value: 5
                    },
                    {
                        text: "60%",
                        value: 6
                    },
                    {
                        text: "70%",
                        value: 7
                    },
                    {
                        text: "80%",
                        value: 8
                    },
                    {
                        text: "90%",
                        value: 9
                    },
                    {
                        text: "100%",
                        value: 10
                    },
                ],
                level: 3,
                levels: [1, 2, 3, 4, 5],
                group: 3,
                groups: [1, 2, 3],
                category: [{
                    text: "Category",
                    value: 0
                }, {
                    text: "Sub category",
                    value: 1
                }, {
                    text: "Brand",
                    value: 2
                }, {
                    text: "Manufacturer",
                    value: 3
                }, {
                    text: "Supplier",
                    value: 4
                }, {
                    text: "Size Description",
                    value: 5
                }],
                selectedCategory: null,
                rowData: [],
                brands: [],
                salesData: [],
                selectedBrands: null,
                selectedPlanogramName: null,
                selectedPlanogram: null,
                selectedPeriod: null,
                ProjectGroups: null,
            }
        },
        mounted() {
            let self = this;

            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        self.runData = [];

                        self.fileData = fileData.departmentCluster;

                        for (var prop in fileData.departmentCluster) {
                            self.runData.push({
                                prop: prop,
                                name: prop
                            })
                        }
                        self.openFile()
                    })
                }
            })
        },
        methods: {
            generateName() {
                let self = this;
                let name = "";

                if (self.selectedProjectGroup.text != null) {
                    if (self.selectedPeriod.periodic) {
                        name =
                            `${self.selectedProjectGroup.text} - ${self.selectedPeriod.monthsBetween} MMA`
                    } else {
                        name =
                            `${self.selectedProjectGroup.text} Average Monthly ${self.selectedPeriod.dateFromString} TO ${self.selectedPeriod.dateToString}`
                    }
                }

                return name;
            },
            getProjectGroups() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + "ProjectGroup").then(r => {
                    self.projectsGroupItems = [{
                        text: "Group Overview",
                        value: 0
                    }]

                    r.data.projectGroupList.forEach(group => {
                        self.projectsGroupItems.push({
                            text: group.name,
                            value: group.id
                        })
                    })

                    self.selectedProjectGroup = {
                        text: "Group Overview",
                        value: 0
                    };
                })

            },
            openFile() {
                let self = this;

                let item = self.$route.params
                let data = self.fileData["DIY - Paint and Allied - 6 MMA"];

                self.salesData = data.data;
                self.selectedPlanogram = data.config.selectedPlanogram;
                self.selectedCategory = data.config.selectedCategory;
                self.selectedPeriod = data.config.selectedPeriod;
                self.primaryCluster = data.config.primaryCluster;
                self.secondaryCluster = data.config.secondaryCluster;
                self.level = data.config.level;
                self.group = data.config.group;
                self.onPercentChange();
            },
            closeFile() {
                let self = this;
                self.selectedCategory = null;
                self.selectedProjectGroup = nulll
                self.salesData = null;
                self.selectedProjectGroup = null;
                self.selectedPeriod = null;

                self.primaryCluster = 5;
                self.secondaryCluster = 3;
                self.level = 3;
                self.group = 3;

                self.storeRowData = [];
                self.stores = [];
                self.rowData = [];
                self.productRowData = [];
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=Department Cluster&file=REPORT`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            saveFile() {
                let self = this;
                self.getFile(fileTransaction => {
                    if (fileTransaction == null || fileTransaction == false) {

                        let tmp = {
                            departmentCluster: {}
                        };

                        tmp.departmentCluster[self.generateName()] = {
                            data: self.salesData,
                            config: {
                                selectedPlanogram: self.selectedPlanogram,
                                selectedCategory: self.selectedCategory,
                                selectedProjectGroup: self.selectedProjectGroup,
                                selectedPeriod: self.selectedPeriod,
                                primaryCluster: self.primaryCluster,
                                secondaryCluster: self.secondaryCluster,
                                level: self.level,
                                group: self.group
                            }
                        }

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp.departmentCluster == undefined) {
                                tmp.departmentCluster = {};
                            }

                            tmp.departmentCluster[self.generateName()] = {
                                data: self.salesData,
                                config: {
                                    selectedPlanogram: self.selectedPlanogram,
                                    selectedCategory: self.selectedCategory,
                                    selectedPeriod: self.selectedPeriod,
                                    primaryCluster: self.primaryCluster,
                                    secondaryCluster: self.secondaryCluster,
                                    level: self.level,
                                    group: self.group
                                }
                            }

                            self.appendAndSaveFile(tmp);
                        })
                    }
                })
            },
            getFileData(id, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            appendAndSaveFile(fileData) {
                let self = this

                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "Department Cluster",
                            Name: "REPORT",
                            Extension: '.json'
                        },
                        Data: fileData
                    })
                    .then(r => {
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
            changeView(type) {
                let self = this
                self.selectedView = type;
            },
            openDataSelector() {
                let self = this
                self.$refs.DataSelector.show(data => {})
            },
            newFile() {
                let self = this;
                self.$nextTick(() => {
                    self.$refs.DateRangeSelector.show(dateRange => {



                        self.selectedPeriod = dateRange;
                        self.runQuery()
                    })
                })
            },
            onPercentChange() {
                let self = this;
                self.$nextTick(() => {
                    self.$refs.Spinner.show()
                    if (self.secondaryCluster != null) {

                        let lcData = ListingClusterController.GenerateClusterOutput({
                            storeSalesData: self.salesData,
                            primaryCluster: self.primaryCluster,
                            secondaryCluster: self.secondaryCluster,
                            clusterLevels: self.level,
                            clusterGroups: self.group
                        });

                        self.storeRowData = lcData.storeData;
                        self.rowData = lcData.ProjectGroupData;
                        self.stores = lcData.stores;
                        self.ProjectGroups = lcData.ProjectGroups
                        self.setHeaders()
                        self.$refs.Spinner.hide()
                    }
                })
            },
            orderRowData(projectGroup) {
                let self = this
                let tmp = self.rowData

                self.rowData = tmp.sort((a, b) => {
                    if (a[projectGroup.projectGroup + "_ratio"] > b[projectGroup.projectGroup + "_ratio"]) {
                        return -1;
                    }
                    if (a[projectGroup.projectGroup + "_ratio"] < b[projectGroup.projectGroup + "_ratio"]) {
                        return 1;
                    }
                    return 0;
                })


            },
            setHeaders() {
                let self = this;

                let tmp = [{
                        headerName: 'Store Name',
                        field: 'storeName'
                    },
                    {
                        headerName: 'Total Sales',
                        field: 'totalStoreSales',
                        valueFormatter: function (params) {
                            return formatter.format(params.value).replace("$", "R");
                        }
                    }, {
                        headerName: 'Cumulative Sales',
                        cellRendererFramework: "progressRenderer"
                    },
                    {
                        headerName: 'Cluster',
                        field: 'cluster'
                    },
                    {
                        headerName: 'Stack bar',
                        cellRendererFramework: "DeptRenderer",
                        width: 220
                    }, {
                        headerName: 'Area (m)',
                        field: 'sqm_Shop'
                    }, {
                        headerName: "Cumulative Sales",
                        field: "cumulativStoreSales",
                        cellStyle: function (params) {
                            if (params.data.canHighlight) {
                                if (params.data.highlightLevel == 1) {
                                    return {
                                        backgroundColor: "#9c9c9c"
                                    };
                                }

                                if (params.data.highlightLevel == 2) {
                                    return {
                                        backgroundColor: "#b9b9b9"
                                    };
                                }

                                if (params.data.highlightLevel == 3) {
                                    return {
                                        backgroundColor: "#e0e0e0"
                                    };
                                }
                            }
                        }
                    }
                ]

                self.ProjectGroups.forEach((projectGroup, idx) => {
                    if (idx == 0) {
                        self.orderRowData(projectGroup)
                    }
                    tmp.push({
                        headerName: projectGroup.projectGroup,
                        children: [{
                                headerName: "Ratio",
                                width: 100,
                                "valueFormatter": function (params) {
                                    if (params.data[projectGroup.projectGroup + "_inStore"] ==
                                        false) {
                                        return 0
                                    } else {
                                        return ((parseFloat(params.data[projectGroup
                                            .projectGroup + "_ratio"])) * 100).toFixed(2)
                                    }
                                },
                                cellStyle: function (params) {
                                    if (projectGroup.canHighlight) {

                                        if (projectGroup.highlightLevel == 1) {
                                            return {
                                                backgroundColor: "#5ef35e86"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 2) {
                                            return {
                                                backgroundColor: "#5ef35e40"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 3) {
                                            return {
                                                backgroundColor: "#5ef35e17"
                                            };
                                        }
                                    }
                                }
                            },
                            {
                                headerName: "In Store",
                                field: projectGroup.projectGroup + "_inStore",
                                width: 100,
                                valueFormatter: function (params) {
                                    return formatter.format(params.value).replace("$", "R");
                                },
                                cellStyle: function (params) {
                                    if (projectGroup.canHighlight) {

                                        if (projectGroup.highlightLevel == 1) {
                                            return {
                                                backgroundColor: "#5ef35e86"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 2) {
                                            return {
                                                backgroundColor: "#5ef35e40"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 3) {
                                            return {
                                                backgroundColor: "#5ef35e17"
                                            };
                                        }
                                    }
                                }
                            }
                        ]
                    })
                })
                self.headers = tmp;
            },
            runQuery() {
                let self = this


                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.$refs.Spinner.show()

                Axios.get(process.env.VUE_APP_API +
                        `Cluster/DepartmentClustering?PeriodFrom=${self.selectedPeriod.dateFrom}&PeriodTo=${self.selectedPeriod.dateTo}&ProjectGroupID=${self.selectedProjectGroup.value}`
                    )
                    .then(r => {
                        self.salesData = r.data

                        let lcData = ListingClusterController.GenerateClusterOutput({
                            storeSalesData: r.data,
                            primaryCluster: self.primaryCluster,
                            secondaryCluster: self.secondaryCluster,
                            clusterLevels: self.level,
                            clusterGroups: self.group
                        })

                        self.storeRowData = lcData.storeData;
                        self.rowData = lcData.ProjectGroupData;
                        self.stores = lcData.stores;
                        self.ProjectGroups = lcData.ProjectGroups

                        self.setHeaders()
                        self.$refs.Spinner.hide()
                    })
            }
        }
    }
</script>