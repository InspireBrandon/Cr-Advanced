<template>
    <div style="text-align: center; cursor: pointer;">
        <v-tooltip bottom v-if="params.data.planogramStoreStatus==0||params.data.planogramStoreStatus==5">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="params.context.componentParent.assignPlanogramToStore(params)" icon flat
                    small color="primary" class="ma-0">
                    <v-icon>assignment</v-icon>
                </v-btn>
            </template>
            <span>Assign planogram</span>
        </v-tooltip>
         <v-tooltip bottom v-if="params.data.requiredInStore!=true &&params.data.fileName!=null">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon flat small color="error" class="ma-0" @click="params.context.componentParent.removeFromStore(params.data,true,6)">
                    <v-icon>remove_circle_outline</v-icon>
                </v-btn>
            </template> 
            <span>Remove category from store</span>
        </v-tooltip>
        <v-tooltip bottom v-if="params.data.requiredInStore==true">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon flat small color="success" class="ma-0" @click="params.context.componentParent.removeFromStore(params.data,false,0)">
                    <v-icon>add</v-icon>
                </v-btn>
            </template>
            <span>Add Category to store</span>
        </v-tooltip>
        <v-tooltip bottom v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6">
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
        methods: {

        },
        created() {
            let self = this;
            self.selectedUser = self.params.context.componentParent.selectedUser;
        }

    }
</script>