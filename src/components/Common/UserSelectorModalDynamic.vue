<template>
    <v-dialog v-model="dialog" persistent width="400" height="800">
        <v-toolbar dark color="primary">
            <v-toolbar-title>
                {{title}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn> -->
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-autocomplete :items="items" v-model="selected" label="select a user">
                </v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <!-- <v-btn color="error" @click="dialog=false">cancel</v-btn> -->
                <v-btn color=" primary" @click="submit">submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {

        data() {
            return {
                dialog: false,
                title: "",
                items: [],
                selected: null,
                callback: null
            }
        },
        methods: {
            open(title, items, callback) {
                let self = this
                self.title = title
                self.items = items
                self.callback = callback
                self.dialog=true
            },
            submit() {
                if (self.selected != null) {
                    self.callback(self.selected)
                }
            }
        }
    }
</script>