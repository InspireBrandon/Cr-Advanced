<template>
    <div>
        <v-toolbar dark dense color="grey darken-3">
            <v-toolbar-items>
                <!-- <v-btn @click="openPlanogramSelector" color="primary">test</v-btn> -->
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="closeFile">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Catagory Cluster
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items v-if="selectedPlanogram!=null">
                <v-select label="Primary Cluster" style="margin-left: 10px; margin-top: 8px; width: 150px"
                    placeholder="Item Percentage" @change="onPercentChange" dense :items="primaryClusters"
                    v-model="primaryCluster" hide-details></v-select>
                <v-select @change="onPercentChange" v-if="primaryCluster != 10" label="Secondary Cluster"
                    style="margin-left: 10px; margin-top: 8px; width: 150px" placeholder="Item Percentage" dense
                    :items="secondaryClusters" v-model="secondaryCluster" hide-details>
                </v-select>
                <v-select @change="onPercentChange" label="Groups"
                    style="margin-left: 10px; margin-top: 8px; width: 150px" dense :items="groups" v-model="group"
                    hide-details>
                </v-select>
                <v-select @change="onPercentChange" label="Levels"
                    style="margin-left: 10px; margin-top: 8px; width: 150px" dense :items="levels" v-model="level"
                    hide-details>
                </v-select>
                <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" :items="category"
                    v-model="selectedCategory" placeholder="Select category" hide-details @change="runQuery">
                </v-select>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <span v-if=" selectedPlanogram !=null">{{ selectedPlanogram.displayname }} </span>
            <v-spacer></v-spacer>
            <!-- <v-btn-toggle v-if="storeRowData.length > 0" round v-model="selectedView" class="transparent" mandatory>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(0)" color="primary">
                    Store
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(1)" color="primary">
                    Product
                </v-btn>
            </v-btn-toggle> -->
            <v-spacer></v-spacer>
        </v-toolbar>
        <PlanogramSelector ref="PlanogramSelector" />
        <DateRangeSelector ref="DateRangeSelector" />
        <DataSelector ref="DataSelector" />
        <storeGrid v-if="selectedView==0  && storeRowData.length > 0" ref="storeGrid" :rowData="storeRowData" />
        <BrandGrid ref="BrandGrid" :rowData="rowData" :headers="headers" v-if="selectedView==1 && rowData.length > 0"
            :stores="stores" />
        <Spinner ref="Spinner" />
        <FileSelector ref="FileSelector" />


    </div>
</template>
<script>
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    import Spinner from '@/components/Common/Spinner';
    import BrandGrid from "./Grid"
    import Axios from 'axios'
    import DateRangeSelector from '@/components/Common/DateRangeSelector';
    import PlanogramSelector from '@/components/Common/PlanogramSelector'
    import ListingClusterController from './controller.js';
    import storeGrid from './storeGrid';
    import FileSelector from './FileSelector'



    // import PlanogramSelector from '../ListingClusters/PlanogramSelector'
    import DataSelector from "./DataSelector"

    export default {
        components: {
            FileSelector,
            BrandGrid,
            Spinner,
            DateRangeSelector,
            PlanogramSelector,
            storeGrid,
            DataSelector
        },
        data() {
            return {
                storeRowData: [],
                selectedView: 1,
                headers: [],
                stores: [],
                primaryCluster: 6,
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
                ProjectGroups: []
            }

        },
        methods: {
            openFile() {
                let self = this;

                self.$refs.FileSelector.show(file => {
                    // TODO add loader
                    Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${file.id}`)
                        .then(r => {
                            console.log("openFile");
                            console.log(r);

                            self.salesData = r.data.salesData;
                            self.selectedPlanogram = r.data.config.planogramData;
                            self.selectedPeriod = r.data.config.periodData;

                            self.primaryCluster = r.data.config.setup.primaryCluster;
                            self.secondaryCluster = r.data.config.setup.secondaryCluster;
                            self.level = r.data.config.setup.level;
                            self.group = r.data.config.setup.group;

                            self.onPercentChange();
                        })
                })
            },
            closeFile() {
                let self = this;
                self.selectedCategory = null;
                self.salesData = null;
                self.selectedPlanogram = null;
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
                        `SystemFile/JSON?db=CR-Devinspire&folder=Category Cluster&file=REPORT`)
                    .then(r => {
                        console.log(r);

                        callback(r.data);
                    })
            },
            saveFile() {
                let self = this;
                self.getFile(fileTransaction => {
                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            CategoryClustering: {},
                            salesData: self.salesData,
                            config: {
                                planogramData: self.selectedPlanogram,
                                periodData: self.selectedPeriod,
                                setup: {
                                    primaryCluster: self.primaryCluster,
                                    secondaryCluster: self.secondaryCluster,
                                    level: self.level,
                                    group: self.group
                                }
                            }
                        }

                        tmp.CategoryClustering[self.selectedPlanogram.displayname] = self.storeRowData;

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp.CategoryClustering == undefined) {
                                tmp.CategoryClustering = {};
                            }

                            tmp.CategoryClustering[self.selectedPlanogram.displayname] = self
                                .storeRowData;
                            tmp.salesData = self.salesData,
                                tmp.config = {
                                    planogramData: self.selectedPlanogram,
                                    periodData: self.selectedPeriod,
                                    setup: {
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
                            Folder: "Category Cluster",
                            Name: self.selectedPlanogram.planogram_ID,
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
                self.$refs.DataSelector.show(data => {
                    console.log(data);
                })
            },
            newFile() {
                let self = this;

                self.$refs.PlanogramSelector.show(false, planogram => {
                    // self.$refs.DateRangeSelector.show(dateRange => {
                    // console.log(dateRange);
                    self.selectedPlanogram = planogram
                    console.log(self.selectedPlanogram);

                    // self.selectedPlanogram = planogram.planogram_ID
                    // self.selectedPlanogramName = planogram.displayname
                    // self.selectedPeriod = dateRange;
                })
                // })
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
                            clusterGroups: self.group,
                            selectedCategory: self.selectedCategory
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
                console.log("orderRowData", projectGroup);




            },
            setHeaders() {
                let self = this;
                let tmpCategory = null
                //console.log("setting Headers");
                switch (self.selectedCategory) {
                    case 0:
                        tmpCategory = "category"
                        break;
                    case 1:
                        tmpCategory = "subcategory"
                        break;
                    case 2:
                        tmpCategory = "brand_Name"
                        break;
                    case 3:
                        tmpCategory = "manufacturer"
                        break;
                    case 4:
                        tmpCategory = "supplier"
                        break;
                    case 5:
                        tmpCategory = "size_Description"
                        break;

                    default:
                        break;
                }

                let tmp = [{
                        headerName: 'Store Name',
                        field: 'storeName'
                    },
                    {
                        headerName: 'Cluster',
                        field: 'cluster'
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
                        headerName: 'Stack bar',
                        cellRendererFramework: "DeptRenderer",
                        width: 220

                    },{
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
                console.log("self.ProjectGroups", self.ProjectGroups);

                self.ProjectGroups.forEach((projectGroup, idx) => {
                    if (idx == 0) {
                        let tmp = self.rowData
                        self.rowData = tmp.sort((a, b) => {
                            if (a[projectGroup[tmpCategory] + "_ratio"] > b[projectGroup[tmpCategory] +
                                    "_ratio"]) {
                                return -1;
                            }
                            if (a[projectGroup[tmpCategory] + "_ratio"] < b[projectGroup[tmpCategory] +
                                    "_ratio"]) {
                                return 1;
                            }
                            return 0;
                        })
                    }
                    tmp.push({
                        headerName: projectGroup[tmpCategory],
                        children: [{
                                headerName: "Ratio",
                                width: 100,
                                "valueFormatter": function (params) {
                                    if (params.data[projectGroup[tmpCategory] +
                                            "_inStore"] ==
                                        false) {
                                        return 0
                                    } else {
                                        return ((parseFloat(params.data[projectGroup[
                                                tmpCategory] + "_ratio"])) * 100)
                                            .toFixed(2)
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
                                field: projectGroup[tmpCategory] + "_inStore",
                                width: 100,
                                valueFormatter: function (params) {
                                    return formatter.format(params.value).replace("$",
                                        "R");
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
                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    self.$refs.Spinner.show()

                    Axios.get(process.env.VUE_APP_API +
                            // `Cluster/CategoryClustering?Planogram_ID=${self.selectedPlanogram.planogram_ID}&level=${self.selectedCategory}&PeriodFrom=${self.selectedPeriod.dateFrom}&PeriodTo=${self.selectedPeriod.dateTo}`
                            `Cluster/CategoryClustering?Planogram_ID=${self.selectedPlanogram.planogram_ID}&level=${self.selectedCategory}&PeriodFrom=53&PeriodTo=58`
                        )
                        .then(r => {
                            console.log(r)
                            self.salesData = r.data
                            // self.rowData=r.data
                            let lcData = ListingClusterController.GenerateClusterOutput({
                                storeSalesData: r.data,
                                primaryCluster: self.primaryCluster,
                                secondaryCluster: self.secondaryCluster,
                                clusterLevels: self.level,
                                clusterGroups: self.group,
                                selectedCategory: self.selectedCategory
                            })
                            console.log(lcData);
                            self.storeRowData = lcData.storeData;
                            self.rowData = lcData.ProjectGroupData;
                            self.stores = lcData.stores;
                            self.ProjectGroups = lcData.ProjectGroups


                            //      self.storeRowData = lcData.storeData;
                            // self.rowData = lcData.ProjectGroupData;
                            // self.stores = lcData.stores;
                            self.ProjectGroups = lcData.ProjectGroups
                            self.setHeaders()
                            self.$refs.Spinner.hide()

                            // self.productRowData = lcData.productData;
                        })
                })
            },
        }
    }
</script>