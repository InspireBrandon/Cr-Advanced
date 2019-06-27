<template>
    <v-dialog persistent fullscreen v-model="dialog">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    Planograms : <strong>{{title}}</strong>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon flat dark @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
             <v-toolbar dark flat dense>
            </v-toolbar>
            <StoreGrid ref="StoreGrid" :rowData="rowData" :method="GetData" :StoreID="store_ID" />
            <PlanogramDetailsSelector :PlanoName="'Select'" ref="PlanogramDetailsSelector" />
        </v-card>
    </v-dialog>
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
        props: ["StoreID","getStoreData"],
        data() {
            return {
                currentStorePlanograms:[],
                store_ID:null,
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
                    },{
                        text:"On Hold"
                    }
                ],
            }
        },
        methods: {
            GetData(StoreID) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Store_Planogram?Store_ID=${StoreID.store_ID}`)
                    .then(r => {
                       self.rowData=[]   
                        self.currentStorePlanograms=[]
                        self.currentStorePlanograms = r.data.queryResult;
                        self.currentStorePlanograms.forEach((e) => {
                             e.GeneratedName = self.GenerateName(e)
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })
                        self.rowData = self.currentStorePlanograms
                        console.log(self.rowData);
                        
                    }).catch(e=>{
                        console.log(e);
                        
                    })
            },
            show(data) {
                let self = this
                self.dialog = true
                self.store_ID=data.store_ID
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