<template>
    <div>
        <v-tooltip bottom v-if="params.data.planogramStoreStatus==1">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                   @click="params.context.componentParent.$parent.$parent.$parent.$parent.unassignPlanogram(params.data)"
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

