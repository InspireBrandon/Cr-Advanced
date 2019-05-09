<template>
    <v-dialog v-model="dialog" width="800px" persistent >
        <v-card color="primary" dark>
            <v-card-text>
                Loading Data
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false
            }
        },
        methods: {
            show() {
                this.dialog = true
            },
            close() {
                this.dialog = false
            }
        }
    }
</script>