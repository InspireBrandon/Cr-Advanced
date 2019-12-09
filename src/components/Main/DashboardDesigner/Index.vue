<template>
    <div>
        <v-toolbar dark dense flat>
            <v-toolbar-title>
                Dashboard Designer
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark dense flat color="grey darken-3">
            <v-btn color="primary" @click="openEditModal">
                add tile
            </v-btn>
            <v-btn color="primary" @click="saveDashboard()">
                save dashboard
            </v-btn>
        </v-toolbar>

        <v-card width="100%" height="100%" class="report-main " @dragover.prevent @drop="dragFinish($event)"
            @dblclick="addWidget('Graph')">
            <grid-layout style="width:100%;height:100%" :layout.sync="Layout" :col-num="12" :row-height="30"
                :auto-size="true" :is-draggable="true" :is-resizable="true" :is-mirrored="false"
                :vertical-compact="true" :margin="[5, 5]" :use-css-transforms="true">
                <grid-item class="grid-item" v-for="(item, idx) in ReportItems" :x="item.ReportLayout.x"
                    :y="item.ReportLayout.y" :w="item.ReportLayout.w" :h="item.ReportLayout.h" :i="item.ReportLayout.i"
                    :key="item.ReportLayout.i">
                    <v-flex no-gutters class="fill-height" align="center" justify="center">
                        <v-card class="fill-height" height="100%" width="100%">
                            <v-toolbar dense>
                                {{item.Name}}
                                <v-spacer></v-spacer>
                                <v-btn icon color="red">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <ReportLoader :ReportData="item" :key="idx" :id="idx"
                                style="height: calc(100% - 48px) !important;" />
                        </v-card>
                    </v-flex>
                </grid-item>
            </grid-layout>
        </v-card>



        <!-- <ReportCreate ref="ReportCreate"/> -->

        <ComponentEditorModal ref="ComponentEditorModal" />
        <PowerBIConfigModal ref="PowerBIConfigModal" />
        <!-- <v-flex  v-for="(item,idx) in components" :key="idx">
                    <component v-bind:is="item.name" @click.native="openEditModal(item,idx)" :props="item"></component>

                </v-flex> -->
    </div>

</template>
<script>
    // components
    import ComponentEditorModal from "./ComponentEditorModal"
    import PowerBIConfigModal from "./PowerBIConfigModal"

    // classes
    import editComponentConfig from "./components/editComponentConfig"
    // dashboard editor
    import VueGridLayout from 'vue-grid-layout';
    import ReportLoader from "./DashboardEditor/report-loader";


    export default {
        components: {
            ComponentEditorModal,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem,
            ReportLoader,
            PowerBIConfigModal

        },
        data() {
            return {
                rows: 2,
                columns: 2,
                components: [],
                componentConfig: {
                    type: 1,
                    name: "EditComponents",
                    height: '250px'
                },
                tempKey: "TestWidget",
                ReportItems: [],
                Layout: [],
                widgets: [{
                        Name: "Table",
                        Key: "TestWidget"
                    },
                    {
                        Name: "Graph",
                        Key: "Graph"
                    }
                ],
                draggedItem: null,
                showWidgets: true

            }
        },
        mounted() {
            this.generateGrid()
        },
        methods: {
            generateGrid() {
                let self = this
                for (let index = 0; index < 12; index++) {
                    let item = new editComponentConfig({
                        type: 1,
                        name: "EditComponents",
                        height: '250px',
                        width: '250px'
                    })
                    self.components.push(item)
                }
            },
            dragFinish(ev) {
                let self = this;
                let firstItem = self.ReportItems.length == 0 ? true : false;
                let x = 0;
                let y = 0;
                let w = 2;
                let h = 10;

                if (firstItem == false) {
                    let found = false;
                    let lastY = 0;
                    x = (self.ReportItems.length * w) % 12;
                    y = self.SortedList[0].ReportLayout.y;
                }
                var obj = Object.assign({}, self.draggedItem);

                obj.key = self.draggedItem.Key;
                // var prevLayout = self.ReportItems[i - 1].ReportLayout;

                let layout = {
                    x: x,
                    y: y,
                    w: w,
                    h: h,
                    i: self.guid()
                };

                obj.ReportLayout = layout;
                self.Layout.push(layout);
                self.ReportItems.push(obj);
                //   self.widgets.splice(self.widgets.indexOf(self.draggedItem), 1);
            },
            saveDashboard() {
                let self = this;

                let retVal = [];

                self.ReportItems.forEach(element => {
                    var objToPush = Object.assign({}, element);

                    objToPush.ReportLayout = JSON.stringify(element.ReportLayout);

                    retVal.push(objToPush);
                });

                let request = {
                    ID: null,
                    Name: "",
                    Widgets: retVal
                };

                console.log("request", self.ReportItems);

                // self.post("Tenant/ReportDashboard", request).then(r => {
                //   self.$router.push("/Reports");
                // });
            },
            guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return (
                    s4() +
                    s4() +
                    "-" +
                    s4() +
                    "-" +
                    s4() +
                    "-" +
                    s4() +
                    "-" +
                    s4() +
                    s4() +
                    s4()
                );
            },
            addWidget(key, config) {
                let self = this;
                let firstItem = self.ReportItems.length == 0 ? true : false;
                let x = 0;
                let y = 0;

                if (firstItem == false) {
                    let itemsSorted = self.ReportItems.sort((a, b) => (a.x - b.x) && (a.y - b.y));
                    console.log("SORT", itemsSorted)
                }

                let item = {
                    x: x,
                    y: y,
                    w: 2,
                    h: 10,
                    i: self.guid()
                };
                if(config==null){
                    config={
                        text:null,
                        value:null,
                    }
                }
                self.ReportItems.push({
                    ReportLayout: item,
                    key: key,
                    text: config.text,
                    value:config.value
                });
                self.Layout.push(item);
            },
            openConfigModal(item, callback) {
                let self = this
                self.$refs.PowerBIConfigModal.open(config => {
                    callback(config)
                })
            },
            openEditModal() {
                let self = this
                self.$refs.ComponentEditorModal.open(callback => {
                    if (callback.Key == "PowerBI") {
                        self.openConfigModal(callback, config => {
                            self.addWidget(callback.Key, config)
                        })
                    } else {
                        self.addWidget(callback.Key)
                    }
                })

            }
        }
    }
</script>

<style lang="css" scoped>
    .widget-container {
        position: fixed;
        height: 150px;
        width: 100%;
        bottom: 0;
        /* box-shadow: 0px -1px 20px #888; */
    }

    .grid-item {
        border: 1px dotted;
        background: lightgrey;
    }

    .job-card-slider {
        height: 100%;
        align-items: flex-end;
        display: flex;
        width: calc(100% - 52px);
        overflow: hidden;
        scroll-behavior: smooth;
        padding: 5px;
    }

    .slider-button {
        height: 100%;
        border: 1px solid;
        display: flex;
        background: lightgrey;
    }
</style>

<style lang="css">
    @media only screen and (max-width: 501px) {
        .vue-grid-item {
            height: fit-content !important;
            transform: none !important;
            position: relative !important;
            margin-bottom: 10px;
        }
    }
</style>

<style scoped>
    .scroll {
        top: 50px;
        position: absolute;
        background: #6aa5d1;
        height: calc(100vh - 240px);
        overflow-y: scroll;
        overflow-x: auto;
    }
</style>