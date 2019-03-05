<template>
    <div>
        <v-dialog v-model="showLoader" hide-overlay persistent width="300">
            <v-card color="primary">
                <v-card-text>
                    Loading: Range Planning
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <div v-if="!showLoader">
            <v-toolbar dense>
                <v-toolbar-items>
                    <v-menu dark offset-y style="margin-bottom: 10px;">
                        <v-btn slot="activator" flat>File</v-btn>
                        <v-list>
                            <v-list-tile>
                                <v-list-tile-title>New</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Open</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Save</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Refresh Range</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>Close</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-toolbar-title>Range Planning</v-toolbar-title>
            </v-toolbar>
            <v-container grid-list-md>
                <v-img :aspect-ratio="16/4" :src="'https://community.devexpress.com/blogs/oliver/20171017/Main.png'">
                </v-img>
            </v-container>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'range_planning',
        data: (() => {
            return {
                showLoader: true
            }
        }),
        created() {
            let self = this;

            setTimeout(() => {
                self.showLoader = false;
            }, 2000);
        }
    }
</script>