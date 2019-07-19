<template>
    <div style="text-align: center; cursor: pointer; display: flex;">
         <!-- log to be added -->
        <div>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="success" class="ma-0">
                        <v-icon>visibility</v-icon>
                    </v-btn>
                </template>
                <span>view</span>
            </v-tooltip>
        </div>
        <div
            v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=4&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,0,'Store Variation')" icon
                        flat small color="warning" class="ma-0">
                        S
                    </v-btn>
                </template>
                <span>request Store variation</span>
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