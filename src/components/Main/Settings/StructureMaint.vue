<template>
    <div>
        <v-card>
            <v-toolbar dark dense flat>
                <v-toolbar-title>{{ name }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="create" small color="primary" icon>
                    <v-icon color="grey darken-4">add</v-icon>
                </v-btn>
                <v-btn small color="primary" icon>
                    <v-icon color="grey darken-4">get_app</v-icon>
                </v-btn>
                <v-btn @click="deleteItem" :disabled="selected == null" small color="error" icon>
                    <v-icon color="grey darken-4">delete</v-icon>
                </v-btn>
            </v-toolbar>
            <v-progress-linear v-if="loading" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
            <v-card-text style="height: calc(100vh - 275px); overflow-y: scroll;" class="pa-0">
                <div style="cursor: pointer;" @dblclick="modify" @click="selected = item" v-for="(item, idx) in items"
                    :key="idx" :class="{ 'selected_item': selected == item  }">
                    <div style="padding: 3px;">{{ item.name }}</div>
                    <v-divider></v-divider>
                </div>
            </v-card-text>
        </v-card>
        <YesNoModal ref="YesNoModal" />
        <Prompt ref="Prompt" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import YesNoModal from '@/components/Common/YesNoModal'
    import Prompt from '@/components/Common/Prompt'

    export default {
        props: ['name', 'server'],
        components: {
            YesNoModal,
            Prompt
        },
        data() {
            return {
                loading: true,
                items: [],
                selected: null
            }
        },
        mounted() {
            let self = this;
            self.get();
        },
        methods: {
            get() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + self.server)
                    .then(r => {
                        if (r.data == null) {
                            self.items = [];
                        } else {
                            self.items = r.data;
                        }

                        self.loading = false;
                    })
            },
            create() {
                let self = this;

                self.$refs.Prompt.show("", self.name + " Name", "Please enter a " + self.name + " Name", name => {
                    self.loading = true;

                    let request = {
                        name: name
                    }

                    Axios.post(process.env.VUE_APP_API + self.server, request)
                        .then(r => {
                            self.items.push(r.data);
                            self.loading = false;
                        })
                })
            },
            modify() {
                let self = this;

                self.$refs.Prompt.show(self.selected.name, self.name + " Name", "Please enter a " + self.name + " Name",
                    name => {
                        self.loading = true;

                        let request = {
                            id: self.selected.id,
                            name: name
                        }

                        Axios.put(process.env.VUE_APP_API + self.server, request)
                            .then(r => {
                                self.loading = false;
                                self.selected.name = name;
                            })
                    })
            },
            deleteItem() {
                let self = this;

                self.$refs.YesNoModal.show("Delete this " + self.name, value => {
                    if (value) {
                        self.loading = true;

                        Axios.delete(process.env.VUE_APP_API + self.server + "/" + self.selected.id, self.selected)
                            .then(r => {
                                self.loading = false;
                                self.items.splice(self.items.indexOf(self.selected), 1);
                                self.selected = null;
                            })
                    }
                })
            }
        }
    }
</script>

<style>
    .selected_item {
        background: #1976d2;
        color: white;
    }
</style>