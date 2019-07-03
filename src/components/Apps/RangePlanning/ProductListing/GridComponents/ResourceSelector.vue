<template>
    <div style="text-align: center; cursor: pointer;">

        <v-select class="pa-0 ma-0" v-model="params.data[params.colDef.field]"
            :items="params.context.componentParent[params.colDef.dropdownName]" label="Select"></v-select>
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