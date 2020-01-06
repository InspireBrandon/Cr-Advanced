<template>
    <div>
        <v-toolbar dark dense flat>
            <v-toolbar-title>
                Dashboard Designer
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark dense flat color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" color="grey darken-3">
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openDashboard()">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveDashboard()">
                            <v-list-tile-title>Save Dashboard</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="close()">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" color="grey darken-3">
                        Actions
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openEditModal()">
                            <v-list-tile-title>Add tile</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="toggleEditing()">
                            <v-list-tile-title>toggle editing</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>

        <v-card width="100%" style="height: calc(100vh - 161px);" class="report-main scroll" @dblclick="openEditModal">
            <v-card v-if="ReportItems.length==0">
                <span>Double click or click actions to add Dashboard Tiles</span>
            </v-card>
            <grid-layout style="width:100%;height:100%" :layout.sync="Layout" :col-num="12" :row-height="30"
                :auto-size="true" :is-draggable="true" :is-resizable="true" :is-mirrored="false"
                :vertical-compact="true" :margin="[5, 5]" :use-css-transforms="true">

                <grid-item class="grid-item" v-for="(item, idx) in ReportItems" :x="item.ReportLayout.x"
                    :y="item.ReportLayout.y" :w="item.ReportLayout.w" :h="item.ReportLayout.h" :i="item.ReportLayout.i"
                    :key="item.ReportLayout.i">
                    <v-flex class="fill-height">
                        <ReportLoader :ReportData="item" :key="idx" :id="idx" :editing="editing"
                            :class="{ 'editing': editing==true ,'Not_editing': editing==false }" />
                        <v-btn color="error" dark flat v-if="editing" @click="removeitem(item,idx)">
                            <v-icon >
                                delete
                            </v-icon>
                        </v-btn>
                        
                    </v-flex>
                </grid-item>
            </grid-layout>
        </v-card>
        <!-- <ReportCreate ref="ReportCreate"/> -->
        <ComponentEditorModal ref="ComponentEditorModal" />
        <PowerBIConfigModal ref="PowerBIConfigModal" />
        <dashboardSelector ref="dashboardSelector" />
        <Prompt ref="Prompt" />

        <!-- <v-flex  v-for="(item,idx) in components" :key="idx">
                    <component v-bind:is="item.name" @click.native="openEditModal(item,idx)" :props="item"></component>

                </v-flex> -->
    </div>

</template>
<script>
    import Axios from 'axios'
    // components
    import ComponentEditorModal from "./ComponentEditorModal"
    import PowerBIConfigModal from "./PowerBIConfigModal"

    // classes
    import editComponentConfig from "./components/editComponentConfig"
    // dashboard editor
    import VueGridLayout from 'vue-grid-layout';
    import ReportLoader from "./DashboardEditor/report-loader";
    import dashboardSelector from "./DashboardSelector"
    import Prompt from '@/components/Common/Prompt'



    export default {
        components: {
            ComponentEditorModal,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem,
            ReportLoader,
            PowerBIConfigModal,
            dashboardSelector,
            Prompt,
        },
        data() {
            return {
                editing: true,
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
        methods: {
            close(){
                let self = this
                self.Layout=[]
                self.ReportItems=[]
            },
            toggleEditing() {
                let self = this
                self.editing = !self.editing
            },
            removeitem(item, index) {
                let self = this
                self.ReportItems.splice(index, index + 1)
            },
            dragStart(which, ev) {
                let self = this;
                console.log("dragStart", which, ev);

                self.draggedItem = which;
            },
            openDashboard() {
                let self = this
                self.$refs.dashboardSelector.show(dashboard => {
                    console.log(dashboard);
                    self.ReportItems = []
                    Axios.get(process.env.VUE_APP_API + `Dashboard/Widgets?Dashboard_ID=${dashboard.id}`).then(
                        r => {
                            r.data.forEach(widget => {
                                let item = {
                                    ReportLayout: JSON.parse(widget.report_Layout),
                                    key: widget.widget_Key,
                                    text: widget.text,
                                    value: widget.value,
                                    id: widget.id
                                }
                                console.log("item", item);
                                self.ReportItems.push(item)
                                self.Layout.push(item.ReportLayout)
                            })

                        })
                })
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
                self.$refs.Prompt.show(null, "Enter a Name for the Dashboard", "Dashboard Name", name => {
                    if (name != null) {
                        let retVal = [];
                        console.log("self.ReportItems", self.ReportItems);

                        self.ReportItems.forEach(element => {
                            var objToPush = {
                                text: element.text,
                                value: element.value,
                                report_Layout: JSON.stringify(element.ReportLayout),
                                widget_Key: element.key
                            }
                            retVal.push(objToPush);
                        });

                        let request = {
                            ID: null,
                            Name: name,
                            Widgets: retVal
                        };

                        console.log("request", request);
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + "Dashboard/CreateDashboard", request)
                            .then(r => {
                                console.log(r);

                            });
                    }
                })
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
                if (config == null) {
                    config = {
                        text: null,
                        value: null,
                    }
                }
                self.ReportItems.push({
                    ReportLayout: item,
                    key: key,
                    text: config.text,
                    value: config.value
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

    .editing {
        height: calc(100% - 48px);
        border: 2px dotted;

    }

    .Not_editing {
        height: calc(100%);
        border: 0px dotted;
    }


    .slider-button {
        height: 100%;
        border: 1px solid;
        display: flex;
        background: lightgrey;
    }

    /* .scroll {
        overflow-y: scroll;
        overflow-x: auto;
    } */
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

    .grid-item {
        /* background-color: grey; */
        /* border: -1px dotted; */
        /* box-shadow: 0px -1px 20px #888; */

    }
</style>