<template>
    <div style="cursor: pointer;">
        <div @click="justText = false" v-if="justText">{{ params.data[params.colDef.field.split("_")[0] + "Name"] }}</div>
        <v-autocomplete v-else @change="params.context.componentParent.UpdateLine(params); justText = true" class="pa-0 ma-0"
            :items="params.context.componentParent[params.colDef.dropdownName]" placeholder="type in or select a value"
            v-model="params.data[params.colDef.field]"></v-autocomplete>
    </div>
</template>
<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                justText: true
            }
        },
        methods: {
            
        }
    }
</script>