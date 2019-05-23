<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Meeting set up</span>
                    <v-spacer></v-spacer>
                    <v-btn icon flat outline color="error" v-if="!isAdd">
                        <v-icon @click="deleteMeeting" color="error">delete</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form>
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
                                        :nudge-right="40" lazy transition="scale-transition" offset-y full-width
                                        min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="startDate" label="Picker in menu"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker @input="startDateMenu = false" v-model="startDate" no-title
                                            scrollable>
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <v-menu ref="startTimeMenu" v-model="startTimeMenu" :close-on-content-click="false"
                                        :nudge-right="40" lazy transition="scale-transition" offset-y full-width
                                        max-width="290px" min-width="290px">
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
                                        :nudge-right="40" lazy transition="scale-transition" offset-y full-width
                                        min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="endDate" label="Picker in menu" prepend-icon="event"
                                                readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker @input="endDateMenu = false" required v-model="endDate" no-title
                                            scrollable>
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs5 sm5 md5>
                                    <v-menu ref="endTimeMenu" v-model="endTimeMenu" :close-on-content-click="false"
                                        :nudge-right="40" lazy transition="scale-transition" offset-y full-width
                                        max-width="290px" min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="endTime" label="Picker in menu"
                                                prepend-icon="access_time" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-time-picker required v-if="endTimeMenu" v-model="endTime" full-width
                                            @click:minute="$refs.endTimeMenu.save(endTime)"></v-time-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="form.location" label="location"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <YesNoModal ref="yesNo"></YesNoModal>
    </v-layout>
</template>

<script>
    import Axios from 'axios'
    import jwt from 'jsonwebtoken';
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        components: {
            YesNoModal
        },
        data: () => ({
            dialog: false,
            isAdd: true,
            afterComplete: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
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
            show(isAdd, data, afterComplete) {
                let self = this;
                self.isAdd = isAdd;
                self.afterComplete = afterComplete;
                self.getUsers(() => {
                    self.requiredAttendees = [];
                    self.optionalAttendees = [];

                    self.startDate = null;
                    self.startTime = null;

                    self.endDate = null;
                    self.endTime = null;

                    if (self.isAdd) {
                        for (var prop in self.form) {
                            self.form[prop] = null;
                        }

                        self.form.meetingType = 0;
                        self.form.meetingAttendees = [];
                    } else {
                        for (var prop in self.form) {
                            self.form[prop] = data[prop];
                        }

                        self.startDate = data.dateFrom;
                        self.startTime = data.timeFrom;

                        self.endDate = data.dateTo;
                        self.endTime = data.timeTo;

                        data.meetingAttendees.forEach(attendee => {
                            if (attendee.required)
                                self.requiredAttendees.push(attendee.systemUserID);
                            else
                                self.optionalAttendees.push(attendee.systemUserID);
                        })

                        console.log(self.form)
                    }
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
            },
            deleteMeeting() {
                let self = this;

                self.$refs.yesNo.show('Delete this meeting?', goThrough => {
                    if (goThrough) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + "Meeting?meetingID=" + self.form.id)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];
                                self.afterComplete();
                                self.dialog = false;
                            })
                    }
                })
            }
        }
    }
</script>