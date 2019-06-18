<template>
    <div style="text-align: center; cursor: pointer;">
         <!-- <v-btn @click="duplicateLine" class="ma-0" small icon>
            <v-icon color="secondary">file_copy</v-icon>
        </v-btn>
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn> -->
        <v-btn @click="params.context.componentParent.assignPlanogramToStore(params.data)" icon flat small color="primary" class="ma-0">
            <v-icon>assignment</v-icon>
        </v-btn>
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