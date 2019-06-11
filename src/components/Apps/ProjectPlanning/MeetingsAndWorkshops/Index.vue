<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex md12>
                <v-toolbar color="primary" dark>
                    <v-toolbar-title>Meetings and Workshops</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="create" color="success" small>New</v-btn>
                </v-toolbar>
                <v-card>
                    <v-card-text style="height: calc(100vh - 200px)">
                        <v-toolbar flat dark dense>
                            <v-text-field append-icon="search"></v-text-field>
                            <v-spacer></v-spacer>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>date_range</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-layout wrap>
                            <v-flex sm12 lg12 class="calendar-container pl-0 pt-0">
                                <v-sheet height="calc(100vh - 300px)">
                                    <v-calendar v-if="eventsMap != null" ref="calendar">
                                        <template v-slot:day="{ date }">
                                            <template v-for="(event, idx) in eventsMap[date]">
                                                <v-menu :key="idx" v-model="event.open" full-width offset-x>
                                                    <template v-slot:activator="{ on }">
                                                        <div @click="edit(event)" v-if="event.time" v-ripple
                                                            class="my-event" v-on="on"
                                                            v-html="event.title + ' - (' + event.time +  ' ' + amOrPM(event.time) + ' - ' + event.timeTo + ' ' + amOrPM(event.timeTo) + ')'">
                                                        </div>
                                                    </template>
                                                </v-menu>
                                            </template>
                                        </template>
                                    </v-calendar>
                                </v-sheet>
                            </v-flex>
                        </v-layout>
                        <!-- <v-data-table :headers="headers" :items="items">
                        </v-data-table> -->
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <Maint ref="maint"></Maint>
    </v-container>
</template>

<script>
    import Maint from '@/components/Apps/ProjectPlanning/MeetingsAndWorkshops/Maint.vue';
    import Axios from 'axios'
    import jwt from 'jsonwebtoken';

    export default {
        name: 'meetings-and-workshops',
        components: {
            Maint
        },
        data() {
            return {
                meetings: null,
                events: [],
                colors: ['primary', 'secondary', 'warning', 'error'],
                category: ['Development', 'Meetings', 'Slacking']
            }
        },
        computed: {
            eventsMap() {
                let map = null;

                if (this.events.length > 0) {
                    map = {};
                    this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
                }

                return map
            }
        },
        mounted() {
            let self = this;
            self.getMeetings(() => {

            });
        },
        methods: {
            create() {
                let self = this;

                self.$refs.maint.show(true, null, () => {
                    self.getMeetings();
                })
            },
            edit(data) {
                let self = this;

                let eventItem = self.getMeetingItemFromID(data.id);

                self.$refs.maint.show(false, eventItem, () => {
                    self.getMeetings();
                })
            },
            getMeetings(callback) {
                let self = this;

                self.meetings = [];
                self.events = [];

                setTimeout(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + "Meeting?returnAttendees=true")
                        .then(r => {
                            self.meetings = r.data.meetings;
                            self.events = new EventItemList(r.data.meetings);

                            delete Axios.defaults.headers.common["TenantID"];
                            if (callback != undefined) {
                                callback();
                            }
                        })
                }, 60)
            },
            amOrPM(time) {
                let retval = "AM"

                if (parseInt(time.split(":")[0]) > 11)
                    retval = "PM"

                return retval;
            },
            getMeetingItemFromID(id) {
                let self = this;
                let retval;

                self.meetings.forEach(meeting => {
                    if (meeting.id == id)
                        retval = meeting;
                })

                return retval;
            }
        }
    }

    function EventItemList(items) {
        let tmp = [];

        items.forEach(el => {
            tmp.push({
                title: el.title,
                date: el.dateFrom,
                time: el.timeFrom,
                timeTo: el.timeTo,
                id: el.id
            })
        })
        return tmp;
    }
</script>

<style scoped>
    .calendar-container {
        padding-top: 0px;
        border-left: 1px solid #e0e0e0;
        padding-left: 0px;
        padding-bottom: 0px;
        margin-left: 4px;
    }

    .my-event {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 2px;
        background-color: #1867c0;
        color: #ffffff;
        border: 1px solid #1867c0;
        width: 100%;
        font-size: 12px;
        padding: 3px;
        cursor: pointer;
        margin-bottom: 1px;
    }
</style>