<template>
    <v-dialog persistent v-model="dialog" width="500">
        <v-card>
            <v-toolbar flat dark color="primary">
                <v-toolbar-title>Subscription Level</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="close" icon>
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-select v-model="subscriptionLevel" :items="levels" label="Subscription Level"></v-select>
                <v-divider></v-divider>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="save" color="primary">save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from "axios";
    export default {
        data() {
            return {
                dialog: false,
                afterReturn: null,
                subscriptionLevel: null,
                levels: [
                    {
                        text: "None",
                        value: null
                    },
                    {
                        text: "Department",
                        value: 1
                    },
                    {
                        text: "Category",
                        value: 2
                    },
                    {
                        text: "Brand",
                        value: 3
                    }
                ]
            };
        },
        methods: {
            close() {
                let self = this;
                self.dialog = false;
            },
            show(subscriptionLevel, afterReturn) {
                let self = this;
                self.subscriptionLevel = subscriptionLevel;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            save() {
                let self = this;
                self.dialog = false;
                self.afterReturn(self.subscriptionLevel);
            }
        }
    };
</script>