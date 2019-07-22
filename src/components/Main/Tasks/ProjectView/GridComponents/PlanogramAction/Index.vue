<template>
    <div v-if="params.data != undefined">
        <Variation v-if="params.data.spacePlanStatus == 14" />
        <General v-else />
    </div>
</template>

<script>
    import General from './General.vue'
    import Variation from './Variation.vue'

    export default {
        components: { Variation, General },
        created() {
        }
    }
</script>