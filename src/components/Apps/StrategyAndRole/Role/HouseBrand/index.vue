<template>
    <v-dialog v-model="dialog" width="500" fullscreen>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                Click Me
            </v-btn>
        </template>

        <v-card>
            <v-toolbar>

            </v-toolbar>

            <v-card-text>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                    I accept
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
            }
        },
    }
</script>