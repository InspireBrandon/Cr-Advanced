<template>
    <div>
        <SimpleList :hasCode="true" name="Manufacturer"></SimpleList>
    </div>
</template>

<script>
    import SimpleList from '@/components/Apps/DataPreparation/Common/SimpleList.vue'

    export default {
        components: {
            SimpleList
        }
    }
</script>
