<template>
    <div style=" cursor: pointer;">
        <v-tooltip bottom v-if="params.data.requiredInStore!=true &&params.data.fileName!=null">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon flat small color="error" class="ma-0" @click="params.context.componentParent.removeFromStore(params.data,true)">
                    <v-icon>remove_circle_outline</v-icon>
                </v-btn>
            </template> 
            <span>Remove category from store</span>
        </v-tooltip>
        <v-tooltip bottom v-if="params.data.requiredInStore==true &&params.data.fileName!=null">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon flat small color="success" class="ma-0" @click="params.context.componentParent.removeFromStore(params.data,false)">
                    <v-icon>add</v-icon>
                </v-btn>
            </template>
            <span>Add Category to store</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }" v-if="params.data.planogramStoreStatus==0">
                <v-btn v-on="on"
                    @click="params.context.componentParent.$parent.$parent.$parent.$parent.assignPlanogramToStore(params.data)"
                    icon flat small color="primary" class="ma-0">
                    <v-icon>assignment</v-icon>
                </v-btn>
            </template>
            <span>Assign planogram</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"
                    @click="params.context.componentParent.$parent.$parent.$parent.$parent.$refs.StorePlanograms.show(params.data)"
                    class="ma-0">
                    <v-icon>
                        store
                    </v-icon>
                </v-btn>
            </template>
            <span>Store overview</span>
        </v-tooltip>
        <v-tooltip bottom v-if="params.data.planogramStoreStatus==1">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                    @click="params.context.componentParent.$parent.$parent.$parent.$parent.Distribute(params.data)" icon
                    flat small color="success" class="ma-0">
                    <v-icon>send</v-icon>
                </v-btn>
            </template>
            <span>Distribute</span>
        </v-tooltip>
        <v-tooltip bottom v-if="params.data.planogramStoreStatus!=0">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="params.context.componentParent.openOrder(params.data)" icon flat small
                    color="warning" class="ma-0">
                    <v-icon>edit_attributes</v-icon>
                </v-btn>
            </template>
            <span>request variation</span>
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