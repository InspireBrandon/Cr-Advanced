<template>
    <div >
        <v-btn icon v-if="params.data.rank!=1" @click="params.context.componentParent.HandleRankUp(params)">
            <v-icon>
                arrow_drop_up
            </v-icon>
        </v-btn>
        <v-btn v-if="params.context.componentParent.data.length!=params.data.rank" icon @click="params.context.componentParent.HandleRankDown(params)">
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