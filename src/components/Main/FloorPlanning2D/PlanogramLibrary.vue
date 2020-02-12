<template>
    <v-layout>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <v-btn small slot="activator">Library</v-btn>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>
                        Planograms
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-text-field style="margin-left: 10px; margin-top: 8px; width: 200px" v-model="searchText"
                            append-icon="search"></v-text-field>
                    </v-toolbar-items>
                </v-toolbar>
                <v-list>
                    <div v-for="(item,index)  in filteredSpacePlans" :key="index" draggable="true" @drag="dragMove"
                        @dragstart="dragstart(item)" @dragend="clearDrag">
                        <v-list-tile>
                            {{item.planogram_Name}}
                        </v-list-tile>
                        <v-divider>
                        </v-divider>
                    </div>
                </v-list>
            </v-card>
        </v-menu>

    </v-layout>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                menu: false,
                planograms: [],
                searchText: null,

            }
        },
        computed: {
            filteredSpacePlans() {
                return this.planograms.filter(item => {
                    if (!this.searchText) return this.planograms;
                    return (item.planogram_Name.toLowerCase().includes(this.searchText.toLowerCase()))
                });
            }
        },
        // computed
        mounted() {
            let self = this
            axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            axios.get(process.env.VUE_APP_API + `FloorPlanHeaders`).then(r => {
                console.log("[GET HEADERS]", r);
                self.planograms = r.data

            })
        },
        methods: {
            clearDrag(ev) {
                ev.currentTarget.style.border = "none";
                window.library = null;
            },
            dragMove(ev) {
                ev.currentTarget.style.border = "dashed";
            },
            dragstart(item) {
                let self = this
                window.libraryDrag = item
            },
        }
    }
</script>