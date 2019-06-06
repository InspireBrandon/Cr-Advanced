<template>
    <v-dialog max-width="800px" persistent v-model="dialog">
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>
                    Loading Data
                </v-toolbar-title>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>

                    <v-flex md12>
                        {{text1}}: {{currentFileSize.toFixed(2)}} MB / {{FileTotalSize.toFixed(2)}} MB
                        <v-progress-linear color="primary" height="20" :value="(currentFileSize/FileTotalSize)*100">
                            <div style="color:white;  text-align: center;">
                                {{ ((currentFileSize/FileTotalSize)*100).toFixed(0)}}%
                            </div>
                        </v-progress-linear>
                    </v-flex>
                    <v-flex md12>
                        <div v-if="text2!=null">
                        {{text2}}: {{currentFile}}/{{totalFiles}} files
                        </div>
                        <v-progress-linear v-if="currentFile!=null" color="primary" height="20" :value="((currentFile/totalFiles)*100)+progress">
                            <div style="color:white; text-align: center">
                                {{currentFile}}/{{totalFiles}}
                            </div>
                        </v-progress-linear>
                    </v-flex>
                    <v-flex md8>

                    </v-flex>
                    <v-flex md4>
                        Current Download Speed:{{DownloadSpeed.toFixed(2)}} MB/s
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: [],
        data() {
            return {
                text1: "text1",
                text2: null,
                currentFileSize: 0,
                FileTotalSize: 0,
                currentFile: null,
                totalFiles: 0,
                DownloadSpeed: 0,
                dialog: false,
                progress:0
            }
        },
        methods: {
            show() {
                let self = this
                self.dialog = true
               
            },
            updateLoader(data) {
                let self = this

                for(var prop in data) {
                    self[prop] = data[prop]
                }
            },
            close() {
                let self= this

                self.dialog = false
            }
        }
    }
</script>