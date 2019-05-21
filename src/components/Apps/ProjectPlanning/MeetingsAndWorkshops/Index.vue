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
                                    <v-calendar ref="calendar" v-model="start" :type="type" :start="start" :end="end"
                                        :min-weeks="minWeeks" :max-days="maxDays" :now="now" :dark="dark"
                                        :weekdays="weekdays" :first-interval="intervals.first"
                                        :interval-minutes="intervals.minutes" :interval-count="intervals.count"
                                        :interval-height="intervals.height" :interval-style="intervalStyle"
                                        :show-interval-label="showIntervalLabel" :color="color">
                                        <template v-slot:day="day">
                                            <v-sheet v-if="day.day % 3 === 0" :color="color" class="white--text pa-1">
                                                day slot {{ day.date }}
                                            </v-sheet>
                                        </template>
                                        <template v-slot:header="day">
                                            <div v-if="day.weekday % 2" class="day-header">
                                                day-header slot {{ day.date }}
                                            </div>
                                        </template>
                                        <template v-slot:day-body="day">
                                            <div v-if="day.weekday % 3 === 2" class="day-body">
                                                day-body slot {{ day.date }}
                                            </div>
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

    const weekdaysDefault = [0, 1, 2, 3, 4, 5, 6]

    const intervalsDefault = {
        first: 0,
        minutes: 60,
        count: 24,
        height: 40
    }

    const stylings = {
        default (interval) {
            return undefined
        },
        workday(interval) {
            const inactive = interval.weekday === 0 ||
                interval.weekday === 6 ||
                interval.hour < 9 ||
                interval.hour >= 17
            const startOfHour = interval.minute === 0
            const dark = this.dark
            const mid = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

            return {
                backgroundColor: inactive ? (dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)') : undefined,
                borderTop: startOfHour ? undefined : '1px dashed ' + mid
            }
        },
        past(interval) {
            return {
                backgroundColor: interval.past ? (this.dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)') : undefined
            }
        }
    }

    export default {
        name: 'meetings-and-workshops',
        components: {
            Maint
        },
        data() {
            return {
                dark: false,
                startMenu: false,
                start: '2019-01-12',
                endMenu: false,
                end: '2019-01-27',
                nowMenu: false,
                minWeeks: 1,
                now: null,
                type: 'month',
                typeOptions: [{
                        text: 'Day',
                        value: 'day'
                    },
                    {
                        text: '4 Day',
                        value: '4day'
                    },
                    {
                        text: 'Week',
                        value: 'week'
                    },
                    {
                        text: 'Month',
                        value: 'month'
                    },
                    {
                        text: 'Custom Daily',
                        value: 'custom-daily'
                    },
                    {
                        text: 'Custom Weekly',
                        value: 'custom-weekly'
                    }
                ],
                weekdays: weekdaysDefault,
                weekdaysOptions: [{
                        text: 'Sunday - Saturday',
                        value: weekdaysDefault
                    },
                    {
                        text: 'Mon, Wed, Fri',
                        value: [1, 3, 5]
                    },
                    {
                        text: 'Mon - Fri',
                        value: [1, 2, 3, 4, 5]
                    },
                    {
                        text: 'Mon - Sun',
                        value: [1, 2, 3, 4, 5, 6, 0]
                    }
                ],
                intervals: intervalsDefault,
                intervalsOptions: [{
                        text: 'Default',
                        value: intervalsDefault
                    },
                    {
                        text: 'Workday',
                        value: {
                            first: 16,
                            minutes: 30,
                            count: 20,
                            height: 40
                        }
                    }
                ],
                maxDays: 7,
                maxDaysOptions: [{
                        text: '7 days',
                        value: 7
                    },
                    {
                        text: '5 days',
                        value: 5
                    },
                    {
                        text: '4 days',
                        value: 4
                    },
                    {
                        text: '3 days',
                        value: 3
                    }
                ],
                styleInterval: 'default',
                styleIntervalOptions: [{
                        text: 'Default',
                        value: 'default'
                    },
                    {
                        text: 'Workday',
                        value: 'workday'
                    },
                    {
                        text: 'Past',
                        value: 'past'
                    }
                ],
                color: 'primary',
                colorOptions: [{
                        text: 'Primary',
                        value: 'primary'
                    },
                    {
                        text: 'Secondary',
                        value: 'secondary'
                    },
                    {
                        text: 'Accent',
                        value: 'accent'
                    },
                    {
                        text: 'Red',
                        value: 'red'
                    },
                    {
                        text: 'Pink',
                        value: 'pink'
                    },
                    {
                        text: 'Purple',
                        value: 'purple'
                    },
                    {
                        text: 'Deep Purple',
                        value: 'deep-purple'
                    },
                    {
                        text: 'Indigo',
                        value: 'indigo'
                    },
                    {
                        text: 'Blue',
                        value: 'blue'
                    },
                    {
                        text: 'Light Blue',
                        value: 'light-blue'
                    },
                    {
                        text: 'Cyan',
                        value: 'cyan'
                    },
                    {
                        text: 'Teal',
                        value: 'teal'
                    },
                    {
                        text: 'Green',
                        value: 'green'
                    },
                    {
                        text: 'Light Green',
                        value: 'light-green'
                    },
                    {
                        text: 'Lime',
                        value: 'lime'
                    },
                    {
                        text: 'Yellow',
                        value: 'yellow'
                    },
                    {
                        text: 'Amber',
                        value: 'amber'
                    },
                    {
                        text: 'Orange',
                        value: 'orange'
                    },
                    {
                        text: 'Deep Orange',
                        value: 'deep-orange'
                    },
                    {
                        text: 'Brown',
                        value: 'brown'
                    },
                    {
                        text: 'Blue Gray',
                        value: 'blue-gray'
                    },
                    {
                        text: 'Gray',
                        value: 'gray'
                    },
                    {
                        text: 'Black',
                        value: 'black'
                    }
                ]
            }
        },
        computed: {
            intervalStyle() {
                return stylings[this.styleInterval].bind(this)
            },
            hasIntervals() {
                return this.type in {
                    'week': 1,
                    'day': 1,
                    '4day': 1,
                    'custom-daily': 1
                }
            },
            hasEnd() {
                return this.type in {
                    'custom-weekly': 1,
                    'custom-daily': 1
                }
            }
        },
        mounted() {

        },
        methods: {
            create() {
                let self = this;

                self.$refs.maint.show(() => {

                })
            },
            showIntervalLabel(interval) {
                return interval.minute === 0
            }
        }
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
</style>