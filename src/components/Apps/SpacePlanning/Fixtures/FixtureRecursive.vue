<template>
    <div>
        <v-card style="width: 50%; cursor: pointer;" class="hoverable" dark tile flat>
            <v-card-title class="pa-0 pl-2" style="height: 28px">
                <v-icon class="mr-2" v-if="fixtureGroup.showChildren" @click="getChildren">expand_more</v-icon>
                <v-icon class="mr-2" v-if="!fixtureGroup.showChildren" @click="getChildren">chevron_right</v-icon>

                <div @click="getChildren">{{ fixtureGroup.name }}</div>
                <v-spacer></v-spacer>
                <v-menu bottom offset-y transition="scale-transition">
                    <v-btn icon small slot="activator" class="ma-0 ml-2 hoverableAction" flat>
                        <v-icon :size="22">add</v-icon>
                    </v-btn>
                    <v-list dense class="pa-0">
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'Group')">
                            <v-list-tile-title>Group</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'Gondola')">
                            <v-list-tile-title>Gondola</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'Obstruction')">
                            <v-list-tile-title>Obstruction</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'Fixture')">
                            <v-list-tile-title>Fixture</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'SubFixture')">
                            <v-list-tile-title>SubFixture</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'Palette')">
                            <v-list-tile-title>Palette</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="addNewGroup(fixtureGroup, 'Rendering')">
                            <v-list-tile-title>Rendering</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn class="ma-0 ml-2 hoverableAction" small icon @click="editNewGroup">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn class="ma-0 ml-2 hoverableAction" small icon @click="deleteNewGroup">
                    <v-icon>delete</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
        </v-card>
        <div v-if="fixtureGroup.showChildren">
            <div v-for="(fg, idx) in fixtureGroup.children" :key="idx">
                <fixture-recursive :addGroup="addGroup" :editGroup="editGroup" :deleteGroup="deleteGroup"
                    :parentArr="fixtureGroup.children" class="ml-4" :fixtureGroup="fg" :editFixture="editFixture"
                    :deleteFixture="deleteFixture" :openMenuAdd="openMenuAdd" :type="type" />
            </div>
            <div class="ml-4" v-for="(fixture, idx) in fixtureGroup.fixtures" :key="idx">
                <v-card style="width: 50%; cursor: pointer;" tile flat>
                    <v-card-title class="pa-0 pl-2">
                        <div>{{ getType(fixture) }} - {{ fixture.name }}</div>
                        <v-spacer></v-spacer>
                        <v-btn class="ma-0 ml-2" small icon @click="editNewFixture(fixture)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn class="ma-0 ml-2" small icon @click="deleteNewFixture(fixture)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                </v-card>
            </div>
            <div class="ml-3" v-if="fixtureGroup.children.length == 0 && fixtureGroup.fixtures.length == 0">
                <a href="#" @click.prevent="addNewGroup(fixtureGroup, 'Group')">Add new group</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'fixture-recursive',
        props: ['fixtureGroup', 'addGroup', 'editGroup', 'deleteGroup', 'editFixture', 'deleteFixture', 'parentArr',
            "openMenuAdd", "type"
        ],
        data() {
            return {}
        },
        methods: {
            getType(item) {
                let self = this
                if (item.type == 0)
                    return "Gondola"
                if (item.type == 1)
                    return "Obstruction"
                if (item.type == 2) {
                    switch (item.fixtureType) {
                        case 0:
                            return "Base"
                            break;
                        case 1:
                            return "Shelf"
                            break;
                        case 2:
                            return "Pegboard"
                            break;
                        case 3:
                            return "Pegbar"
                            break;
                        case 4:
                            return "ShareBox"
                            break;

                        default:
                            break;
                    }
                }
                if (item.type == 3) {
                    switch (item.fixtureType) {
                        case 0:
                            return "Peg"
                            break;
                        case 1:
                            return "Basket"
                            break;
                        case 2:
                            return "Divider"
                            break;
                        case 3:
                            return "Cabinet"
                            break;
                        default:
                            break;
                    }
                }
                if (item.type == 4)
                    return "Palette"

            },
            getChildren() {
                let self = this;

                if (!self.fixtureGroup.showChildren) {
                    Axios.get(process.env.VUE_APP_API +
                            `FixtureGroup?db=CR-Devinspire&parentID=${self.fixtureGroup.id}&type=1`)
                        .then(r => {
                            self.fixtureGroup.children = [];

                            r.data.fixtureGroups.forEach(fg => {
                                self.fixtureGroup.children.push(new FixtureGroup(fg));
                            });

                            self.fixtureGroup.fixtures = r.data.fixtures;
                            self.fixtureGroup.showChildren = true;
                        })
                        .catch(e => {
                            console.log(e);
                        })
                } else {
                    self.fixtureGroup.showChildren = false;
                }
            },
            addNewGroup(item, type) {
                let self = this;

                if (type == "Group") {
                    self.addGroup(self.fixtureGroup, self.type, child => {
                        self.fixtureGroup.children.push(new FixtureGroup(child));
                        self.fixtureGroup.showChildren = true;
                    })
                } else {
                    self.openMenuAdd(type, item)
                }
            },
            editNewGroup() {
                let self = this;

                self.editGroup(self.fixtureGroup);
            },
            deleteNewGroup() {
                let self = this;

                self.deleteGroup(self.fixtureGroup, self.parentArr);
            },
            editNewFixture(fixture) {
                let self = this;

                console.log(self.type)

                self.editFixture(fixture, self.type);
            },
            deleteNewFixture(fixture) {
                let self = this;

                self.deleteFixture(fixture, self.fixtureGroup.fixtures);
            }
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

<style>
    .hoverable {
        cursor: pointer;
    }

    .hoverable:hover {
        background-color: rgb(34, 34, 34) !important;
    }

    .hoverableAction {
        display: none;
    }

    .hoverableAction:hover {
        display: block;
    }

    .hoverable:hover .hoverableAction {
        display: block;
    }
</style>