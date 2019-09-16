<template>
    <div>
        <v-card @click="selectColor" style="height: 200px;" :color="color">
            <v-card-text>
                click to change
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                color: "#eee"
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.afterRuturn = afterRuturn;
                self.dialog = true;
            },
            selectColor() {
                let self = this;
                self.$refs.colorPicker.click();
            },
            colorChange() {
                let self = this;
            },
            returnText() {
                let self = this;
                self.afterRuturn(self.text);
                self.dialog = false;
            }
        }
    }
</script>