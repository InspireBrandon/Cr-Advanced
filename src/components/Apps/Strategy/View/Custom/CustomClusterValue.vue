<template>
    <div>{{ getCustomClusterValue() }}</div>
</template>

<script>
export default {
    methods: {
        getCustomClusterValue(storeID) {
            let self = this;

            let customSystemClusters = self.params.context.componentParent.customSystemClusters;

            return customSystemClusters.find(e => {
                return e.store == self.params.data.displayname
            }).customCluster
        }
    }
}
</script>