<template>
    <v-dialog v-model="dailog" persistent fullscreen>
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>
                    Basket Maintenance
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
        </v-card>


        <grid ref="grid"/>
    </v-dialog>
</template>
<script>
    import grid from "./Grid.vue"
    export default {
        components: {
            grid
        },
        data() {
            return {
                dialog: false,
                callback: null,
            }
        },
        methods: {
            open(callback) {
                let self = this
                self.callback = callback
            },
            submit() {},

        }

    }
</script>