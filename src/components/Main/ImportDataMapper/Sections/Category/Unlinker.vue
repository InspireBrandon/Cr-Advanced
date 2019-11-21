<template>
    <div>
        <a v-if="params.data.systemCategory_Name != null" href="#" @click.prevent="unlink">unlink</a>
    </div>
</template>

<script>
    export default {
        mounted() {
            let self = this;
        },
        data() {
            return {
                draggingIn: false
            }
        },
        methods: {
            unlink() {
                let self = this;

                let request = {
                    id: self.params.data.id,
                    name: self.params.data.name,
                    systemCategory_ID: null
                }

                self.params.context.componentParent.updateLinkedCategory(request, () => {
                    self.params.node.setDataValue("systemCategory_Name", null);
                });
            }
        }
    }
</script>