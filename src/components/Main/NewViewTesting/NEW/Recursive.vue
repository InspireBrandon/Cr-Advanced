<template>
    <div>
        <div v-for="(item, idx) in items" :key="idx">
            <div @click="item.click" class="route-item">
                <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary"></v-progress-circular>
                <v-icon :size="12" v-if="!item.loading">{{ item.icon }}</v-icon>
                <span class="ml-2">{{item.name}}</span>
                <span class="ml-2" v-if="item.showChildrenCount">({{ item.children.length }})</span>
            </div>
            <recursive v-if="item.showChildren" style="margin-left: 15px;" :items="item.children"></recursive>
        </div>
    </div>
</template>

<script>
export default {
    props: ['items'],
    name: 'recursive'
}
</script>

<style>
    .route-item {
        cursor: pointer;
        font-size: 12px;
    }
</style>