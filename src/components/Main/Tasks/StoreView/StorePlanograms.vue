<template>
    <v-card flat>
        <StoreGrid ref="StoreGrid" :rowData="rowdata" :method="GetData" :StoreID="store_ID" />
        <v-card v-if="rowdata.length==0">
            <v-card-text>
                No Planograms Have been assigned</v-card-text>
        </v-card>
        <PlanogramDetailsSelector :PlanoName="'Select'" ref="PlanogramDetailsSelector" />
    </v-card>
</template>
<script>
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'

    import StoreGrid from './StoreGrid'
    import Axios from 'axios'
    export default {
        components: {
            StoreGrid,
            PlanogramDetailsSelector,
        },
        props: ["StoreID", "getStoreData", "rowdata"],
        data() {
            return {
                currentStorePlanograms: [],
                store_ID: null,
                dialog: false,
                rowData: [],
                title: null,
                StoreStatusList: [{
                        text: "Unassigned"
                    }, {
                        text: "Assigned"
                    },
                    {
                        text: "Distrubuted"
                    },
                    {
                        text: "Implementation In Progress"
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "Variation"
                    }, {
                        text: "On Hold"
                    }
                ],
            }
        },
        mounted() {
            let self = this


            // self.GetData(() => {

            // });
        },
        methods: {
            GetData(store_ID) {
                let self = this
                store_ID = 124489
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Store_Planogram?Store_ID=${store_ID}`)
                    .then(r => {
                        self.rowData = []
                        self.currentStorePlanograms = []
                        self.currentStorePlanograms = r.data.queryResult;

                        r.data.queryResult.forEach((e) => {
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })

                        self.rowData = self.currentStorePlanograms

                        console.log(self.rowData);

                    }).catch(e => {
                        console.log(e);

                    })
            },
            show(data) {
                let self = this
                self.dialog = true
                self.store_ID = data.store_ID
                self.title = data.storeName
                self.$refs.StoreGrid.resize()
                self.GetData(data)
            },
            close() {
                let self = this
                self.getStoreData()
                self.dialog = false
            },
            GenerateName(data) {
                if (data.planogramID == 0) {
                    return null
                }
                let planogramName = data.planogramName
                if (planogramName != null) {

                    planogramName += " - " + data.monthsBetween + "MMA";
                } else {
                    planogramName += " - " + data.dateFromString + " to " + data.dateToString;
                }
                if (data.tag != null && data.tag != "")
                    planogramName += data.tag;

                if (data.storeCluster != null && data.storeCluster != "") {
                    planogramName += " - " + data.storeCluster;
                }

                if (data.storeName != null && data.storeName != "") {
                    planogramName += " - " + data.storeName;
                }

                if (planogramName != "")
                    planogramName += " - XXX";

                planogramName += " - " + data.modules + " Module " + "(" + data.height + "M" + " x " +
                    data.width + "M)";

                if (planogramName[1] == "-")
                    planogramName = planogramName.replace(' -', "");

                if (planogramName != "") {
                    planogramName += " - D" + data.displays;
                    planogramName += " - P" + data.pallettes;
                    planogramName += " - S" + data.supplierStands;
                    planogramName += " - B" + data.bins;
                }
                return planogramName
            },
        }

    }
</script>