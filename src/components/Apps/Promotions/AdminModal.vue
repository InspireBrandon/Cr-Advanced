<template>
    <v-dialog v-model="dialog" persistent fullscreen>
        <v-toolbar dark color="primary">
            <v-toolbar-title>
                Manage Admin
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-toolbar dark>
            <v-btn  @click="userModal=true">
                Add user
            </v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-card>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md12>
                        <v-list dense hover class="pa-0">
                            <v-list-tile avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>Admin Group</v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                                <v-list-tile-content>
                                    <v-list-tile-title>Name</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-content>
                                    <v-list-tile-title>E-Mail</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <hr>
                            <div v-for="(item,idx) in adminList" :key="idx">
                                <template>
                                    <v-list-tile avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title></v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-spacer></v-spacer>
                                        <v-list-tile-actions>
                                        </v-list-tile-actions>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                </template>
                            </div>
                        </v-list>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
        <v-dialog v-model="userModal" persistent width="800" height="800">
            <v-toolbar>
                <v-toolbar-title>
                    Add User
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="userModal = false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex></v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                adminList: [],
                userModal: false,
                userItem: null,
            }
        },
        methods: {
            open(callback) {
                let self = this
                self.dialog = true
            }
        }
    }
</script>