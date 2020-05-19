<template>
    <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
            <div v-on="on" style="cursor: pointer;">Click to select...</div>
        </template>
        <v-card width="300">
            <v-card-text v-if="stage == 0">
                <p>Admin group or user?</p>
                <v-btn @click="stage = 1" small block color="primary">Admin group</v-btn>
                <v-btn @click="stage = 2" small block color="primary">Users</v-btn>
            </v-card-text>
            <v-card-text v-if="stage == 1" class="pa-2">
                <div>
                    <h3 class="mb-2">Admin groups</h3>
                </div>
                <input style="border: 1px solid lightgrey; width: 100%;" type="text" placeholder="search..." />
                <v-divider class="mt-2"></v-divider>
                <div style="overflow-y: scroll; height: 200px;">
                    <div class="user_item" style="padding: 1px 2px;" v-for="group in 20" :key="group">Admin group {{ group }}</div>
                </div>
                <v-divider></v-divider>
                <v-card-actions class="px-0 pb-0">
                    <v-btn small flat color="secondary" @click="stage = 0">back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary">Continue</v-btn>
                </v-card-actions>
            </v-card-text>
            <v-card-text v-if="stage == 2" class="pa-2">
                <div>
                    <h3 class="mb-2">Users</h3>
                </div>
                <input style="border: 1px solid lightgrey; width: 100%;" type="text" placeholder="search..." />
                <v-divider class="mt-2"></v-divider>
                <div style="overflow-y: scroll; height: 200px;">
                    <div class="user_item" style="padding: 1px 2px;" v-for="group in 20" :key="group">Admin group {{ group }}</div>
                </div>
                <v-divider></v-divider>
                <v-card-actions class="px-0 pb-0">
                    <v-btn small flat color="secondary" @click="stage = 0">back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary">Continue</v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        data() {
            return {
                stage: 0,
                selected: {
                    adminGroup: null,
                    user: null
                }
            };
        },
        methods: {}
    };
</script>

<style>
    .user_item:hover {
        background: rgb(224, 224, 224);
    }

    .user_item {
        cursor: pointer;
    }
</style>