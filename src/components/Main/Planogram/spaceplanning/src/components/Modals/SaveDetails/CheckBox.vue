<template>
    <div class="pa-0 ma-0">
        <v-checkbox v-model="params.data.isDefault" class="pa-0 ma-0" @change="params.context.componentParent.checkBoxChange(params.data)"> </v-checkbox>
        {{params.data.isDefault}}
    </div>
</template>
<script>
    export default {
        data() {

        }
    }
</script>