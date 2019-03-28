<template>
    <div style="text-align: center; cursor: pointer;">
        <a href="#" @click.prevent="openEdit">Edit</a>
    </div>
</template>
<script>
    export default {
        methods: {
            openEdit() {
                let product = this.params;
                this.params.context.componentParent.openEdit(product);
            }

        }
    }
</script>