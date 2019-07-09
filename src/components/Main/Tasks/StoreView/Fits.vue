<template>
     <div>
     <v-icon color="error" v-if="params.data.fits==true&&params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6">
         close
     </v-icon>
      <v-icon color="success" v-if="params.data.fits==false&&params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=6">
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

