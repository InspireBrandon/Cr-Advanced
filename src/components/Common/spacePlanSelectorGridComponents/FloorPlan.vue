<template>
    <v-checkbox class="pa-0 ma-0" label="Floor Plan" @change="setFloorPlan(params.data)" v-model="params.data.floorplan" hide-details color="primary"></v-checkbox>
</template>
<script>
    export default {
        methods: {
            setFloorPlan(data) {
                let self = this
                self.params.context.componentParent.setFloorPlan(data)
            }
        }
    }
</script>