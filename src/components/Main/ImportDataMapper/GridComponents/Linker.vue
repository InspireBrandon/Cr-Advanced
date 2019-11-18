<template>
    <div @dragenter="onDrag" @dragover="onDrag" @dragend="onDragEnd" @dragleave="onDragEnd" @drop="onDrop">
        <div class="font-weight-light" v-if="params.data.linkedTo == null && !draggingIn">Drag a system value here to link or double click to search...</div>
        <div v-if="params.data.linkedTo != null && !draggingIn"></div>
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
        onDrag() {
            let self = this;
            console.log(window.dragStore)
            self.draggingIn = true;
        },
        onDrop() {
            let self = this;
            console.log("dropped")
        },
        onDragEnd() {
            let self = this;
            self.draggingIn = false;
        }
    }
}
</script>