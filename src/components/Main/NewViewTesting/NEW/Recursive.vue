<template>
    <div>
        <div v-for="(item, idx) in items" :key="idx">
            <div @contextmenu.prevent="onContextMenu($event, item)" class="route-item">
                <input v-model="item.selected" @change="onSelect(item)" style="margin-top: 3px; margin-right: 5px;" type="checkbox" v-if="item.allowSelect" />
                <div @click="item.click" v-if="item.showImage" style="width: 20px; text-align: center;">
                    <img style="max-width: 20px; max-height: 15px;" :src="item.imageSrc" :lazy-src="item.imageSrc" aspect-ratio="1" contain>
                </div>
                <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary">
                </v-progress-circular>
                <v-icon @click="item.click" :size="12" v-if="!item.loading && item.showIcon">{{ item.icon }}</v-icon>
                <span @click="item.click" class="ml-1">{{item.name}}</span>
                <span @click="item.click" class="ml-1" v-if="item.showChildrenCount">({{ item.children.length }})</span>
            </div>
            <recursive v-if="item.showChildren" style="margin-left: 15px;" :onContextMenu="onContextMenu" :items="item.children"></recursive>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['items', 'onContextMenu'],
        name: 'recursive',
        methods: {
            onSelect(item) {
                let self = this;
                self.$nextTick(() => {
                    item.onSelect();
                })
            }
        }
    }
</script>

<style>
    .route-item {
        cursor: pointer;
        font-size: 12px;
        display: flex;
    }
</style>