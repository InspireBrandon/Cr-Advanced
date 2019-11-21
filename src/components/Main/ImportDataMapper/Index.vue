<template>
    <div>
        <v-card tile flat>
            <v-toolbar dark dense flat>
                <v-toolbar-items>
                    <v-tabs fixed-tabs color="grey darken-4" dark slider-color="yellow darken-1">
                        <v-tab to="/ImportDataMapper/Store">Stores</v-tab>
                        <v-tab to="/ImportDataMapper/Department">Departments</v-tab>
                        <v-tab to="/ImportDataMapper/Category">Categories</v-tab>
                        <v-tab to="/ImportDataMapper/Brand">Brands</v-tab>
                    </v-tabs>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-title>Import Data Map</v-toolbar-title>
            </v-toolbar>
            <v-container class="pa-0 pl-1" fluid grid-list-xs>
                <v-tabs-items>
                    <v-tab-item >
                        <router-view></router-view>
                    </v-tab-item>
                </v-tabs-items>
            </v-container>
        </v-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: 0
            }
        }
    }
</script>