<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="600">
                <v-card>
                    <v-toolbar dark flat color="primary">
                        <v-toolbar-title>
                            {{title}}
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card flat>
                        <v-card-text>
                            <v-select placeholder="Please select a subtask" :items="subtasks" v-model="subtask" label="Subtask"></v-select>
                            <v-select placeholder="Please select a user" :items="users" v-model="user" label="User"></v-select>
                            <v-textarea label="Notes" v-model="notes"></v-textarea>
                        </v-card-text>
                    </v-card>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click.native="returnResult" :disabled=" user == null">
                            Assign</v-btn>
                        <v-btn flat color="secondary" @click.native="dialog = false">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                title: null,
                dialog: false,
                afterRuturn: null,
                tasks: [
                    // {
                    //     text: "Event",
                    //     value: 0
                    // },
                    {
                        text: "Data Preparation",
                        value: 1
                    },

                    {
                        text: "Ranging",
                        value: 2
                    },

                    {
                        text: "Planogram",
                        value: 3
                    },
                    // {
                    //     text: "Promotion",
                    //     value: 4
                    // }
                ],
                subtasks: [{
                        text: "Request product info",
                        value: 28
                    },
                    {
                        text: "Request planogram input",
                        value: 31
                    },
                    {
                        text: "Request fixture input",
                        value: 34
                    },
                    {
                        text: "Check planogram",
                        value: 37
                    }
                ],
                subtask: null,
                task: null,
                users: [],
                user: null,
                notes: null,
            }
        },
        methods: {
            show(title, afterRuturn) {
                let self = this;
                self.title = title
                self.user = null;
                self.afterRuturn = afterRuturn;
                self.subtask = null;
                self.getUsers(() => {
                    self.dialog = true;
                })
            },
            returnResult() {
                let self = this;
                self.afterRuturn({
                    status: self.subtask,
                    systemUserID: self.user,
                    notes: self.notes,
                });
                self.dialog = false;
            },
            getUsers(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {
                        self.users = [];

                        for (var i = 0; i < r.data.length; i++) {
                            let item = r.data[i];

                            self.users.push({
                                text: item.firstname + " " + item.lastname,
                                value: item.systemUserID
                            });
                        }

                        callback();
                    })
                    .catch(e => {

                    })
            },
        }
    }
</script>