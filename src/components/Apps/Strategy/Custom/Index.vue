<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
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
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>Baskets</v-btn>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title>Add</v-list-tile-title>
                        </v-list-tile>
                        <!-- <v-list-tile @click="openLevels">
                            <v-list-tile-title>Basket Levels</v-list-tile-title>
                        </v-list-tile> -->
                        <v-list-tile>
                            <v-list-tile-title>Line items</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Custom Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn color="primary">Refresh</v-btn>
            <v-btn color="primary">Setup</v-btn>
        </v-toolbar>
    </v-card>
</template>