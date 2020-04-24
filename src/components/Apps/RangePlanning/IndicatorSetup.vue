<template>
    <v-dialog persistent width="500px" v-model="dialog">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>View Setup</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-checkbox :value="option" v-model="options" v-for="option in allOptions" :key="option" :label="option"></v-checkbox>
            </v-card-text>
            <v-divider class="mx-3"></v-divider>
            <v-card-actions class="mx-2">
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false">cancel</v-btn>
                <v-btn @click="submit" color="primary">continue</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                afterReturn: null,
                allOptions: ["YES", "NO", "SELECTED", "SELECT"],
                options: ["YES", "NO"]
            }
        },
        mounted() {},
        methods: {
            show(options, afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.options = options;
                self.dialog = true;
            },
            submit() {
                let self = this;
                self.afterReturn(self.options);
                self.dialog = false;
            }
        }
    }
</script>

<style scoped>
    .inline {
        display: flex;
        border-right: 1px solid grey;
    }

    .inline-item {
        border: 1px solid grey;
        border-bottom: 0px;
        border-right: 0px;
        padding: 3px;
        width: 50%;
    }

    .main {
        background: rgba(0, 128, 0, 0.322);
    }

    .analysis {
        background: rgba(255, 255, 0, 0.315);
    }

    .extended {
        background: rgba(255, 166, 0, 0.349);
    }
</style>