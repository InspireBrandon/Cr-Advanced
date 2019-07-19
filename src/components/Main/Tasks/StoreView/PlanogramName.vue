<template>
    <div v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=7">
       
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

