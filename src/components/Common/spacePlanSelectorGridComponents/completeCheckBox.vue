<template>
    <v-checkbox class="pa-0 ma-0" label="Complete" @change="setComplete(params.data)" v-model="params.data.complete"
        hide-details color="primary"></v-checkbox>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    export default {
        components: {
            YesNoModal
        },
        data() {
            return {
                selectedDelete: null,
            }
        },
        methods: {
            setCanDistribute(data) {
                let self = this
                self.params.context.componentParent.setCanDistribute(data)
            },
            setComplete(data) {
                let self = this
                self.params.context.componentParent.setComplete(data)
            },
            addRemove(data) {
                let self = this
                self.params.context.componentParent.assignToGroup(data)

                // if (self.selected == false) {

                // } else {
                //     self.params.context.componentParent.componentParentremoveFromGroup(data)
                // }
            }
        },
        created() {
            let self = this;
            // self.selectedUser = self.params.context.componentParent.selectedUser;
        }
    }
</script>