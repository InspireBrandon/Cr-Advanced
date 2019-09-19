<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="close">
                            <v-list-tile-title>close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Custom Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn color="primary">Refresh</v-btn>
            <v-btn color="primary">Setup</v-btn>
        </v-toolbar>
        <Grid :rowData="rowData" :headers="headers" ref="Grid" />
        <CustomSelector ref="CustomSelector" />
        <Spinner ref="Spinner" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import CustomSelector from './CustomSelector';
    import Spinner from '@/components/Common/Spinner';

    export default {
        components: {
            Grid,
            CustomSelector,
            Spinner
        },
        data() {
            return {
                rowData: [],
                headers: []
            }
        },
        methods: {
            newFile() {
                let self = this;

                self.$refs.CustomSelector.show(data => {
                    self.$refs.Spinner.show();
                    self.customQuery(data)
                })
            },
            customQuery(data) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `Cluster/Advanced?field=${data.field}`)
                    .then(r => {
                        self.processData(r.data, data.field);
                    })
            },
            processData(data, field) {
                let self = this;
                let uniqueStores = getUniqueStores(data);

                self.headers = [{
                    "headerName": "Store",
                    "field": "storeName",
                    "pivot": true,
                    "enablePivot": true
                }, {
                    "headerName": field,
                    "field": field.toLowerCase(),
                    "rowGroup": true,
                    "enableRowGroup": true
                }, {
                    "headerName": "Sales",
                    "field": "sales",
                    "aggFunc": "sum",
                    "enableValue": true
                }]

                self.rowData = data;

                self.$refs.Spinner.hide();
            }
        }
    }

    function getUniqueStores(data) {
        let stores = [];

        data.forEach(ss => {
            let canAdd = true;

            stores.forEach(s => {
                if (ss.storeName == s)
                    canAdd = false;
            })

            if (canAdd)
                stores.push(ss.storeName);
        });

        return stores;
    }
</script>