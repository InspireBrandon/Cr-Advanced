<template>
    <v-container grid-list-xl>
        <v-dialog persistent v-model="dialog" width="500">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Graph Configuration</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex md12>
                            <v-select :items="facts" v-model="selected_fact" label="Fact:"></v-select>
                        </v-flex>
                        <v-flex md12>
                            <v-select @change="on_selected_graph_change" :items="graphs" v-model="selected_graph" label="Graph:"></v-select>
                        </v-flex>
                        <v-flex md12>
                            <v-radio-group v-if="selected_graph != null && selected_graph == 'Pareto'" v-model="selected_graph_type" label="Type">
                                <v-radio value="Pareto" disabled label="Pareto">
                                </v-radio>
                            </v-radio-group>
                            <v-radio-group  v-if="selected_graph != null && selected_graph != 'Pareto'" v-model="selected_graph_type" label="Type">
                                <v-radio value="Pie" label="Pie"></v-radio>
                                <v-radio value="Bar" label="Bar"></v-radio>
                            </v-radio-group>
                        </v-flex>
                    </v-layout>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog = false">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                facts: ['Sales', 'Units', 'Profit', 'Stock On Hand - Units', 'Stock On Hand - Cost', 'GP%'],
                selected_fact: null,
                graphs: ['Pareto', 'By Manufacturer', 'By Brand', 'By Category', 'By Subcategory', 'By Segment',
                    'by Size Description'
                ],
                selected_graph: null,
                selected_graph_type: 'Pareto'
            }
        },
        methods: {
            show(autoRangeData) {
                let self = this;
                self.dialog = true;
            },
            on_selected_graph_change() {
                let self = this;

                self.$nextTick(() => {
                    if(self.selected_graph == 'Pareto') {
                        self.selected_graph_type = 'Pareto';
                    }
                })
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px 5px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>