<template>
    <div>
        <div>
            <div class="route-item">
                <v-icon>folder</v-icon>
                <span class="ml-1">My Files</span>
            </div>
            <div class="route-item">
                <v-icon>folder</v-icon>
                <span class="ml-1">Shared Files</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'recursive',
        methods: {
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