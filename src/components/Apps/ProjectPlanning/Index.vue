<template>
    <div>

        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>
                Project Planning
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="$router.go(-1)">
                <v-icon>arrow_back</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-layout row wrap>
                <v-flex md12>
                    <v-data-table :headers="headers" :items="Projects" hide-actions>
                        <template v-slot:items="props">
                            <td>{{ props.item.Planogram }}</td>
                            <td>{{ props.item.Type }} </td>
                            <td>{{ props.item.Cluster }}</td>
                            <td>{{ props.item.Category }}</td>
                            <td>{{ props.item.Cluster }}</td>
                            <td>{{ props.item.Store }}</td>
                            <td>{{ props.item.Name }}</td>
                            <td>
                                <v-menu left>
                                    <v-btn slot="activator" icon>
                                        <v-icon>more_vert</v-icon>
                                    </v-btn>
                                    <v-list dense>
                                        <v-list-tile @click="openEdit(item)">Edit</v-list-tile>
                                        <v-divider></v-divider>
                                        <v-list-tile>Delete</v-list-tile>
                                    </v-list>
                                </v-menu>
                            </td>
                        </template>
                    </v-data-table>
                </v-flex>


            </v-layout>


        </v-container>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                headers: [{
                    text: "Planogram",
                }, {
                    text: "Type",
                }, {
                    text: "Cluster",
                }, {
                    text: "Category",
                }, {
                    text: "Cluster",
                }, {
                    text: "Store",

                }, {
                    text: "Name",
                }, {
                    text: "Actions",
                }],
                Projects: [{
                    Planogram: "Planogram",
                    Type: "Type",
                    Store: "Store",
                    Cluster: "Cluster",
                    Category: "Category",
                    Cluster: "Cluster",
                    Name: "Name",
                }, {
                    Planogram: "Planogram",
                    Type: "Type",
                    Store: "Store",
                    Cluster: "Cluster",
                    Category: "Category",
                    Cluster: "Cluster",
                    Name: "Name",
                }],

            }
        },
        methods: {

        }
    }
</script>