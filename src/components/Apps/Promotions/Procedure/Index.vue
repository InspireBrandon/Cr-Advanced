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
                                    <v-btn small color="primary" text class="ma-0 mb-2">New procedure</v-btn>
                                </div>
                            </div>
                            <v-divider class="mb-3"></v-divider>
                            <ProcedureBlock class="mb-2" v-for="i in 2" :key="i" :index="i" />
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
    </v-card>
</template>

<script>
    import ProcedureBlock from './ProcedureBlock.vue'

    export default {
        components: {
            ProcedureBlock
        },
        data() {
            return {}
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