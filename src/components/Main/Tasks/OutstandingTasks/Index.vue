<template>
    <v-dialog v-model="dialog" persistent width="80%">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Outstanding tasks</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <Grid :rowData="filteredList" :statusList="statusList" :typeList="typeList" ref="Grid" />
            </v-card-text>
            <v-divider class="mx-2"></v-divider>
            <v-card-actions style="text-align: right;">
                <span>Total Outstanding Tasks: {{ filteredList.length }}</span>
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click.native="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
        <SplashLoader ref="SplashLoader" />
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import SplashLoader from "@/components/Common/SplashLoader.vue"

    import StatusHandler from '@/libs/system/projectStatusHandler'

    function filterStatus(e) {
        let canGoThrough = false;

        if (e.username != null) {
            if (e.type == 1 || e.type == 2 || e.type == 3 || e.type == 6) {
                if (
                    e.status == 1 ||
                    e.status == 2 ||
                    e.status == 6 ||
                    e.status == 7 ||
                    e.status == 8 ||
                    e.status == 10 ||
                    e.status == 12 ||
                    e.status == 17 ||
                    e.status == 19 ||
                    e.status == 20 ||
                    e.status == 21 ||
                    e.status == 28 ||
                    e.status == 29 ||
                    e.status == 31 ||
                    e.status == 32 ||
                    e.status == 34 ||
                    e.status == 35 ||
                    e.status == 37 ||
                    e.status == 38) {
                    if (e.type == 2) {
                        if ((e.status == 1 || e.status == 7 || e.status == 20) && e.rangeFileName != null) {
                            canGoThrough = true;
                        }
                    } else if (e.type == 3) {
                        // if (e.systemFileName != null) {
                        //     canGoThrough = true;
                        // }

                        canGoThrough = true;
                    } else {
                        canGoThrough = true;
                    }
                }
            }
        }

        return canGoThrough;
    }

    function parseDate(str) {
        var mdy = str.split('-');

        return new Date(mdy[0], mdy[1] - 1, mdy[2]);
    }

    function datediff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    function checkNull(prop) {
        if (prop == null) {
            return ""
        } else {
            return prop
        }
    }

    export default {
        components: {
            Grid,
            SplashLoader
        },
        data() {
            return {
                dialog: false,
                outstandingTasks: [],
                statusList: [],
                typeList: []
            }
        },
        computed: {
            filteredList() {
                let self = this;

                let filteredList = self.outstandingTasks.filter(e => {
                    return filterStatus(e);
                })

                let currentDate = new Date()
                let dateFormatted = formatDate(currentDate);

                filteredList.forEach(element => {
                    element["typeFormatted"] = self.typeList[element.type == -1 ? 5 : element.type].text;
                    element["statusFormatted"] = self.statusList[element.status == -1 ? 18 : element.status]
                        .text;
                    element["daysSince"] = datediff(parseDate(element.dateTimeString), parseDate(dateFormatted))

                    let intendedStores = "";

                    if (element.store != null || element.store != undefined) {
                        intendedStores = element.store
                    } else {
                        intendedStores = (checkNull(element.storeCluster) + " " + checkNull(element
                            .categoryCluster) + " " + checkNull(element.customCluster));
                    }

                    element["intendedStores"] = intendedStores;
                });

                return filteredList;
            }
        },
        created() {
            let self = this;
            let statusHandler = new StatusHandler();
            self.statusList = statusHandler.getStatus()
            self.typeList = statusHandler.getTypeList()
        },
        methods: {
            show() {
                let self = this;
                self.dialog = true;
                self.outstandingTasks = [];
                self.getOutstandingTasks();
            },
            getOutstandingTasks() {
                let self = this;

                self.$refs.SplashLoader.show();

                Axios.get(process.env.VUE_APP_API + "OutstandingTasks")
                    .then(r => {
                        self.outstandingTasks = r.data.projectTXList;
                        self.$refs.SplashLoader.close()
                    })
                    .catch(e => {
                        self.$refs.SplashLoader.close()
                        alert("Failed to get outstanding tasks");
                        console.error("Failed to get outstanding tasks. " + e);
                    })
            }
        }
    }
</script>