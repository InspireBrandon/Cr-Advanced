<template>
    <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Assign User</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-autocomplete return-object v-model="selectedUser" :items="users" label="Select a user"></v-autocomplete>
                <v-textarea v-model="notes" label="notes"></v-textarea>
            </v-card-text>
            <v-card-actions style="text-align: right;">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click.native="self.dialog = false">Cancel</v-btn>
                <v-btn color="primary darken-1" @click.native="returnValue(true)">Continue</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                users: [],
                selectedUser: null,
                notes: null
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.users = [];

                self.getUsers(() => {
                    self.afterRuturn = afterRuturn;
                    self.selectedUser = null;
                    self.notes = null;
                    self.dialog = true;
                })
            },
            returnValue(value) {
                let self = this;
                self.afterRuturn({
                    systemUserID: self.selectedUser.value,
                    notes: self.notes
                });
                self.dialog = false;
            },
            getUsers(callback) {
                let self = this;

                let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {
                        r.data.forEach(element => {
                            self.users.push({
                                text: element.firstname + ' ' + element.lastname,
                                value: element.systemUserID
                            })
                        });

                        callback();
                    })
                    .catch(e => {

                    })
            },
        }
    }
</script>