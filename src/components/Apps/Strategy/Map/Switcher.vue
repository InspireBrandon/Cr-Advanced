<template>
    <div>


        <Research ref="Research" />

    </div>
</template>
<script>
    export default {
        components: {
            
        },
        data() {
            return {
                importDialog: false,
                showItem: 0,
                dialogHeader: "",
                viewOnlyMode: false
            };
        },
        mounted() {
            let self = this
            if (self.$route.params.params != null) {
                self.viewOnlyMode = true
            } else {
                self.viewOnlyMode = false
            }
        },
        methods: {

        }
    };
</script>