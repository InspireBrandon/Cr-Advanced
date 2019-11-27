<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Observations & Insights</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
                <v-select v-if="options" v-model="selectedOption" :items="options" style="width: 300px;" label="Observation Type">
                </v-select>
                <v-autocomplete v-if="selectedOption == 1" item-text="name" item-value="id" class="ml-2" v-model="selectedProject" return-object :items="projects" style="width: 300px;" label="Category">
                </v-autocomplete>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-btn color="primary">Add New</v-btn>
        </v-toolbar>
    </v-card>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                options: [{
                        text: "Top Line",
                        value: 0,
                    },
                    {
                        text: "Category",
                        value: 1,
                    }
                ],
                selectedOption: 0,
                projects: [],
                selectedProject: null
            }
        },
        mounted() {
            let self = this;
            self.getProjects();
        },
        methods: {
            getProjects() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Project")
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.projects = r.data.projectList;
                    })
            },
        }
    }
</script>