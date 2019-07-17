<template>
    <div>
        {{ params.context.componentParent.statusList[params.data[params.colDef.field] == -1 ? 18 : params.data[params.colDef.field]].text }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                systemUserID: -1,
            }
        },
        methods: {},
        created() {
            let self = this;
        }
    }
</script>