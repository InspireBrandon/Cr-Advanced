<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Cross Planogram Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
                <v-autocomplete v-model="selectedProjectGroup" :items="projectGroups" style="width: 300px;"
                    label="Project Group" item-text="name" item-value="id"></v-autocomplete>
            </v-toolbar-items>
            <v-btn @click="filter" color="primary">Filter</v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-text-field v-model.lazy="searchText" prepend-icon="search" style="width: 600px"
                    placeholder="Search..."></v-text-field>
            </v-toolbar-items>
        </v-toolbar>
        <Grid ref="Grid" :rowData="rowData" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid';

    export default {
        name: 'cross-planogram-analysis',
        components: {
            Grid
        },
        data() {
            return {
                rowData: [],
                projectGroups: [],
                selectedProjectGroup: null,
                searchText: ''
            }
        },
        mounted() {
            let self = this;
            self.getProjectGroups();
        },
        watch: {
            searchText: function (value) {
                let self = this;
                self.$refs.Grid.gridApi.setQuickFilter(value)
            }
        },
        methods: {
            getProjectGroups() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.projectGroups = [];

                Axios.get(process.env.VUE_APP_API + "ProjectGroup")
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.projectGroups = r.data.projectGroupList;
                        self.projectGroups.unshift({
                            id: null,
                            name: "All"
                        })
                    })
            },
            filter() {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `Planogram_Detail_Product?projectGroupID=${self.selectedProjectGroup}`)
                    .then(r => {
                        self.rowData = r.data.planogram_Detail_Product_List;

                        setTimeout(() => {
                            self.$refs.Grid.autoSizeAll();
                        }, 100);
                    })
            },
            filterChange() {
                let self = this;

                self.$nextTick(() => {
                    self.$refs.Grid.gridApi.setQuickFilter(self.searchText)
                })
            }
        }
    }
</script>