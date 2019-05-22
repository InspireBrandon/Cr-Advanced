<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Meeting set up</span>
                </v-card-title>
                <v-card-text>
                    <v-container fluid class="pa-0 mt-0" grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field multiple v-model="form.title" label="Title" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-autocomplete v-model="requiredAttendees" multiple :items="users"
                                    label="Required Attendees" required>
                                </v-autocomplete>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-autocomplete v-model="optionalAttendees" multiple :items="users"
                                    label="Optional Attendees" required>
                                </v-autocomplete>
                            </v-flex>
                            <v-flex style="padding-top: 26px;" xs2 sm2 md2 align-center justify-center>
                                <span>Start time</span>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="startDateMenu" v-model="startDateMenu" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="startDate" lazy transition="scale-transition"
                                    offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="startDate" label="Picker in menu" prepend-icon="event"
                                            readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="startDate" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="$refs.startDateMenu.save(startDate)">OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="startTimeMenu" v-model="startTimeMenu" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="startTime" lazy transition="scale-transition"
                                    offset-y full-width max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="startTime" label="Picker in menu"
                                            prepend-icon="access_time" readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="startTimeMenu" v-model="startTime" full-width
                                        @click:minute="$refs.startTimeMenu.save(startTime)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex style="padding-top: 26px;" xs2 sm2 md2 align-center justify-center>
                                <span>End time</span>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="endDateMenu" v-model="endDateMenu" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="endDate" lazy transition="scale-transition"
                                    offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="endDate" label="Picker in menu" prepend-icon="event"
                                            readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="endDate" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="$refs.endDateMenu.save(endDate)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="endTimeMenu" v-model="endTimeMenu" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="endTime" lazy transition="scale-transition"
                                    offset-y full-width max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="endTime" label="Picker in menu"
                                            prepend-icon="access_time" readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="endTimeMenu" v-model="endTime" full-width
                                        @click:minute="$refs.endTimeMenu.save(endTime)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="form.location" label="location"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import Axios from 'axios'
    import jwt from 'jsonwebtoken';

    export default {
        data: () => ({
            dialog: false,
            isAdd: true,
            afterComplete: null,
            startDate: new Date().toISOString().substr(0, 10),
            startTime: '12:00',
            endDate: new Date().toISOString().substr(0, 10),
            endTime: '12:00',
            startDateMenu: false,
            startTimeMenu: false,
            endDateMenu: false,
            endTimeMenu: false,
            time: null,
            form: {
                id: null,
                uid: null,
                meetingType: 0,
                title: null,
                dateStart: null,
                dateEnd: null,
                location: null,
                meetingAttendees: []
            },
            users: [],
            requiredAttendees: [],
            optionalAttendees: []
        }),
        methods: {
            show(isAdd, afterComplete) {
                let self = this;
                self.isAdd = isAdd;
                self.afterComplete = afterComplete;
                self.getUsers(() => {
                    self.dialog = true;
                })
            },
            save() {
                let self = this;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                
                Axios[self.isAdd ? 'post' : 'put'](process.env.VUE_APP_API + "Meeting", self.getRequestObject())
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.afterComplete();
                        self.dialog = false;
                    })
            },
            getUsers(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        self.users = [];

                        r.data.forEach(element => {
                            self.users.push({
                                text: element.firstname + " " + element.lastname,
                                value: element.systemUserID
                            })
                        });

                        callback();
                    })
            },
            getRequestObject() {
                let self = this;

                let meetingAttendees = [];

                self.requiredAttendees.forEach(element => {
                    meetingAttendees.push({
                        systemUserID: element,
                        required: true
                    })
                });

                self.optionalAttendees.forEach(element => {
                    meetingAttendees.push({
                        systemUserID: element,
                        required: false
                    })
                });

                return {
                    id: self.form.id,
                    uid: self.form.uid,
                    meetingType: self.form.meetingType,
                    title: self.form.title,
                    dateStart: self.startDate + "T" + self.startTime + ":00",
                    dateEnd: self.endDate + "T" + self.endTime + ":00",
                    location: self.form.location,
                    meetingAttendees: meetingAttendees
                }
            }
        }
    }

    function meetingAttendeeItem() {

    }
</script>