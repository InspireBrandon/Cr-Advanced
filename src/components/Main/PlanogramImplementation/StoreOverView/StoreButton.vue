<template>
    <div style="text-align: center; cursor: pointer; display: flex;">
        <div v-if="params.data.planogramStoreStatus==0||params.data.planogramStoreStatus==5||params.data.planogramStoreStatus==7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.assignPlanogramToStore(params)" icon flat
                        small color="primary" class="ma-0">
                        <v-icon>assignment</v-icon>
                    </v-btn>
                </template>
                <span>Assign planogram</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.requiredInStore!=true">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="error" class="ma-0"
                        @click="params.context.componentParent.removeFromStore(params,true,6)">
                        <v-icon>remove_circle_outline</v-icon>
                    </v-btn>
                </template>
                <span>Remove category from store</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.requiredInStore==true">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="success" class="ma-0"
                        @click="params.context.componentParent.removeFromStore(params,false,0)">
                        <v-icon>add</v-icon>
                    </v-btn>
                </template>
                <span>Add Category to store</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=4&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,0,'Store Variation')" icon flat small
                        color="warning" class="ma-0">
                        S
                    </v-btn>
                </template>
                <span>request Store variation</span>
            </v-tooltip>
        </div>
          <div v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=4&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,1,'Model Variation')" icon flat small
                        color="warning" class="ma-0">
                        M
                    </v-btn>
                </template>
                <span>request Model variation</span>
            </v-tooltip>
        </div>
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