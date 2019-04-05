<template>
    <div>
        <v-toolbar flat dense color="primary" dark>Properties</v-toolbar>
        <v-form>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select label="Store Format"></v-select>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select label="Store Type"></v-select>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select label="Store Status"></v-select>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
