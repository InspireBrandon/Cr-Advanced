<template>
    <v-card tile flat>
        <v-toolbar dark dense>
            <v-btn flat @click="$router.back()">
                <v-icon>arrow_left</v-icon>
                <span>Back</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Procedures</v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-layout>
                <v-flex md9>
                    <v-card tile flat class="procedure_block">
                        <v-card-text>
                            <div style="display: table; width: 100%;">
                                <div style="display: table-cell;">
                                    <h2>Procedures</h2>
                                </div>
                                <div style="display: table-cell; text-align: right;">
                                    <v-btn small color="primary" text class="ma-0 mb-2" @click="createNewProcedure">New
                                        procedure</v-btn>
                                </div>
                            </div>
                            <v-divider class="mb-3"></v-divider>
                            <ProcedureBlock class="mb-2" v-for="(i,idx) in procedures" :key="idx" :item="i"
                                :renameItem="renameItem" :deleteItem="deleteItem" :addNewStep="addNewStep" />
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md3>
                    <v-card tile flat class="procedure_block">
                        <v-card-text>
                            <h3>Description</h3>
                            <p>Procedures allow you to define the processes involved in creating a promotion</p>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <Prompt ref="Prompt" />
        <YesNoModal ref="YesNoModal" />
    </v-card>
</template>

<script>
    import ProcedureBlock from './ProcedureBlock.vue'
    import axios from "axios"
    import Prompt from "@/components/Common/Prompt";
    import YesNoModal from "@/components/Common/YesNoModal.vue";



    export default {
        components: {
            ProcedureBlock,
            Prompt,
            YesNoModal
        },
        data() {
            return {
                procedures: []
            }
        },
        mounted() {
            this.getProcedures()
        },
        methods: {
            addNewStep(item, step) {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                console.log("item", item);
                console.log("step", step);
                step.promotion_Procedure_ID = item.id
                axios.post(process.env.VUE_APP_API + `PromotionProcedureStep`, step).then(r => {
                    console.log("addNewStep",r);
                    
                })
                // PromotionProcedureStep
            },
            renameItem(item) {
                let self = this
                // self.$refs.Prompt.show("Name", "Please enter a new name for the procedure", "Procedure name",
                //     afterRuturn => {
                //         item.Description = afterRuturn
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.put(process.env.VUE_APP_API + `PromotionProcedure`, item)
                    .then(r => {
                        self.getProcedures()
                    })
                // })
            },
            getProcedures() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API + `PromotionProcedure?promotionID=${self.$route.params.promotionID}`)
                    .then(r => {
                        self.procedures = r.data
                        console.log("getProcedures", r);
                    })
            },
            createNewProcedure() {
                let self = this
                let req = {
                    iD: null,
                    promotion_ID: self.$route.params.promotionID,
                    IsTemplate: false,
                    Description: "new procedure"
                }
                console.log(self.$route.params.promotionID);

                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.post(process.env.VUE_APP_API + `PromotionProcedure`, req).then(r => {
                    console.log(r);
                    self.getProcedures()
                })
            },
            deleteItem(item) {
                let self = this
                self.$refs.YesNoModal.show("are you sure you want to delete this?", value => {
                    if (value) {
                        axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        axios.delete(process.env.VUE_APP_API + `PromotionProcedure`, item).then(r => {
                            self.getProcedures()
                        })
                    }
                })
            },
        }
    }
</script>

<style>
    .procedure_block {
        border: 1px solid lightgray !important;
    }

    table.paleBlueRows {
        border: 1px solid #FFFFFF;
        width: 350px;
        border-collapse: collapse;
    }

    table.paleBlueRows td,
    table.paleBlueRows th {
        border: 1px solid rgb(119, 119, 119);
        padding: 0px 2px;
    }

    table.paleBlueRows tbody td {
        font-size: 13px;
    }

    table.paleBlueRows tr:nth-child(even) {
        background: #D0E4F5;
    }

    table.paleBlueRows thead {
        background: #0B6FA4;
        border-bottom: 5px solid #FFFFFF;
    }

    table.paleBlueRows thead th {
        font-size: 17px;
        font-weight: bold;
        color: #FFFFFF;
        border-left: 2px solid #FFFFFF;
    }

    table.paleBlueRows thead th:first-child {
        border-left: none;
    }

    table.paleBlueRows tfoot {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        background: #D0E4F5;
        border-top: 3px solid #444444;
    }

    table.paleBlueRows tfoot td {
        font-size: 14px;
    }
</style>