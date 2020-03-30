<template>
    <div>
        <v-chip draggable="true" @drag="dragMove" @dragstart="dragStart('CHIP')" @dragend="clearDrag"
            class="scrolling-text">
            <div v-if="selectedItem != null">{{ selectedItem.data.name }}</div>
            <div v-else>NOTHING SELECTED</div>
        </v-chip>
        <v-divider vertical></v-divider>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <v-btn small slot="activator">Library</v-btn>
            <v-card height="400" width="800">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        Library
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-flex xs12>
                        <v-divider class="mx-2"></v-divider>
                    </v-flex>
                    <v-flex xs12>
                        <FixtureRecursive :addGroup="''" :editGroup="''" :deleteGroup="''"
                            v-for="(fg, idx) in fixtureGroups" :key="idx" :fixtureGroup="fg" :parentArr="fixtureGroups"
                            :editFixture="''" :deleteFixture="''" :type="1" :openMenuAdd="''" :isEdit="false"
                            :selectedItem="selectedItem" :selectLibraryItem="selectLibraryItem" :dragStart="dragStart"
                            :dragMove="dragMove" :clearDrag="clearDrag">
                        </FixtureRecursive>
                    </v-flex>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import FixtureRecursive from '@/components/Apps/SpacePlanning/Fixtures/FixtureRecursive.vue'
    import Axios from 'axios'
    export default {
        components: {
            FixtureRecursive
        },
        data() {
            return {
                selectedItem: null,
                searchRenderings: "",
                rendering: [],
                gondolas: [],
                obstruction: [],
                fixture: [],
                subFixture: [],
                palette: [],
                fixtureGroups: [],
                menu: false,

            }
        },
        computed: {
            filteredrendering() {
                if (this.searchRenderings == "") {
                    return this.rendering.filter(item => {
                        return item.fixtureGroupID == null
                    });
                }

                return this.rendering.filter(item => {
                    return (item.name.toLowerCase().includes(this.searchRenderings.toLowerCase()) && item
                        .fixtureGroupID ==
                        null)
                });
            },
        },
        mounted() {
            let self = this;

            self.getFixtureGroups();

            Axios.get(process.env.VUE_APP_API + "Fixture?db=CR-Devinspire")
                .then(r => {

                    for (var i = 0; i < r.data.length; i++) {
                        let el = r.data[i];
                        if (el.rendering) {
                            self.rendering.push(el);
                        } else {
                            if (el.type == 0)
                                self.gondolas.push(el);
                            if (el.type == 1)
                                self.obstruction.push(el);
                            if (el.type == 2)
                                self.fixture.push(el);
                            if (el.type == 3)
                                self.subFixture.push(el);
                            if (el.type == 4)
                                self.palette.push(el);
                        }
                    }
                })
        },
        methods: {
            dragCustomStart(where, item, type) {
                let self = this;
                if (where == "CHIP") {
                    if (self.selectedItem == null) {
                        alert("Please select a library item");
                    }
                } else if (where == "LIBRARY") {
                    self.selectedItem = {
                        type: type,
                        data: item
                    };
                }

                window.library = self.selectedItem;
            },
            dragStart(where, item) {
                let self = this;
                if (where == "CHIP") {
                    if (self.selectedItem == null) {
                        alert("Please select a library item");
                    }
                } else if (where == "LIBRARY") {
                    self.selectLibraryItem(item);
                }

                window.library = self.selectedItem;
            },
            dragMove(ev) {
                ev.currentTarget.style.border = "dashed";
            },
            clearDrag(ev) {
                ev.currentTarget.style.border = "none";
                window.library = null;
            },
            getFixtureGroups() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `FixtureGroup?db=CR-Devinspire&parentID=${null}&type=1`)
                    .then(r => {
                        self.fixtureGroups = [];

                        console.log(r.data)

                        r.data.fixtureGroups.forEach(fg => {
                            self.fixtureGroups.push(new FixtureGroup(fg));
                        });
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            selectLibraryItem(item) {
                let self = this;
                let strType = "";

                switch (item.type) {
                    case 0: {
                        // gondola
                        strType = "GONDOLA";
                    }
                    break;
                case 1: {
                    // Obstruction
                    strType = "OBSTRUCTION";
                }
                break;
                case 2: {
                    // fixture
                    switch (item.fixtureType) {
                        case 0: {
                            // base
                            strType = "BASE";
                        }
                        break;
                    case 1: {
                        // shelf
                        strType = "SHELF";
                    }
                    break;
                    case 2: {
                        // pegboard
                        strType = "PEGBOARD";
                    }
                    break;
                    case 3: {
                        // pegbar
                        strType = "PEGBAR";
                    }
                    break;
                    case 4: {
                        // sharebox
                        strType = "SHAREBOX";
                    }
                    break;
                    }
                }
                break;
                case 3: {
                    // sub fixture
                    switch (item.fixtureType) {
                        case 0: {
                            // base
                            strType = "PEG";
                        }
                        break;
                    case 1: {
                        // shelf
                        strType = "BASKET";
                    }
                    break;
                    case 3: {
                        // shelf
                        strType = "AREA";
                    }
                    break;
                    case 4: {
                        // label holder
                        strType = "LABELHOLDER";
                    }
                    break;
                    }
                }
                break;
                case 4: {
                    // palettes
                    strType = "PALETTE";
                }
                break;
                }

                if (item.type == "textheader") {
                    strType = "TEXTHEADER"
                }

                self.selectedItem = {
                    type: strType,
                    data: item
                };
            },
        }
    }

    function FixtureGroup(params) {
        let self = this;
        self.id = params.id;
        self.parentID = params.parentID;
        self.name = params.name;
        self.type = params.type;
        self.children = [];
        self.fixtures = params.fixtures;
        self.showChildren = false;
    }
</script>