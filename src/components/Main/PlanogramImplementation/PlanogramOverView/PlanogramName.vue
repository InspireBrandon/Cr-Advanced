<template>
    <div v-if="params.data.planogramStoreStatus!=0&&params.data.fileName!=null">
        <v-tooltip bottom >
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                   @click="params.context.componentParent.$parent.$parent.$parent.$parent.unassignPlanogram(params)"
                    icon flat small color="error" class="ma-0">
                    <v-icon>close</v-icon>
                </v-btn>
            </template>
            <span>Remove Planogram</span>
        </v-tooltip>
        {{params.data.fileName}} |||{{params.data.planogramStoreStatus}}
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

