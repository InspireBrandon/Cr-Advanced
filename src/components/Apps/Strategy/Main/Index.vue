<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-btn slot="activator" flat @click="setup">
                    Setup
                </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Main</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
            </v-toolbar-items>
        </v-toolbar>
        <Grid :rowData="rowData" ref="Grid" />
        <Setup ref="Setup" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import Setup from './Setup'

    export default {
        components: {
            Grid,
            Setup
        },
        data() {
            return {
                rowData: []
            }
        },
        created() {
            let self = this;
        },
        methods: {
            setup() {
                let self = this;
                self.$refs.Setup.show(() => {

                })
            }
        }
    }
</script>