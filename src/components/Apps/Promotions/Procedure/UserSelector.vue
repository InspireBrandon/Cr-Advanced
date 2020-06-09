<template>
    <v-menu offset-y v-model="menu" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
            <div v-on="on" style="cursor: pointer;" @click="checkSelectedUser(step)" v-if="step.users.length>0">
                {{step.users.length}} users selected 
            </div>
            <div v-on="on" style="cursor: pointer;" v-else>Click to select...</div>
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
                    <div style="padding: 1px 2px;" :class="{ 'highlighted': group.selected == true  }"
                        @click="selectGroup(group)" v-for="group in groups" :key="group.id">
                        {{ group.name }}</div>
                </div>
                <v-divider></v-divider>
                <v-card-actions class="px-0 pb-0">
                    <v-btn small flat color="secondary" @click="stage = 0">back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" @click="submit(selected,step)">Continue</v-btn>
                </v-card-actions>
            </v-card-text>
            <v-card-text v-if="stage == 2" class="pa-2">
                <div>
                    <h3 class="mb-2">Users</h3>
                </div>
                <input style="border: 1px solid lightgrey; width: 100%;" type="text" placeholder="search..." />
                <v-divider class="mt-2"></v-divider>
                <div style="overflow-y: scroll; height: 200px;">
                    <div style="padding: 1px 2px;" active-class="highlighted"
                        :class="{ 'highlighted': group.selected == true  }" @click="selectUsers(group)"
                        v-for="group in users" :key="group.id">
                        {{ group.name }}</div>
                </div>
                <v-divider></v-divider>
                <v-card-actions class="px-0 pb-0">
                    <v-btn small flat color="secondary" @click="stage = 0">back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" @click="submit(selected,step)">Continue</v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script>
    import axios from "axios"
    export default {
        props: ["submitUsers", "users", "groups", "step"],
        data() {
            return {
                menu: false,
                stage: 0,
                selected: {
                    adminGroup: [],
                    user: []
                },
                adminUsers: []
            };
        },
        methods: {
            submit(selected, step) {
                let self = this
                self.submitUsers(selected, step)
                self.menu = false

            },
            checkSelectedUser(step) {
                let self = this
                console.log("checkSelectedUser", step);
                self.users.forEach(user => {
                    step.users.forEach(stepuser => {
                        if (stepuser.admin_User_ID == user.id) {
                            user.selected = true
                        }
                    })
                })

            },
            selectUsers(user) {
                let self = this
                let canAdd = true
                self.selected.user.forEach((item, idx) => {
                    if (item == user) {
                        canAdd = false
                        self.selected.user.splice(idx, 1)
                        user.selected = false
                    }
                })
                if (canAdd) {
                    self.selected.user.push(user)
                    user.selected = true
                }
                console.log("selected", self.selected);
                console.log("selected--user", user);

            },
            selectGroup(user) {
                let self = this
                let canAdd = true
                self.selected.adminGroup.forEach((item, idx) => {
                    if (item == user) {
                        canAdd = false
                        self.selected.adminGroup.splice(idx, 1)
                        user.selected = false
                    }
                })
                if (canAdd) {
                    self.selected.adminGroup.push(user)
                    user.selected = true
                }
                console.log("selected", self.selected);
                console.log("selected--user", user);

            },
        },
    };
</script>

<style>
    .user_item:hover {
        background: rgb(224, 224, 224);
    }

    .user_item {
        cursor: pointer;
    }

    .highlighted {
        background-color: #1976d2;
    }
</style>