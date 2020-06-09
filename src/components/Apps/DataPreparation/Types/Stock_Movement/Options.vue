<template>
    <div>
        <a href="#" @click.prevent="removeLine" style="color: red;">Remove</a>
    </div>
</template>

<script>
export default {
    methods: {
        removeLine() {
            let self = this;
            let itemIndex = self.params.context.componentParent.rowData.indexOf(self.params.data);
            self.params.context.componentParent.rowData.splice(itemIndex, 1);
        }
    }
}
</script>