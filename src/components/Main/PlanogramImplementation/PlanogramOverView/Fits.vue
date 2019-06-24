<template>
     <div>
     <v-icon color="error" v-if="params.data.fits==1&&params.data.planogramStoreStatus!=0">
         close
     </v-icon>
      <v-icon color="success" v-if="params.data.fits==0&&params.data.planogramStoreStatus!=0">
         done
     </v-icon>
     </div>
</template>
<script>
export default {
    data(){

    }
}
</script>

