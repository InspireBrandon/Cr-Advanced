<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Imports</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text style="height: 300px; overflow: auto;">
                <v-list>
                    <template v-for="(item, idx) in fileData">
                        <v-list-tile @click="selected = item" :class="{ 'highlighted': selected == item  }" :key="idx">
                            {{ item.name }}</v-list-tile>
                        <v-divider :key="idx + 'd'"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="returnData">
                    Continue
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios'
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                dialog: false,
                fileData: [],
                afterReturn: null,
                selected: null
            }
        },
        methods: {
            save() {
                let self = this;
            },
            getData() {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `SuplierLocationImport`)
                    .then(r => {
                        self.fileData = []
                        r.data.forEach(element => {
                            if (element.userID == encoded_details.USER_ID) {
                                self.fileData.push(element)
                            }
                        });

                        console.log(r);

                    })
            },
            show(afterReturn) {
                let self = this;
                self.getData()
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            returnData() {
                let self = this;
                self.dialog = false;
                self.afterReturn(self.selected);
            }
        }
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>