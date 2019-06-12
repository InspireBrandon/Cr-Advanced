<template>
    <div>
        {{ params.context.componentParent.typeList[params.data.type == -1 ? 5 : params.data.type].text }}
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