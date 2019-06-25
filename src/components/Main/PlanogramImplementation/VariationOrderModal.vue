<template>
    <v-dialog v-model="dialog" max-width="700px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Order Variation
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md12>
                        <v-select v-model="selectedPlanoDetail" :items="planoDetails" label="Planogram"></v-select>
                    </v-flex>
                    <v-flex md12>
                        <v-text-field label="Store Name" disabled v-model="storeName"></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-text-field v-model="height" label="Height"></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-text-field v-model="width" label="Width"></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-text-field v-model="modules" label="Modules"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="displays" label="Displays"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="pallettes" label="Pallettes"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="supplierStands" label="Supplier Stands"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="bins" label="Bins"></v-text-field>
                    </v-flex>
                    <v-flex md12>
                        <v-textarea v-model="additionalNotes" outline label="Additional Notes"></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success">
                    send
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                height: null,
                width: null,
                modules: null,
                bins: null,
                displays: null,
                supplierStands: null,
                pallettes: null,
                additionalNotes: null,
                planoDetails: [],
                selectedPlanoDetail: null,
                storeName:null,
            }
        },
        methods: {
            show(item) {
                let self = this
                console.log(item);
                self.dialog = true
                self.height = item.height
                self.width = item.width
                self.modules = item.width
                self.bins = item.bins
                self.storeName = item.storeName
                self.displays = item.displays
                self.supplierStands = item.supplierStands
                self.pallettes = item.pallettes
                if(item.planogramDetail_ID!=0){
                self.selectedPlanoDetail = item.planogramDetail_ID
                }
            },
            close() {
                let self = this
                self.dialog = false
            },
            getPlanoDetails() {
                let self = this
                Axios.get(process.env.VUE_APP_API +"Planogram_Details").then(r=>{
                    console.log(r.data);
                    r.data.planogram_DetailsList.forEach(element => {
                       self.planoDetails.push({
                           text:element.fileName,
                           value:element.id
                       })                             
                    });
                }).catch(e=>{
                    console.log(e);
                })
            },
            buildString() {
                let self = this
                let string = "Variation requested for" + selectedPlanoDetail.text + "with the following details"
                string += "height : " + self.height
                string += "width : " + self.width
                string += "modules : " + self.modules
                string += "bins : " + self.bins
                string += "displays : " + self.displays
                string += "supplierStands : " + self.supplierStands
                string += "pallettes : " + self.pallettes
                string += "additionalNotes : " + self.additionalNotes
                return string
            },
            submit() {
                let self = this
                let text = self.buildString()

                // create tx group
                // then create tx with notes = text 

            },
        },
        created() {
            this.getPlanoDetails()
        },

    }
</script>