<template>
    <div style="text-align: center; cursor: pointer;" class="pa-0 ma-0">
        <v-checkbox @change="onAudit" hide-details color="primary" v-model="params.data.audit" class="ma-0"></v-checkbox>
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    import Axios from 'axios';

    export default {
        components: {
            YesNoModal
        },
        methods: {
            onAudit() {
                let self = this;

                self.$nextTick(() => {
                    self.params.context.componentParent.createStorePlano(self.params.data, () => {

                    })
                })
            }
        }
    }
</script>