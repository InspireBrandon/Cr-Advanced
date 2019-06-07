<template>
    <div style="text-align: center; cursor: pointer;">
        <v-btn @click="duplicateLine" class="ma-0" small icon>
            <v-icon color="secondary">file_copy</v-icon>
        </v-btn>
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn>
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
                    add: [self.params.data]
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