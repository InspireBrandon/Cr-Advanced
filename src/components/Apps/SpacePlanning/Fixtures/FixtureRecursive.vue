<template>
    <div>
        <v-card class="mt-1" style="width: 450px; cursor: pointer;" tile color="grey darken-3" dark>
            <v-card-title class="pa-1 pl-2">
                <v-icon class="mr-2" v-if="fixtureGroup.showChildren" @click="getChildren">expand_more</v-icon>
                <v-icon class="mr-2" v-if="!fixtureGroup.showChildren" @click="getChildren">chevron_right</v-icon>
                <div>{{ fixtureGroup.name }}</div>
                <v-spacer></v-spacer>
                <v-btn class="ma-0" small icon @click="addNewGroup">
                    <v-icon>add</v-icon>
                </v-btn>
                <v-btn class="ma-0 ml-2" small icon @click="editNewGroup">
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-btn class="ma-0 ml-2" small icon @click="deleteNewGroup">
                    <v-icon>delete</v-icon>
                </v-btn>
            </v-card-title>
        </v-card>
        <div v-if="fixtureGroup.showChildren">
            <div v-for="(fg, idx) in fixtureGroup.children" :key="idx">
                <fixture-recursive :addGroup="addGroup" :editGroup="editGroup" :deleteGroup="deleteGroup" :parentArr="fixtureGroup.children" class="ml-4"
                    :fixtureGroup="fg" />
            </div>
            <div class="ml-3" v-if="fixtureGroup.children.length == 0">
                <a href="#" @click.prevent="addNewGroup">Add new group</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'fixture-recursive',
        props: ['fixtureGroup', 'addGroup', 'editGroup', 'deleteGroup', 'parentArr'],
        data() {
            return {}
        },
        methods: {
            getChildren() {
                let self = this;

                if (!self.fixtureGroup.showChildren) {
                    Axios.get(process.env.VUE_APP_API + "FixtureGroup?db=CR-Devinspire&parentID=" + self.fixtureGroup
                            .id)
                        .then(r => {
                            self.fixtureGroup.children = [];

                            r.data.forEach(fg => {
                                self.fixtureGroup.children.push(new FixtureGroup(fg));
                            });

                            self.fixtureGroup.showChildren = true;
                        })
                        .catch(e => {
                            console.log(e);
                        })
                } else {
                    self.fixtureGroup.showChildren = false;
                }
            },
            addNewGroup() {
                let self = this;

                self.addGroup(self.fixtureGroup, child => {
                    self.fixtureGroup.children.push(new FixtureGroup(child));
                    self.fixtureGroup.showChildren = true;
                })
            },
            editNewGroup() {
                let self = this;

                self.editGroup(self.fixtureGroup);
            },
            deleteNewGroup() {
                let self = this;

                self.deleteGroup(self.fixtureGroup, self.parentArr);
            }
        }
    }

    function FixtureGroup(params) {
        let self = this;
        self.id = params.id;
        self.parentID = params.parentID;
        self.name = params.name;
        self.children = [];
        self.showChildren = false;
    }
</script>