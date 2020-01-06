<template>
    <v-dialog width="800px" persistent v-model="dialog">
        <v-toolbar color="primary" dark>
            <v-toolbar-title>
                Custom Filter Modal
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>
                    close
                </v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md4>
                        <v-autocomplete label="Filter Type" v-model="selectedheader" :items="headers"></v-autocomplete>
                    </v-flex>
                    <v-flex md8>

                    </v-flex>
                </v-layout>
            </v-container>


            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog=false" color="error">
                    cancel
                </v-btn>
                <v-btn @click="submit" color="primary"> submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                csvData: null,
                headers: [{
                    text: "User Type"
                }, {
                    text: "Store Based"
                }, {
                    text: "Planogram Based"
                }],
                selectedheader: null,
            }
        },
        methods: {
            open(callback) {
                let self = this
                self.callback = callback
                self.dialog = true

            },
            submit() {
                let self = this
                callback()
            }
        }
    }
</script>