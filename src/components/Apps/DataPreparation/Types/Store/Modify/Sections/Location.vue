<template>
    <div>
        <v-toolbar flat dense color="primary" dark>Location</v-toolbar>
        <v-form>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="Physical Address"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="City"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="Region"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="Province"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="Country"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>