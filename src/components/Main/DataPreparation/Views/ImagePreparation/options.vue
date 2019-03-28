<template>
    <div style="text-align: center; cursor: pointer;">
        <a href="#" @click.prevent="openEdit">Edit</a>
        <a v-if="params.data.product_System_ID == 'Generate_SYS_Product_ID'" href="#" @click.prevent="updateSysCode"
            style="margin-left: 5px; color: green;">Set System ID</a>
        <a href="#" @click.prevent="deleteProduct" style="margin-left: 5px; color: red;">Delete</a>
    </div>

</template>

<script>
    export default {

        methods: {
            openEdit() {
                let product = this.params;
                this.params.context.componentParent.openEdit(product);
            },
            updateSysCode() {
                let product = this.params;
                this.params.context.componentParent.updateProductSysID(product);
            },
            deleteProduct() {
                let product = this.params;
                this.params.context.componentParent.removeSelected(product);
            }
        }
   
    }
</script>

