<template>
    <div @dragover="allowDrop" @drop="dropDragItem">
        <div class="font-weight-light" v-if="params.data.systemDepartment_Name == null && !draggingIn">Drag a system value here to
            link...</div>
        <div v-if="params.data.systemDepartment_Name != null && !draggingIn">{{ params.data.systemDepartment_Name }}</div>
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

                let systemItem = window.dragStore;

                let request = {
                    id: self.params.data.id,
                    name: self.params.data.name,
                    systemDepartment_ID: systemItem.id,
                }

                self.params.context.componentParent.updateLinkedDepartment(request, () => {
                    self.params.node.setDataValue("systemDepartment_Name", systemItem.name);
                });
            }
        }
    }
</script>