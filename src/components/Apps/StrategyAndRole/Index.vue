<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-4">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Strategy And Role</span>
            </v-toolbar-title>
        </v-toolbar>
        <router-view />
    </v-card>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
            }
        }
    }
</script>