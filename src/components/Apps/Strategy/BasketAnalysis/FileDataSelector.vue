<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Basket Reports</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text style="height: 300px; overflow: auto;">
                <v-list>
                    <template v-for="(item, idx) in fileData">
                        <v-list-tile @click="selected = item" :class="{ 'highlighted': selected == item  }" :key="idx">{{ item.name }}</v-list-tile>
                        <v-divider :key="idx + 'd'"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="returnData">
                    Continue
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
                fileData: [],
                afterReturn: null,
                selected: null
            }
        },
        methods: {
            save() {
                let self = this;
            },
            show(fileData, afterReturn) {
                let self = this;
                self.fileData = fileData;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            returnData() {
                let self = this;
                self.dialog = false;
                console.log(self.selected);
                
                self.afterReturn(self.selected);
            }
        }
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>