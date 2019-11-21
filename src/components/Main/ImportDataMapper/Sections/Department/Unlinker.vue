<template>
    <div>
        <a v-if="params.data.systemDepartment_Name != null" href="#" @click.prevent="unlink">unlink</a>
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
                    systemDepartment_ID: null
                }

                self.params.context.componentParent.updateLinkedDepartment(request, () => {
                    self.params.node.setDataValue("systemDepartment_Name", null);
                });
            }
        }
    }
</script>