<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar prominent>
                <v-btn icon @click="modalShow = false">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-spacer></v-spacer>

                <v-autocomplete hide-selected v-model="friends" :disabled="isUpdating" :items="people" box chips color="blue-grey lighten-2"
                    label="Select" item-text="name" item-value="name">
                    <template v-slot:selection="data">
                        <v-chip :selected="data.selected" close class="chip--select-multi" @input="remove(data.item)">
                            <v-avatar>
                                <img :src="data.item.avatar">
                            </v-avatar>
                            {{ data.item.name }}
                        </v-chip>
                    </template>
                    <template v-slot:item="data">
                        <template>
                            <v-list-tile-avatar>
                                <img :src="data.item.avatar">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                            </v-list-tile-content>
                        </template>
                    </template>
                </v-autocomplete>

                <!-- <v-text-field v-model="inviteText" label="Email Address"></v-text-field> -->
                <v-btn @click="inviteUser" fab small color="primary">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-toolbar>
            <v-list dense>
                <template v-for="(item, index) in items">

                    <v-list-tile color="grey-darken-4" :key="item.title" avatar @click="">
                        <v-list-tile-avatar>
                            <v-img :src="item.avatar"></v-img>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-spacer></v-spacer>

                        <v-list-tile-action>
                            <v-menu>
                                <v-btn slot="activator" icon>
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-tile>Revoke Access</v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-list-tile-action>

                    </v-list-tile>

                    <v-divider :key="index" :inset="item.inset"></v-divider>
                </template>
            </v-list>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                modalShow: false,
                inviteText: '',
                afterClose: null,
                autoUpdate: true,
                friends: ['Sandra Adams', 'Britta Holt'],
                isUpdating: false,
                people: [
                ],
                items: [{
                        avatar: 'https://vignette.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg/revision/latest?cb=20170927034529',
                        title: 'Luke Skywalker',
                        subtitle: "Genral Manager"
                    },
                    {
                        avatar: 'https://cdn-images-1.medium.com/max/1200/1*BRJuVwF0LHlmiLT5dB5BWA.png',
                        title: 'Yoda',
                        subtitle: "Buyer"
                    },
                    {
                        avatar: 'http://static1.squarespace.com/static/55bdd8e1e4b003dc5b7da717/55bf4150e4b026c66de5c764/5628c277e4b001a55c3d9c76/1445513526709/?format=1500w',
                        title: 'C-3PO',
                        subtitle: "Something Weird"
                    }
                ]
            }
        },
        created() {
            this.getUsers();
        },  
        methods: {
            getUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        r.data.forEach(element => {
                            self.people.push({
                                name: element.firstname + " " + element.lastname,
                                avatar: 'data:image/png;base64,' + element.image
                            })
                        });
                    })
            },
            inviteUser() {
                let self = this;
            },
            close() {
                let self = this
                self.modalShow = false
            },
            open(userID, callback) {
                let self = this
                self.afterClose = callback;
                self.userID = userID;
                self.modalShow = true
            },
            remove(item) {
                const index = this.friends.indexOf(item.name)
                if (index >= 0) this.friends.splice(index, 1)
            }
        },
        watch: {
            isUpdating(val) {
                if (val) {
                    setTimeout(() => (this.isUpdating = false), 3000)
                }
            }
        },
    }
</script>