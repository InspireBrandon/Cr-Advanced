<template>
    <div>
        <v-dialog v-model="dialog" width="600" persistent>
            <v-card style="overflow: auto;">
                <v-card-title style="text-align: center; display: block;" class="headline pa-0">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Cluster Setup</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text>
                    <template>
                        <v-data-table hide-actions :headers="headers" :items="desserts" class="elevation-0">
                            <template v-slot:items="props">
                                <td style="width: 40px">
                                    <v-checkbox v-model="props.item.use" hide-details></v-checkbox>
                                </td>
                                <td style="width: 60px">{{ props.item.name }}</td>
                                <td style="padding: 10px;">
                                    <v-select :disabled="props.item.use == false" style="margin-left: 10px; margin-top: 8px; width: 350px" placeholder="Select" dense hide-details></v-select>
                                </td>
                            </template>
                        </v-data-table>
                    </template>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="returnSetupConfig">Continue</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'RangeSelectorModal',
        data() {
            return {
                dialog: false,
                afterComplete: null,
                headers: [{
                        text: 'Use',
                        value: '',
                        sortable: false,
                    },
                    {
                        text: 'Field',
                        value: '',
                        sortable: false,
                    },
                    {
                        text: 'Value',
                        value: '',
                        sortable: false
                    }
                ],
                desserts: [{
                        use: false,
                        name: 'Basket',
                        value: null
                    },
                    {
                        use: false,
                        name: 'Listing',
                        value: null
                    },
                    {
                        use: false,
                        name: 'Store',
                        value: null
                    },
                ]
            }
        },
        methods: {
            show(afterComplete) {
                let self = this;
                self.dialog = true;
                self.afterComplete = afterComplete;
            },
            returnSetupConfig() {
                let self = this;

                self.dialog = false;
                self.afterComplete(self.selectedRange);
            }
        }
    }
</script>