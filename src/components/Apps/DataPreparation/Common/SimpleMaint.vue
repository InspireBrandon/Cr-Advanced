<template>
    <div class="text-xs-center">
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Maintain {{ name }}</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-form>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md6>
                                    <v-text-field :label="name"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Display Name"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Code"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                </v-flex>
                                <v-flex md6>
                                    <v-checkbox label="Temporary"></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog = false">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: ['name'],
        data() {
            return {
                dialog: false
            }
        },
        methods: {
            show() {
                let self = this;
                self.dialog = true;
            }
        }
    }
</script>