<template>
    <div style="text-align: center; cursor: pointer;">
        <a href="#">Edit</a>
        <a href="#" @click.prevent="duplicateLine" style="margin-left: 15px;">Duplicate</a>
        <a href="#" @click.prevent="removeLine" style="color: red; margin-left: 15px;">Delete</a>
        <YesNoModal ref="yesNo"></YesNoModal>
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        components: {
            YesNoModal
        },
        methods: {
            openEdit() {
                let product = this.params;
                this.params.context.componentParent.openEdit(product);
            },
            duplicateLine() {
                let self = this;
                self.params.api.updateRowData({
                    add: [JSON.parse(JSON.stringify(self.params.data))]
                })
            },
            removeLine() {
                let self = this;
                self.$refs.yesNo.show('Delete this line?', goThrough => {
                    if (goThrough) {
                        self.params.api.updateRowData({
                            remove: [self.params.data]
                        })
                    }
                })
            }
        }
    }
</script>