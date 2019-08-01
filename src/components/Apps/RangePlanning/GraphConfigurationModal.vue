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
                            <v-select return-object :items="facts" v-model="selected_fact" label="Fact:"></v-select>
                        </v-flex>
                        <v-flex md12>
                            <v-select return-object @change="on_selected_graph_change" :items="graphs" v-model="selected_graph" label="Graph:"></v-select>
                        </v-flex>
                        <v-flex md12>
                            <v-radio-group v-if="selected_graph != null && selected_graph == 'Pareto'" v-model="selected_graph_type" label="Type">
                                <v-radio color="primary" value="pareto" disabled label="Pareto">
                                </v-radio>
                            </v-radio-group>
                            <v-radio-group  v-if="selected_graph != null && selected_graph != 'Pareto'" v-model="selected_graph_type" label="Type">
                                <v-radio color="primary" value="pie" label="Pie"></v-radio>
                                <v-radio color="primary" value="bar" label="Bar"></v-radio>
                            </v-radio-group>
                        </v-flex>
                    </v-layout>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="submit">Continue</v-btn>
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
                facts: [
                    { text: 'Sales', value: 'sales_Retail' }, 
                    { text: 'Units', value: 'sales_Units' }, 
                    { text: 'Profit', value: 'sales_Profit' }, 
                    { text: 'Stock On Hand - Units', value: 'stock_on_hand_units' }, 
                    { text: 'Stock On Hand - Cost', value: 'stock_on_hand_cost' }, 
                    { text:'GP%', value: 'gross_profit' }],
                selected_fact: null,
                graphs: [{ text: 'Pareto', value: 'Pareto'}, 
                        { text: 'By Manufacturer', value: 'manufacturer'}, 
                        { text: 'By Brand', value: 'brand' }, 
                        { text: 'By Category', value: 'category' }, 
                        { text: 'By Subcategory', value: 'subcategory'}, 
                        { text: 'By Segment', value: 'segment' }, 
                        { text: 'by Size Description', value: 'size_Description' }],
                selected_graph: null,
                selected_graph_type: 'pareto'
            }
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.dialog = true;
                self.afterReturn = afterReturn;
            },
            on_selected_graph_change() {
                let self = this;

                self.$nextTick(() => {
                    if(self.selected_graph == 'Pareto') {
                        self.selected_graph_type = 'pareto';
                    } else {
                        self.selected_graph_type = 'pie';
                    }
                })
            },
            submit() {
                let self = this;
                self.dialog = false;

                let graphConfiguration = {
                    selected_fact: self.selected_fact.value,
                    selected_graph: self.selected_graph.value,
                    selected_graph_type: self.selected_graph_type,
                    graphName: self.selected_fact.text + " " + self.selected_graph.text
                }

                self.afterReturn(graphConfiguration);
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