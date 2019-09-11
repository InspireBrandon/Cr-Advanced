<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Basket</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text style="height: 300px; overflow: auto;">
                <v-list tile>
                    <template v-for="(item, idx) in superGroups">
                        <v-list-tile @click="selected = item" :class="{ 'highlighted': selected == item  }" :key="idx">
                            {{ item.description }}</v-list-tile>
                        <v-divider :key="idx + 'd'"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">
                    Continue
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                superGroups: [],
                afterReturn: null,
                selected: null
            }
        },
        methods: {
            save() {
                let self = this;
            },
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.getSupergroups(() => {
                    self.dialog = true;
                })
            },
            getSupergroups(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Basket`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.superGroups = r.data;
                        callback();
                    })
            },
            save() {
                let self = this;
                self.dialog = false;
                self.afterReturn(self.selected);
            }
        }
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>