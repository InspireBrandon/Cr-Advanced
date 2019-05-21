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
                                <v-text-field label="Title" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-autocomplete label="Required Attendees" required></v-autocomplete>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-autocomplete label="Optional Attendees" required></v-autocomplete>
                            </v-flex>
                            <v-flex style="padding-top: 26px;" xs2 sm2 md2 align-center justify-center>
                                <span>Start time</span>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="startDateMenu" v-model="startDateMenu" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition"
                                    offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="date" label="Picker in menu" prepend-icon="event"
                                            readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="$refs.startDateMenu.save(date)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="startTimeMenu" v-model="startTimeMenu" :close-on-content-click="false" :nudge-right="40"
                                    :return-value.sync="time" lazy transition="scale-transition" offset-y full-width
                                    max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="time" label="Picker in menu" prepend-icon="access_time"
                                            readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="startTimeMenu" v-model="time" full-width
                                        @click:minute="$refs.startTimeMenu.save(time)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex style="padding-top: 26px;" xs2 sm2 md2 align-center justify-center>
                                <span>End time</span>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="endDateMenu" v-model="endDateMenu" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition"
                                    offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="date" label="Picker in menu" prepend-icon="event"
                                            readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="$refs.endDateMenu.save(date)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                                <v-menu ref="endTimeMenu" v-model="endTimeMenu" :close-on-content-click="false" :nudge-right="40"
                                    :return-value.sync="time" lazy transition="scale-transition" offset-y full-width
                                    max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="time" label="Picker in menu" prepend-icon="access_time"
                                            readonly v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker v-if="endTimeMenu" v-model="time" full-width
                                        @click:minute="$refs.endTimeMenu.save(time)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field label="location"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        data: () => ({
            dialog: false,
            isAdd: true,
            afterComplete: null,
            date: new Date().toISOString().substr(0, 10),
            startDateMenu: false,
            startTimeMenu: false,
            endDateMenu: false,
            endTimeMenu: false,
            time: null
        }),
        methods: {
            show(isAdd, afterComplete) {
                let self = this;
                self.isAdd = isAdd;
                self.afterComplete = afterComplete;
                self.dialog = true;
            }
        }
    }
</script>