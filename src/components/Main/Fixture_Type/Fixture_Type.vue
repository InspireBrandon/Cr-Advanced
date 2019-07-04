<template>
    <v-card>
        <v-toolbar flat dense dark>
            <v-toolbar-title>Fixure Type</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" class="my-0">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-data-table :search="search" :headers="headers" :items="desserts" class="elevation-1">
            <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.calories }}</td>
                <td class="text-xs-center">{{ props.item.fat }}</td>
                <td class="text-xs-center">{{ props.item.carbs }}</td>
                <td class="text-xs-center">{{ props.item.protein }}</td>
                <td class="text-xs-center">{{ props.item.iron }}</td>
            </template>
            <template v-slot:no-results>
                <v-alert :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    export default {
        data() {
            return {
                search: '',
                items: [{
                    name: '',
                    code: 0,
                    DisplayName: 0,
                    Index: 0,
                }],
                headers: [{
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {
                        text: 'Code',
                        value: 'code'
                    },
                    {
                        text: 'Display Name',
                        value: 'DisplayName'
                    },
                    {
                        text: 'Index',
                        value: 'Index'
                    },
                    {
                        text: 'Actions',
                        value: 'Actions'
                    },
                    {
                        text: '',
                        value: 'buttons'
                    }
                ],
                desserts: [{
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%'
                }, ]
            }
        },
        mounted() {
            let self = this;
            self.getFixtureType();
        },
        methods: {
            getFixtureType() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Fixture_Type/Get")
                    .then(r => {
                        // self.items = r.data
                        console.log("passed data", r.data);
                    })
                    .catch(er => {
                        console.log("Error", er)
                    });
            },
        }
    }
</script>

<style>

</style>