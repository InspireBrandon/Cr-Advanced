<template>
    <div>
        <a v-if="params.data.systemBrand_Name != null" href="#" @click.prevent="unlink">unlink</a>
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
                    systemBrand_ID: null
                }

                self.params.context.componentParent.updateLinkedBrand(request, () => {
                    self.params.node.setDataValue("systemBrand_Name", null);
                });
            }
        }
    }
</script>