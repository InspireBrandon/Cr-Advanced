<template>
    <div @dblclick="toggleConsigment" style="text-align: center; cursor: pointer;">
        <span>{{ params.data.consignment }}</span>
    </div>
</template>
<script>

    export default {
        methods: {
            toggleConsigment() {
                let self = this;

                let node = self.params.node;

                node.setData({ consignment: self.params.data.consignment == "FIXED" ? "CONSIGNMENT": "FIXED" });
            }
        }
    }
</script>