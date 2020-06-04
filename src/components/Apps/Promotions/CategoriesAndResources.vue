<template>
    <v-card height="100vh">
        <v-toolbar  dark dense>
             <v-btn flat @click="$router.back()">
                <v-icon>arrow_left</v-icon>
                <span>Back</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Categories and Resources
            </v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md12>
                    <v-list>
                        <v-list-tile style="padding:2px">
                            <v-list-tile-content>
                                <v-list-tile-title>Planogram Name</v-list-tile-title>
                            </v-list-tile-content>
                             <v-list-tile-content>
                                <v-list-tile-title>Stock Planner</v-list-tile-title>
                            </v-list-tile-content>
                             <v-list-tile-content>
                                <v-list-tile-title>Buyer Name</v-list-tile-title>
                            </v-list-tile-content>
                             <v-list-tile-content>
                                <v-list-tile-title>Admin</v-list-tile-title>
                            </v-list-tile-content>
                            
                            <!-- <v-list-tile-action>

                            </v-list-tile-action> -->
                        </v-list-tile>
                        <hr>
                        
                    </v-list>
                </v-flex>

            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {}
        }
    }
</script>