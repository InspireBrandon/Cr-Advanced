<template>
    <div style="text-align: center; cursor: pointer;">
        <v-autocomplete @change="params.context.componentParent.UpdateLine(params)" class="pa-0 ma-0"
            :items="params.context.componentParent[params.colDef.dropdownName]" placeholder="type in or select a value"
            v-model="params.data[params.colDef.field]"></v-autocomplete>
    </div>
</template>
<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
            }
        },
        methods: {
            
        }
    }
</script>