<template>
    <div v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=7">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                   @click="params.context.componentParent.unassignPlanogram(params)"
                    icon flat small color="error" class="ma-0">
                    <v-icon>close</v-icon>
                </v-btn>
            </template>
            <span>Remove Planogram</span>
        </v-tooltip>
        {{params.data.fileName}}
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>

