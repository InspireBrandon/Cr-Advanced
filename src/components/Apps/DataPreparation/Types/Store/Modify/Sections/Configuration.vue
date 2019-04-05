<template>
    <div>
        <v-toolbar flat dense color="primary" dark>Configuration</v-toolbar>
        <v-form>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-checkbox color="primary" label="Catman Data Sharing"></v-checkbox>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select label="Retail Chain"></v-select>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="Loyalty Card"></v-text-field>
                    </v-flex>
                     <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="POS System"></v-text-field>
                    </v-flex>
                     <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field label="Till Points"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>