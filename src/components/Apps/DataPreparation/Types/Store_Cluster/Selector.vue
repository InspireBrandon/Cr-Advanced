<template>
    <div style="text-align: center; cursor: pointer;">
        <!-- <v-autocomplete @change="params.context.componentParent.saveOnChange" class="pa-0 ma-0" :items="params.context.componentParent.Category_Link"
            v-model="params.data.Category_Link"></v-autocomplete> -->
        <v-autocomplete class="pa-0 ma-0" :items="params.context.componentParent.Category_Link"></v-autocomplete>
    </div>
</template>
<script>
    import Axios from 'axios';

    export default {
        data() {
            return {}
        },
        methods: {

        },
        created() {

        }
    }
</script>