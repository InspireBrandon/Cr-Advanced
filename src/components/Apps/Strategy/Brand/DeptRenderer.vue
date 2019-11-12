<template>
    <v-layout style="display: flex;width:100%">
        <v-flex v-for="(item,idx) in params.context.componentParent.$parent.level" :key="idx">
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <v-card flat tile :height="35" :color="params.data.ratioARR[idx].color" :min-width="parseFloat( (params.data.ratioARR[idx].value*2)+'%')"
                        v-on="on">

                    </v-card>
                </template>
                <span>{{getToolTip(params.data.ratioARR[idx], params.data.sqm_Shop)}}</span>
            </v-tooltip>
        </v-flex>
    </v-layout>
</template>
<script>
    // style="width=calc((item.value*100)%)"
    export default {
        data() {
            return {}
        },
        methods: {
            getToolTip(item,sqm){
                let self = this;

                return item.name+" "+":"+" "+ (item.value).toFixed(2)+"%"
            }
            
        }
    }
</script>
