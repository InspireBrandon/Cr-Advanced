<template>
    <div style="text-align: center; cursor: pointer;">
        <v-autocomplete @change="params.context.componentParent.saveOnChange" class="pa-0 ma-0" :items="params.context.componentParent.store_Cluster"
            v-model="params.data.storeCluster_ID"></v-autocomplete>
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

        },
        created() {
            console.log(this.params.data.storeCluster_ID)
        }
    }
</script>