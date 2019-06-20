<template>
    <div style=" cursor: pointer;">
        <!-- <v-btn @click="duplicateLine" class="ma-0" small icon>
            <v-icon color="secondary">file_copy</v-icon>
        </v-btn>
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn> -->
       
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
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
                    @click="params.context.componentParent.$parent.$parent.$parent.$parent.Distribute(params.data)"
                    icon flat small color="success" class="ma-0">
                    <v-icon>send</v-icon>
                </v-btn>
            </template>
            <span>Distribute</span>
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