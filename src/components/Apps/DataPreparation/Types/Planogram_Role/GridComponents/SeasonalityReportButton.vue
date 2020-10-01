<template>
    <div style="text-align: center; cursor: pointer;">
        <a href="#" @click.prevent="viewSeasonality">View Seasonality</a>
    </div>
</template>
<script>
    import Axios from 'axios';

    export default {
        methods: {
            viewSeasonality() {
                let item = this.params.data;

                this.params.context.componentParent.getSeasonality(item.planogramID);
            }
        }
    }
</script>