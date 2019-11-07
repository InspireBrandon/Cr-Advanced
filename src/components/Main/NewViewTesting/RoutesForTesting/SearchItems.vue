<template>
    <div>
        <div v-for="(item, idx) in filterItems" :key="idx">
            <div>
                <div class="subheading mt-1 pa-1 font-weight-bold" v-if="item.parentID == '0' && item.route == null"
                    style="cursor: pointer;" @click="item.showChildren = !item.showChildren">
                    <v-icon v-if="item.route == null">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
                    {{item.title}}
                </div>
                <div class="subheading mt-1 pa-1 font-weight-bold" style="cursor: pointer;"
                    v-if="item.parentID == '0' && item.route != null" @click="goTo(item.route)">
                    <v-icon>{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
                    {{item.title}}
                </div>
                <div>
                    <div v-if="item.parentID != '0' && item.route != null" style="cursor: pointer;"
                        class="body-1 font-weight-regular" @click="goTo(item.route)">
                        <v-icon v-if="item.routeType == 0">folder</v-icon>
                        <v-icon v-if="item.routeType == 1">insert_drive_file</v-icon>
                        <v-icon v-if="item.routeType == 2">stars</v-icon>
                        {{item.title}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['filterItems'],
        methods: {
            goTo(route) {
                this.$router.push(route);
            }
        }
    }
</script>