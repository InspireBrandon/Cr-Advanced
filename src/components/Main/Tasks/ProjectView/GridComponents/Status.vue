<template>
    <div>
        {{ params.context.componentParent.statusList[params.data.status == -1 ? 18 : params.data.status].text }}
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