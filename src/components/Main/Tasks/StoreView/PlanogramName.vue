<template>
    <div v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              
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

