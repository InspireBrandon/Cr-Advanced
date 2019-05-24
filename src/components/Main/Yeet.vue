<template>
    <v-card height="90vh">
        <v-container>
            <v-data-table :headers="headers" :items="items" class="elevation-1">
                <template v-slot:items="props">
                    <td>
                        <v-text-field hide-details v-model="props.item.fileName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.fileID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.systemFileID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.dateFromString"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.dateToString"></v-text-field>
                    </td>
                    <td>
                        <v-checkbox v-model="props.item.periodic"></v-checkbox>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.monthsBetween"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.planogramID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.planogramName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.tag"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.storeCluster"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.clusterID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.clusterType"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.clusterName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.rangeID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.storeID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.storeName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.categoryCluster"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.modules"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.height"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.width"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.displays"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.pallettes"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.supplierStands"></v-text-field>
                    </td>
                    <td>
                        <v-text-field type="number" hide-details v-model="props.item.bins"></v-text-field>
                    </td>

                    <td>
                        <v-btn @click="updateData(props.item)">
                            update
                        </v-btn>
                    </td>
                </template>
            </v-data-table>
        </v-container>

    </v-card>
</template>

<script>
    import Axios from "axios"
    export default {
        data() {
            return {
                items: [],
                headers: [{
                    text: "fileName"
                }, {
                    text: "fileID "
                }, {
                    text: "systemFileID"
                }, {
                    text: "DateFromString "
                }, {
                    text: "DateToString "
                }, {
                    text: "Periodic "
                }, {
                    text: "MonthsBetween "
                }, {
                    text: "PlanogramID "
                }, {
                    text: "PlanogramName "
                }, {
                    text: "Tag "
                }, {
                    text: "StoreCluster "
                }, {
                    text: "ClusterID "
                }, {
                    text: "ClusterType "
                }, {
                    text: "ClusterName "
                }, {
                    text: "RangeID "
                }, {
                    text: "StoreID "
                }, {
                    text: "StoreName "
                }, {
                    text: "CategoryCluster  "
                }, {
                    text: "Modules "
                }, {
                    text: "Height "
                }, {
                    text: "Width "
                }, {
                    text: "Displays "
                }, {
                    text: "Pallettes "
                }, {
                    text: "SupplierStands "
                }, {
                    text: "Bins "
                }]
            }
        },
        mounted() {
            let self = this
            self.getData()
        },
        methods: {
            getData() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Planogram_Details').then(res => {
                    console.log("res");
                    console.log(res);
                    res.data.planogram_DetailsList.forEach(element => {
                        element.systemFileID = element.fileID
                        self.items.push(element)
                    });
                    //  self.items=res.data.planogram_DetailsList

                    delete Axios.defaults.headers.common["TenantID"];

                })

                // Axios.get(process.env.VUE_APP_API + 'SystemFile?db=CR-Devinspire')
                //     .then(r => {
                //         console.log(r.data);
                //         r.data.forEach(file => {
                //             if(file.folder== "Space Planning"){
                //             self.items.push({
                //                 PlanogramName:file.name,
                //                 SystemFileID:file.id
                //             })
                //             }
                //         });

                //     })

            },
            updateData(item) {
                let self = this

                let request = JSON.parse(JSON.stringify(item))

                let sendRequst = {
                    "systemFileID": request.systemFileID,
                    "dateFromString": request.dateFromString,
                    "dateToString": request.dateToString,
                    "monthsBetween": request.monthsBetween,
                    "periodic": request.periodic,
                    "planogramID": parseInt(request.planogramID),
                    "planogramName": request.planogramName,
                    "tag": request.tag,
                    "storeCluster": request.storeCluster,
                    "clusterID": parseInt(request.clusterID),
                    "clusterType": request.clusterType,
                    "clusterName": request.clusterName,
                    "rangeID": parseInt(request.rangeID),
                    "storeID": parseInt(request.storeID),
                    "storeName": request.storeName,
                    "categoryCluster": request.categoryCluster,
                    "modules": parseInt(request.modules),
                    "height": parseFloat(request.height),
                    "width": parseFloat(request.width),
                    "displays": parseInt(request.displays),
                    "pallettes": parseInt(request.pallettes),
                    "supplierStands": parseInt(request.supplierStands),
                    "bins": parseInt(request.bins)
                }

                console.log(sendRequst);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                if (request.id == 0) {
                    Axios.post(process.env.VUE_APP_API + 'Planogram_Details', sendRequst)
                        .then(r => {
                            alert("CREATED NEW:" + request.fileName)
                            console.log(r);


                            delete Axios.defaults.headers.common["TenantID"];


                        })

                } else {
                    Axios.put(process.env.VUE_APP_API + 'Planogram_Details', request)
                        .then(r => {
                            alert("updated :" + request.fileName)
                            delete Axios.defaults.headers.common["TenantID"];


                        })
                }

            },
        }
    }
</script>