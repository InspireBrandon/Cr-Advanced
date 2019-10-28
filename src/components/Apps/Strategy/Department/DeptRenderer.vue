<template>
    <div style="display: flex;width:100%">
        <div v-for="(item,idx) in params.data.ratioARR" :key="idx" >
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <v-card flat tile :height="35" :color="item.color"  :width="item.value*200"  v-on="on" >
                     
                    </v-card>
                </template>
                <span>{{ item.name }} : {{(item.value*100).toFixed(2)}}%</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
// style="width=calc((item.value*100)%)"
    export default {
        data() {
            return {}
        }
    }
</script>
<style>

</style>
