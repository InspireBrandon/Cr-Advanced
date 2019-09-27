<template>
    <div v-if="params.data.planogramStoreStatus!=0&&params.data.fileName!=null&&params.data.planogramStoreStatus!=7" style="display: flex;">
        <div v-if="params.context.componentParent.userAccess == 0">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.$parent.$parent.unassignPlanogram(params)"
                        icon flat small color="error" class="ma-0">
                        <v-icon>close</v-icon>
                    </v-btn>
                </template>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.$parent.$parent.unassignPlanogram(params)"
                        icon flat small color="error" class="ma-0">
                        <v-icon>close</v-icon>
                    </v-btn>
                </template>
                <span>Remove Planogram</span>
            </v-tooltip>
        </div>
        <div>
            {{params.data.fileName}}
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            }
        }
    }
</script>