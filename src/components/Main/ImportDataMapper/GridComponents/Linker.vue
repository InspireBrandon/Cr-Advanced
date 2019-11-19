<template>
    <div @dragover="allowDrop" @drop="dropDragItem">
        <div class="font-weight-light" v-if="params.data.linkedTo == null && !draggingIn">Drag a system value here to
            link or double click to search...</div>
        <div v-if="params.data.linkedTo != null && !draggingIn">{{ params.data.linkedTo }}</div>
        <div v-if="draggingIn == true">Release to drop here</div>
    </div>
</template>

<script>
    export default {
        mounted() {
            let self = this;
        },
        data() {
            return {
                draggingIn: false
            }
        },
        methods: {
            allowDrop(ev) {
                ev.preventDefault();
            },
            dropDragItem(ev) {
                ev.preventDefault();
                let self = this;
                self.params.node.setDataValue("linkedTo", window.dragStore.name);
            }
        }
    }
</script>