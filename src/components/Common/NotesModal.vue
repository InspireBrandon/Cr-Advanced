<template>
    <v-dialog v-model="dialog" persistent max-width="600" height="600">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-textarea v-model="notes"></v-textarea>
            </v-card-text>
            <v-card-actions style="text-align: right; display: block;">
                <v-btn color="primary darken-1" @click.native="returnValue">Continue</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                title: '',
                notes: null
            }
        },
        methods: {
            show(title, afterRuturn) {
                let self = this;
                self.title = title;
                self.notes = "";
                self.afterRuturn = afterRuturn;
                self.dialog = true;
            },
            returnValue() {
                let self = this;
                self.afterRuturn(self.notes);
                self.dialog = false;
            }
        }
    }
</script>