<template>
    <div class="spinner">
        <v-dialog v-model="dialog" persistent width="300">
            <v-card>
                <v-card-text style="text-align: center;">
                    <div>
                        <span style="width: 100%">{{ text }}</span>
                    </div>
                    <div style="margin-top: 10px;">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "spinner",
        data() {
            return {
                dialog: false,
                text:""
            }
        },
        methods: {
            show() {
                this.dialog = true;
            },
            hide() {
                this.dialog = false;
            },
            setText(text) {
                this.text = text;
            }
        }
    }
</script>