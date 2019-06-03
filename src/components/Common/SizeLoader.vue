<template>
    <v-dialog max-width="800px" persistent v-model="show">
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
                                {{ (currentFileSize/FileTotalSize)*100}}%
                            </div>
                        </v-progress-linear>
                    </v-flex>
                    <v-flex md12>
                        {{text2}}: {{currentFile}}/{{totalFiles}} files
                        <v-progress-linear color="primary" height="20" :value="(currentFile/totalFiles)*100">
                            <div style="color:white; text-align: center">
                                {{currentFile}}/{{totalFiles}}
                            </div>
                        </v-progress-linear>
                    </v-flex>
                    <v-flex md8>

                    </v-flex>
                    <v-flex md4>
                        Current Download Speed:{{DownloadSpeed}} MB/s
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
                text2: "text2",
                currentFileSize: 1.00,
                FileTotalSize: 1.00,
                currentFile: 1.00,
                totalFiles: 1.00,
                DownloadSpeed: 1.00,
                show: false
            }
        },
        methods: {
            open(text1, text2, currentFileSize, FileTotalSize, currentFile, totalFiles, DownloadSpeed) {
                let self = this
                self.show = true
                updateValues(text1, text2, currentFileSize, FileTotalSize, currentFile, totalFiles, DownloadSpeed)
            },
            updateValues(text1, text2, currentFileSize, FileTotalSize, currentFile, totalFiles, DownloadSpeed) {
                let self = this
                self.text1 = text1
                self.text2 = text2
                self.currentFileSize = currentFileSize
                self.FileTotalSize = FileTotalSize
                self.currentFile = currentFile
                self.totalFiles = totalFiles
                self.DownloadSpeed = DownloadSpeed
            },
            close() {
                self.show = false
            }
        }
    }
</script>