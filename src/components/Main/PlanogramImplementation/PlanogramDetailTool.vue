<template>
    <v-card>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md6>
                    <v-btn color="primary" dark>
                        start
                    </v-btn>
                </v-flex>
                <v-flex md6>
                </v-flex>
                <v-flex md6>
                    <v-btn color="primary" dark @click="selectSingle">
                        single
                    </v-btn>
                </v-flex>
                <v-flex md6>
                </v-flex>
                <v-flex md6>
                    <v-btn color="primary" dark @click="getAllSpacePlans">
                        All
                    </v-btn>
                </v-flex>
                <v-flex md6>
                </v-flex>
                <v-flex md8>
                    <v-card>
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>
                                Planogram Details
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-list>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Planogram Details
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn>update</v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Planogram Details
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn>update</v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>
                <v-flex md4>
                    <v-card>
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>
                                Updating Plannogram Details
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md12>
                                    <h1>{Planogram name}</h1>
                                </v-flex>
                                <v-flex md12>
                                    DownLoadingFile: {30/100}mb
                                    <v-progress-linear color="primary" height="20" value="30">
                                        <div style="color:white">
                                            { 30/100mb}
                                        </div>
                                    </v-progress-linear>
                                </v-flex>

                                <v-flex md12>
                                    Files Complete: {4/10} files
                                    <v-progress-linear color="primary" height="20" value="30">
                                        <div style="color:white">
                                            {4/10}
                                        </div>
                                    </v-progress-linear>
                                </v-flex>
                            </v-layout>
                        </v-container>


                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <SpacePlanSelector ref="SpacePlanSelector" />

    </v-card>
</template>

<script>
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector'
    import Axios from 'axios'
    export default {
        components: {
            SpacePlanSelector

        },
        data() {
            return {
                spacePlans:[],
            }

        },
        methods: {
            selectSingle() {
                let self = this
                self.$refs.SpacePlanSelector.show(data => {

                })
            },
            getAllSpacePlans() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Planogram_Details').then(res => {
                    console.log("res");
                    console.log(res);
                    res.data.planogram_DetailsList.forEach(element => {
                        element.systemFileID = element.fileID
                        self.spacePlans.push(element)
                    });
                    //  self.items=res.data.planogram_DetailsList

                    delete Axios.defaults.headers.common["TenantID"];

                })
            }
        }

    }
</script>