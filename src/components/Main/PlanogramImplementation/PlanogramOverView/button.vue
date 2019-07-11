<template>
    <div style=" cursor: pointer; display:flex;">
        <div>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"
                     @click="params.context.componentParent.$parent.$parent.showStore(params.data)"
                        class="ma-0">
                        <v-icon>
                            store
                        </v-icon>
                    </v-btn>
                </template>
                <span>Store overview</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.requiredInStore==true">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="success" class="ma-0"
                        @click="params.context.componentParent.removeFromStore(params ,false,0)">
                        <v-icon>add</v-icon>
                    </v-btn>
                </template>
                <span>Add Category to store</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.planogramStoreStatus==0||params.data.planogramStoreStatus==5||params.data.planogramStoreStatus==7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on"
                        @click="params.context.componentParent.$parent.$parent.assignPlanogramToStore(params)"
                        icon flat small color="primary" class="ma-0">
                        <v-icon>assignment</v-icon>
                    </v-btn>
                </template>
                <span>Assign planogram</span>
            </v-tooltip>
        </div>

        <div v-if="params.data.planogramStoreStatus==1">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on"
                        @click="params.context.componentParent.$parent.$parent.Distribute(params)" icon
                        flat small color="success" class="ma-0">
                        <v-icon>send</v-icon>
                    </v-btn>
                </template>
                <span>Distribute</span>
            </v-tooltip>
        </div>
        
        <div
            v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=5&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,1)" icon flat small
                        color="warning" class="ma-0">
                        <v-icon>edit_attributes</v-icon>
                    </v-btn>
                </template>
                <span>request model variation</span>
            </v-tooltip>
        </div>
          
        <div
            v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=5&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,0)" icon flat small
                        color="warning" class="ma-0">
                        <v-icon>edit_attributes</v-icon>
                    </v-btn>
                </template>
                <span>request store variation</span>
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
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    export default {
        components: {
            YesNoModal
        },
        methods: {
            log(data){
console.log(data);

            }
        },
        created() {
            let self = this;
            self.selectedUser = self.params.context.componentParent.selectedUser;
        }

        //   
    }
</script>