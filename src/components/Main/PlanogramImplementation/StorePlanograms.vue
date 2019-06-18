<template>
    <v-dialog persistent fullscreen v-model="dialog">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    Planograms assigned to {{title}}
                </v-toolbar-title>
               
                <v-spacer></v-spacer>
                <v-btn icon flat dark @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
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
        props: ["StoreID"],
        data() {
            return {
                currentStorePlanograms:[],
                store_ID:null,
                dialog: false,
                rowData: [],
                title: null,
                 StoreStatusList: [{
                        text: "Unassigned"
                    },

                    {
                        text: "DistrubutedToStore"
                    },
                    {
                        text: "ImplementationInProgress"
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "VariationRequested"
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
                            
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })
                        self.rowData = self.currentStorePlanograms
                    }).catch(e=>{
                        console.log(e);
                        
                    })
            },
            show(data) {
                let self = this
                self.dialog = true
                self.store_ID=data.store_ID
                self.title = data.storeName
                self.GetData(data)
            },
            close() {
                let self = this
                self.dialog = false
            },
        }

    }
</script>