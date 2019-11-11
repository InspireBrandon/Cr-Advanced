<template>
    <v-layout style="display: flex;width:100%">
        <v-flex v-for="(item,idx) in params.data.ratioARR" :key="idx">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <v-card flat tile :height="35" :color="item.color" :min-width="parseFloat( (item.value*2)+'%')"
                        v-on="on">
                    </v-card>
                </template>
                <span>{{getToolTip(item,params.data.sqm_Shop)}}</span>
            </v-tooltip>
        </v-flex>
    </v-layout>
</template>
<script>
    // style="width=calc((item.value*100)%)"
    export default {
        data() {
            return {}
        },methods:
        {
            // sqm_Shop
            getToolTip(item,sqm){
                return item.name+" "+":"+" "+ (item.value).toFixed(2)+"% of store turnover. \r\n" + " " + " Potential space: "+ ((item.value/100)*sqm).toFixed(0) + "(meters squared) of total store space"
            }
            
        }
    }
</script>
