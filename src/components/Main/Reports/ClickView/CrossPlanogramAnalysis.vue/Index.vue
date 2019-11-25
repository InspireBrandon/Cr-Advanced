<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Clustering</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-tabs-items v-model="active">
            <v-tab-item v-for="tab in tabs" :key="tab.name">
                <v-card flat tile>
                    <component ref="component" :is="tab.component"></component>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>