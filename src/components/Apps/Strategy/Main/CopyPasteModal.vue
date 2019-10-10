<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Paste Data</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="pa-2">
                <v-textarea v-model="text" box :rows="15"></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="save">save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios'
    import RetailerStore from './RetailerStore/Index'
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                text: ""
            }
        },
        methods: {
            open(callback) {
                let self = this;
                self.text = "";
                self.callback = callback
                self.dialog = true
            },
            close() {
                let self = this
                self.dialog = false;
                self.callback()
            },
            save() {
                let self = this;

                let lines = self.text.split("\n");
                let headers = lines[0].split("\t");
                let trimmedHeaders = [];
                let finalData = [];

                for (var header in headers) {
                    trimmedHeaders.push(camelize(headers[header].trim()));
                }

                for (var i = 1; i < lines.length; i++) {
                    let lineData = lines[i].split("\t");

                    if (lineData.length == headers.length) {
                        let newData = {};

                        for (var header in trimmedHeaders) {
                            newData[trimmedHeaders[header]] = lineData[header].trim();
                        }

                        finalData.push(newData);
                    }
                }

                self.dialog = false;
                self.callback(finalData);
            }
        }
    }

    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }
</script>