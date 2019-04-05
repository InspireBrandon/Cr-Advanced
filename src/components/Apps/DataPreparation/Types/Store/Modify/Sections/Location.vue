<template>
    <div>
        <v-toolbar flat dense color="grey lighten-3">Location</v-toolbar>
        <v-form>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md6>
                        <v-text-field label="Physical_Address"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="City"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Region"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Province"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Country"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>