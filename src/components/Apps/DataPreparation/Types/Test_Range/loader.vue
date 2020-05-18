<template>
    <div>
        <v-dialog v-model="dialog" persistent scrollable width="500">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Loading Test Range Data</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-progress-linear :value="value" height="15" :indeterminate="indeterminate"></v-progress-linear>
                    <div style="text-align: right; font-size: 15px;">
                        <div v-if="indeterminate">Waiting for server response</div>
                        <div v-else>Loading: {{ current }} out of {{ total }}</div>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                indeterminate: false,
                current: 0,
                total: 0,
                value: 10
            };
        },
        mounted() {
            let self = this;
        },
        methods: {
            show() {
                let self = this;
                self.indeterminate = true;
                self.dialog = true;
            },
            update(current, total) {
                let self = this;
                self.indeterminate = false;
                self.current = current;
                self.total = total;
                var value = (current / total) * 100;
                self.value = value;
            },
            hide() {
                let self = this;

                setTimeout(() => {
                    self.value = 0;
                    self.dialog = false;
                }, 2000);
            }
        }
    };
</script>