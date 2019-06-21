<template>
    <div style="text-align: center; cursor: pointer;">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="params.context.componentParent.assignPlanogramToStore(params.data)" icon flat
                    small color="primary" class="ma-0">
                    <v-icon>assignment</v-icon>
                </v-btn>
            </template>
            <span>Assign planogram</span>
        </v-tooltip>
         <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"  @click="params.context.componentParent.UpdateLine(params.data)" icon flat
                    small color="error" class="ma-0">
                    <v-icon>remove_circle_outline</v-icon>
                </v-btn>
            </template>
            <span>Remove category from store</span>
        </v-tooltip>
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    export default {
        components: {
            YesNoModal
        },
        methods: {},
        created() {
            let self = this;
            self.selectedUser = self.params.context.componentParent.selectedUser;
        }
    }
</script>