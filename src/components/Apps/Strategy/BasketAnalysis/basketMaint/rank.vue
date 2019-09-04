<template>
    <div style="display: flex;">
         <v-btn class="pa-0 ma-0"  icon
            @click="params.context.componentParent.deleteBasket(params)">
            <v-icon>
                close
            </v-icon>
        </v-btn>
        <v-btn class="pa-0 ma-0" icon v-if="params.data.rank!=0"
            @click="params.context.componentParent.HandleRankUp(params)">
            <v-icon>
                arrow_drop_up
            </v-icon>
        </v-btn>
        <v-btn class="pa-0 ma-0" v-if="params.context.componentParent.data.length!=params.data.rank" icon
            @click="params.context.componentParent.HandleRankDown(params)">
            <v-icon>
                arrow_drop_down
            </v-icon>
        </v-btn>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            }
        },
        methods: {

        }
    }
</script>