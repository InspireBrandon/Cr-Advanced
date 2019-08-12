<template>
    <v-dialog persistent v-model="dialog" width="70vw">
        <v-card tile dark>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Document Properties</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pb-0">
                <v-container class="ma-0 pa-0" grid-list-lg>
                    <v-layout row wrap justify-center>
                        <v-flex md6>
                            <span>Name</span>
                            <v-layout row wrap>
                                <v-flex md8>
                                    <v-autocomplete v-model="form.dimension.store" hide-details label="Store"></v-autocomplete>
                                </v-flex>
                                <v-flex md8>
                                    <v-autocomplete v-model="form.dimension.department" hide-details label="Department"></v-autocomplete>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex md6>
                            <span>Dimensions</span>
                            <v-layout row wrap>
                                <v-flex md8>
                                    <v-text-field v-model="form.dimension.width" type="number" hide-details label="Width"></v-text-field>
                                </v-flex>
                                <v-flex md8>
                                    <v-text-field v-model="form.dimension.depth" type="number" hide-details label="Depth"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-divider class="mt-4"></v-divider>
            </v-card-text>
            <v-card-actions class="px-3">
                <v-spacer></v-spacer>
                <v-btn @click="save" class="ma-0" color="primary">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'planogram-2d-document-properties',
        data() {
            return {
                dialog: false,
                afterReturn: null,
                form: {
                    name: {
                        store: null,
                        department: null
                    },
                    dimension: {
                        width: 0,
                        depth: 0,
                    }
                }
            }
        },
        methods: {
            show(afterReturn) {
                let self = this;

                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            save() {
                let self = this;

                self.dialog = false;
                self.afterReturn(self.form);
            }
        }
    }
</script>