<template>
    <div>
        <v-card tile flat>
            <v-toolbar dark dense flat>
                <v-toolbar-items></v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-title>Import data map</v-toolbar-title>
            </v-toolbar>
            <v-container class="pa-0 pl-1" fluid grid-list-xs>
                <v-layout row wrap>
                    <v-flex xs8 class="pa-2">
                        <v-layout row wrap>
                            <v-flex xs8>
                                <h1 class="headline mt-1">Import Values</h1>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field class="pt-0" hide-details prepend-inner-icon="search"
                                    placeholder="Search..."></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <Grid />
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs4>
                        <v-card tile flat style="border-left: 1px solid #e2e2e2; height: calc(100vh - 112px);">
                            <v-card-text>
                                <h1 class="headline">System Values</h1>
                                <v-text-field hide-details prepend-inner-icon="search" placeholder="Search...">
                                </v-text-field>
                                <v-card flat class="mt-2">
                                    <v-card draggable="true" @dragstart="onDragStart(store)" v-for="(store, idx) in stores" :key="idx" class="mb-1"
                                        color="grey lighten-2" flat>
                                        <v-card-text class="pa-2">{{ store }}</v-card-text>
                                    </v-card>
                                </v-card>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </div>
</template>

<script>
    import Grid from './Grid'

    export default {
        components: {
            Grid
        },
        data() {
            return {
                stores: ["Hinterland Klerksdorp", "Hinterland Bloemfontein"]
            }
        },
        methods: {
            onDragStart(store) {
                let self = this;

                window.dragStore = store;
            }
        }
    }
</script>