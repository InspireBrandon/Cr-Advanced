<template>
    <div style="text-align: center; cursor: pointer;">
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn>
        <!-- <v-btn class="ma-0" small icon>
            <v-icon>delete</v-icon>
        </v-btn> -->
    </div>
</template>
<script>
    export default {
        methods: {
            openEdit() {
                let product = this.params;
                this.params.context.componentParent.openEdit(product);
            },
            removeLine() {
                let self = this;
                self.params.api.updateRowData({
                    remove: [self.params.data]
                })
            }
        }
    }
</script>