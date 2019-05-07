<template>
    <v-card>
        <v-toolbar flat dark dense color="primary">
            <!-- <v-text-field prepend-inner-icon="search" placeholder="Search" dark></v-text-field> -->
            <v-autocomplete prepend-inner-icon="search" placeholder="Search" @change="changeStore()" :items="filterList" v-model="dropSearch">
            </v-autocomplete>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>

            <v-btn-toggle v-model="searchType" class="transparent" multiple>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="1" flat>
                            <v-icon>
                                perm_data_setting</v-icon>
                        </v-btn>
                    </template>
                    <span>Data-Prep</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="2" flat>
                            <v-icon>assessment</v-icon>
                        </v-btn>
                    </template>
                    <span>Ranging</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="3" flat>
                            <v-icon>web</v-icon>
                        </v-btn>
                    </template>
                    <span>Planogram</span>
                </v-tooltip>
            </v-btn-toggle>
        </v-toolbar>
        <v-toolbar dense flat dark>
            <v-autocomplete placeholder="users" :items="users" v-model="selectedUser"></v-autocomplete>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="selectedView" class="transparent" >
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="0" flat>
                            <v-icon>
                                perm_data_setting</v-icon>
                        </v-btn>
                    </template>
                    <span>Data-Prep</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="1" flat>
                            <v-icon>assessment</v-icon>
                        </v-btn>
                    </template>
                    <span>Ranging</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" :value="2" flat>
                            <v-icon>web</v-icon>
                        </v-btn>
                    </template>
                    <span>Planogram</span>
                </v-tooltip>
            </v-btn-toggle>
        </v-toolbar>
        <!-- <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md4>
                    <v-select label="Select view" :items="views" v-model="selectedView">
                    </v-select>
                </v-flex>
                <v-flex md8>

                </v-flex>

            </v-layout>
        </v-container> -->

        <Tasks :searchTypeComp="searchType" :dropSearchComp="dropSearch" v-if="selectedView==0" />
        <MyProjects :searchTypeComp="searchType" :dropSearchComp="dropSearch" v-if="selectedView==1" />
        <Planograms ref="Planograms" :searchTypeComp="searchType" :dropSearchComp="dropSearch" v-if="selectedView==2" />
    </v-card>
</template>

<script>
    import Tasks from "./Index.vue"
    import MyProjects from "./MyProjects.vue"
    import Planograms from "./Planograms.vue"
   import {
        EventBus
    } from '@/libs/events/event-bus.js';

    export default {
        components: {
            Tasks,
            MyProjects,
            Planograms,
        },
        data() {
            return {
                
                filterList:[],
                Search:null,
                dropSearch:null,
                searchType:null,
                selectedUser: null,
                users: [],
                selectedView: 0,
                views: [{
                    text: "Tasks",
                    value: 0
                }, {
                    text: "My Projects",
                    value: 1
                }, {
                    text: "Space Planning",
                    value: 2
                }, ]
            }
        },
        mounted(){
             let self = this
            EventBus.$on('filter-items-changed',list => {
                self.filterList = list;
            });
        },
        created(){
            let self = this
            EventBus.$off('filter-items-changed');
        },
        methods: {
            changeView(item) {
                let self = this
                self.$nextTick(() => {

                })
            },
            changeStore(){
                 let self = this
                self.$nextTick(() => {
                self.$refs.Planograms.getData(self.dropSearch)
                })
            }
             
        }

    }
</script>