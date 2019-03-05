<template>
    <v-container  grid-list-md>
        <v-layout  row wrap>
            <v-flex lg4 md4 sm12 xs12>
                <v-card>
                    <v-card-title primary-title>
                        <v-layout class="header" row wrap>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-avatar :tile="false" :size="150" color="grey lighten-4">
                                    <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
                                </v-avatar>
                                <h3 class="headline mb-0">{{user.firstName}} {{user.lastName}}</h3>

                            </v-flex>
                            <v-flex lg6 sm6 xs6>
                                <v-btn flat @click="openModal">
                 
                                    Profile Settings
                                </v-btn>
                            </v-flex>
                            <v-flex lg6 sm6 xs6>
                                <v-btn flat>
                                    Account Settings
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-title>

                </v-card>
            </v-flex>

            <v-flex v-if="account" lg8 md8 sm12 xs12>
                <v-flex>
                    <v-card class="darkTable">
                        <v-container>
                            <v-layout>
                                <h1 class="headline mb-0">My Databases</h1>
                                <v-spacer></v-spacer>
                                <v-btn color="primary">Options</v-btn>
                            </v-layout>
                            <v-layout>
                                <v-flex>Name</v-flex>
                                <v-spacer></v-spacer>
                                <v-flex>Cost</v-flex>
                                <v-spacer></v-spacer>
                                <v-flex> Storage</v-flex>
                            </v-layout>
                            <v-divider></v-divider>
                        </v-container>
                    </v-card>
                </v-flex>
                <v-flex v-for="(item,index) in dataBases" :key=index>
                    <v-hover>
                        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 20 : 2}`" class="darkTable">
                            <v-container>
                                <v-layout>
                                    <v-flex> {{item.name}}</v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex>{{item.cost}}</v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex> {{item.storage}}</v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>

                    </v-hover>

                </v-flex>
                <v-layout>
                    <h1 class="headline mb-0">My Features</h1>
                    <v-spacer></v-spacer>
                    <v-btn color="primary">Options</v-btn>
                </v-layout>
                <v-list class="darkTable" dense>
                    <v-list-tile>
                        <v-list-tile-content>
                            Name
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-content>
                            Cost
                        </v-list-tile-content>
                    </v-list-tile>
                    <hr>
                    <v-list-tile v-for="(item,index) in features" :key=index>
                        <v-list-tile-content>{{item.name}}
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-list-tile-content>R{{item.cost}}
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
            <v-flex v-if="!account" lg8 md8 sm12 xs12>
                <span>You don't have an account setup please click on the account settings button on the left</span>
            </v-flex>
        </v-layout>
        <UserModal ref="UserModal"></UserModal>
    </v-container>
</template>

<script>
import UserModal from "./UserModal.vue"
export default {
    components: {
      UserModal,
      
    },
        data() {
            return {
                account: true,
                user: {
                    firstName: "John",
                    lastName: "Doe",
                },
                features: [],
                dataBases: [],
            }
        },
        created() {
            this.getData()
        },
        methods: {
            openModal(){
                let self = this
                self.$refs.UserModal.open()
            },
            getData() {
                var self = this
                // get features

                self.features.push({
                    name: "Space Planning",
                    cost: "300"
                }, {
                    name: "File Management",
                    cost: "487"
                })

                // get databases
                self.dataBases.push({
                    name: "database1",
                    storage: "50%",
                    cost: "35/pm"
                }, {
                    name: "database2",
                    storage: "98%",
                    cost: "350/pm"
                }, {
                    name: "database3",
                    storage: "10%",
                    cost: "23/pm"
                })
            }
        }
    }
</script>
<style>
    .header {
        align-content: center;
        text-align: center;
    }

    .darkTable {
        border: 2px solid #4a4a4a;
        background-color: #505050;
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }

    .buttonHolder {
        border-color: black
    }
</style>