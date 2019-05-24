<template>
    <v-card height="90vh">
        <v-container>
            <v-data-table :headers="headers" :items="items" class="elevation-1" hide-actions>
                <template v-slot:items="props">
                    <td>
                        <v-text-field hide-details v-model="props.item.SystemFileID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.DateFromString"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.DateToString"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.MonthsBetween"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Periodic"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.PlanogramID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.PlanogramName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Tag"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.StoreCluster"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.ClusterID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.ClusterType"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.ClusterName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.RangeID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.StoreID"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.StoreName"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.CategoryCluster"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Modules"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Height"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Width"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Displays"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Pallettes"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.SupplierStands"></v-text-field>
                    </td>
                    <td>
                        <v-text-field hide-details v-model="props.item.Bins"></v-text-field>
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
                    text: "SystemFileID "
                }, {
                    text: "DateFromString "
                }, {
                    text: "DateToString "
                }, {
                    text: "MonthsBetween "
                }, {
                    text: "Periodic "
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
                }, ]
            }
        },
        mounted() {
            let self = this
            self.getData()
        },
        methods: {
            getData() {
                let self = this
                Axios.get(process.env.VUE_APP_API + 'SystemFile?db=CR-Devinspire')
                    .then(r => {
                        console.log(r.data);
                        r.data.forEach(file => {
                            if(file.folder== "Space Planning"){
                            self.items.push({
                                PlanogramName:file.name,
                                SystemFileID:file.id
                            })
                            }
                        });

                    })

            },
            updateData(item) {
                let self = this

                // Axios.put(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=',item)
                //     .then(r => {1
                // self.items = r.data;
                // })
            },
        }
    }
</script>