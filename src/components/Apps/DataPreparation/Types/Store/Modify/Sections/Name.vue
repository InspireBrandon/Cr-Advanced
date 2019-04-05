<template>
    <div>
        <v-toolbar flat dense color="grey lighten-3">Name</v-toolbar>
        <v-form>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md6>
                        <v-text-field label="Code"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Name"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Display"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>