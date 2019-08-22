<template>
    <div>
        <!-- <v-progress-linear v-model="params.data.percent"> -->
        <v-progress-linear :value="params.data.cumulativProductSales">

        </v-progress-linear>


    </div>
</template>
<script>
    export default {
        data() {
            return {}
        }
    }
</script>