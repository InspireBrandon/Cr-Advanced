<template>
    <div>
        <div v-for="(item, idx) in items" :key="idx" :disabled="item.disabled">
            <div @contextmenu.prevent="onContextMenu($event, item)" class="route-item">

                <input v-model="item.selected" @change="onSelect(item)" style="margin-top: 3px; margin-right: 5px;"
                    type="checkbox" v-if="item.allowSelect" />
                <div @click="item.click" v-if="item.showImage" style="width: 20px; text-align: center;">
                    <img style="max-width: 20px; max-height: 15px;" :src="item.imageSrc" :lazy-src="item.imageSrc"
                        aspect-ratio="1" contain>
                </div>
                <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary">
                </v-progress-circular>
                <v-icon @click="item.click" :size="12" v-if="!item.loading && item.showIcon">{{ item.icon }}</v-icon>
                <span style="font-size: 9px;" @click="item.click" class="ml-1">{{item.name}}</span>
                <input v-model="item.Comparison" @change="onComparisonSelect(item)"
                    style="margin-top: 3px; margin-left: 5px;" type="checkbox" v-if="item.allowComparison" />
                <div @click="item.click" class="ml-1" v-if="item.showChildrenCount" style="display: flex;">
                    <v-icon :color="item.children.length > 0 ? 'red' : 'grey lighten-2'" :size="10">notifications</v-icon>
                    <div style="font-size: 9px;" class="ml-1">({{ item.children.length }})</div>
                </div>
                <v-icon v-for="action in item.actions" :key="action.name" class="ml-1" size="12">{{ action.icon }}
                </v-icon>
            </div>
            <recursive v-if="item.showChildren" style="margin-left: 5px;" :onContextMenu="onContextMenu"
                :items="item.children"></recursive>
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
                    console.log("item.disabled",item.disabled);
                    
                    if (!item.disabled) {
                        item.onSelect();
                    }
                })
            },
            onComparisonSelect(item) {
                let self = this;
                self.$nextTick(() => {
                    item.onComparisonSelect();
                })
            }
        }
    }
</script>

<style>
    .route-item {
        cursor: pointer;
        font-size: 9px;
        display: flex;
    }
</style>