<template>
    <v-dialog v-model="dialog" persistent width="1000px">
        <v-toolbar color="primary" dark>
            <v-toolbar-title>
                Add Tile
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="dialog=false" icon>
                <v-icon>
                    close
                </v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-list>
                    <div v-for="(item,idx) in widgets" :key="idx">
                        <v-list-tile @click="selected=item" :class="{ 'highlighted': selected == item  }">
                            {{item.Name}}
                        </v-list-tile>
                        <v-divider></v-divider>
                    </div>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer>
                </v-spacer>
                <v-btn @click="dialog=false" color="error"> cancel</v-btn>
                <v-btn color="primary" @click="submit"> submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                config: null,
                squareIndex: null,
                selected: null,
                widgets: [{
                        Name: "Table",
                        Key: "TestWidget"
                    },
                    {
                        Name: "Graph",
                        Key: "Graph"
                    },{
                        Name: "PowerBI",
                        Key: "PowerBI"
                    }
                ],
            }
        },
        methods: {
            open(callback) {
                let self = this
                self.callback = callback
                self.dialog = true
            },
            submit() {
                let self = this
                self.dialog = false

                self.callback(self.selected)
            },
        }

    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>