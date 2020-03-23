<template>
    <div>
        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list dense class="pa-0">
                <v-list-tile class="pa-0" @click.prevent="moveSelectedBack">
                    <v-list-tile-title class="pa-0">Send Back</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile class="pa-0" @click.prevent="moveSelectedForward">
                    <v-list-tile-title class="pa-0">MoveForward</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-toolbar dark color="primary">
            <v-btn icon @click="$router.push('/Home')">
                <v-icon>home</v-icon>
            </v-btn>
            <span class="title ml-3 mr-5">Chain&nbsp;<span class="font-weight-light">Research</span></span>
        </v-toolbar>
        <v-toolbar dense dark>
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list dense class="px-2">
                        <v-list-tile>
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="open">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="saveFloorplan">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save As</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="openSpaceDesigner">
                            <v-list-tile-title>Open SpacePlan Designer</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <!-- <v-text-field label="block to meter ratio" v-model="meterRatio" style="width:200px">
                </v-text-field> -->
            </v-toolbar-items>
            <library ref="library" :isFloorplan="true"></library>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon flat small v-on="on" @click="duplicate('RIGHT')">
                        <v-icon>arrow_right</v-icon>
                    </v-btn>
                </template>
                <span>duplicate item to right</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small @click="duplicate('LEFT')">
                        <v-icon>arrow_left</v-icon>
                    </v-btn>
                </template>
                <span>duplicate item to left</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small @click="duplicate('UP')">
                        <v-icon>arrow_drop_up</v-icon>
                    </v-btn>
                </template>
                <span>duplicate item to top</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small @click="duplicate('DOWN')">
                        <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                </template>
                <span>duplicate item to bottom</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="resetStageScale">
                        <v-icon>zoom_out_map</v-icon>
                    </v-btn>
                </template>
                <span>reset zoom</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="$refs.threeD.show(Floorplan_ID)">
                        3D
                    </v-btn>
                </template>
                <span>View 3D</span>
            </v-tooltip>
            <v-btn @click="logMutli">log</v-btn>
            <div v-show="multiSelectGroup !=null">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn icon flat small v-on="on" @click="addItemToGroup()">
                            <v-icon>blur_on</v-icon>
                        </v-btn>
                    </template>
                    <span>Add Item to group</span>
                </v-tooltip>
            </div>
            <div v-if="selectedItem!=null">
                <div v-show="selectedItem.attrs.drawType=='group'">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn icon flat small v-on="on" @click="removeItemFromGroup()">
                                <v-icon>blur_off</v-icon>
                            </v-btn>
                        </template>
                        <span>Remove Item from group</span>
                    </v-tooltip>
                </div>
            </div>
            <!-- <v-btn @click="openFloorSettings">
                Floor Settings
            </v-btn> -->
            <!-- <v-btn @click="openMediaManager">
                open media
            </v-btn> -->
            <!-- <div v-if="stage!=null">
                xScale:{{stage.attrs.scaleX}} || yScale{{stage.attrs.scaleY}} || x:{{stage.attrs.x}} ||
                y:{{stage.attrs.y}}
            </div> -->
            <v-spacer></v-spacer>
            <v-toolbar-title>Floor Planning</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-xs class="ma-0 pa-0" fluid>
            <div style="display: flex;">
                <div class="toolbar grey darken-4">
                    <v-layout row wrap class="pt-3">
                        <v-flex sm12 class="pa-1" v-for="(tool, idx) in tools" :key="idx">
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-card v-on="on" :color="selectedTool == tool ? ' #111111;' : '#212121'"
                                        class="selected-tool mb-1 pa-1" dark flat
                                        style="text-align: center; cursor: pointer;" @click="onToolChange(tool.name)">
                                        <v-icon v-if="tool.name!='linear_scale'"
                                            :color="selectedTool == tool.name ? 'primary' : 'white'" :size="25">
                                            {{ tool.name }}
                                        </v-icon>
                                        <v-img :color="selectedTool == tool.name ? 'primary' : 'white'" :size="25"
                                            v-else src="/tape-measure-2-xxl.png">
                                        </v-img>
                                    </v-card>
                                </template>
                                <span>{{ tool.tooltip }}</span>
                            </v-tooltip>
                            <v-divider dark></v-divider>
                        </v-flex>
                    </v-layout>
                </div>
                <v-layout row wrap>
                    <v-flex sm10 class="pa-0">
                        <v-card tile flat id="stage_container" class="fill-height" :style="{ 'cursor': currentCursor }">
                            <div ref="container" @dragover="acceptDrag" @drop="dropDragItem" id="container"
                                oncontextmenu="return false;">
                            </div>
                        </v-card>
                    </v-flex>
                    <v-flex sm2 class="pa-0">
                        <v-card>
                            <v-container grid-list-md>
                                <v-layout row wrap>
                                    <v-flex md12 style="padding: 2px;">
                                        <v-select light placeholder="Clusters" @change="onClusterTypeChange" dense
                                            :items="clusterTypes" v-model="selectedClusterType" solo hide-details>
                                        </v-select>
                                    </v-flex>
                                    <v-flex md12 style="padding: 2px;">
                                        <v-select light v-if="selectedClusterType != null"
                                            :placeholder="'Select ' + selectedClusterType + ' cluster'" dense
                                            :items="clusterOptions[selectedClusterType]" v-model="selectedClusterOption"
                                            solo hide-details>
                                        </v-select>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                        <v-card tile flat id="panel_container" class="fill-height">
                            <v-toolbar v-if="selectedTool == 'open_with'" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Properties</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="selectedTool == 'open_with' &&selectedItem==null" class="pt-0"
                                style="height: 30%; overflow-y: scroll;">
                                <v-text-field type="number" v-model="floorConfig.blockRatio" label="Block Width (m)"
                                    @change="applyFloorProperties">
                                </v-text-field>
                                <v-text-field type="number" v-model="floorConfig.floorWidth" label="Floor Width (m)"
                                    @change="applyFloorProperties">
                                </v-text-field>
                                <v-text-field type="number" v-model="floorConfig.floorHeight" label="Floor Height (m)"
                                    @change="applyFloorProperties">
                                </v-text-field>
                            </v-card-text>
                            <v-card-text v-if="selectedTool == 'open_with' && selectedItem!=null&&makingChanges==false"
                                class="pt-0" style="height: 30%; overflow-y: scroll;">
                                <v-text-field @change="applyProperties" v-if="properties.name!=null" label="Name"
                                    v-model="properties.name" hide-details> </v-text-field>
                                <v-text-field
                                    v-if="properties.height!=null&&properties.height.toString()!='NaN'&&properties.height!=undefined"
                                    @change="applyProperties($event,'height')" type="number" label="Height (m)"
                                    v-model="properties.height" hide-details>
                                </v-text-field>
                                <v-text-field
                                    v-if="properties.width!=null&&properties.width.toString()!='NaN'&&properties.height!=undefined"
                                    @change="applyProperties($event,'width')" type="number" label="Width (m)"
                                    v-model="properties.width" hide-details>
                                </v-text-field>
                                <v-text-field v-if="selectedItem.attrs.name=='circle'" @change="applyProperties"
                                    type="number" label="Radius (m)" v-model="properties.radius" hide-details>
                                </v-text-field>
                                <v-text-field
                                    v-if="properties.depth!=null&&properties.depth.toString()!='NaN'&&properties.depth!=undefined"
                                    @change="applyProperties" type="number" label="Depth (m)" v-model="properties.depth"
                                    hide-details>
                                </v-text-field>
                                <v-text-field v-if="showRotation" @change="applyProperties" type="number"
                                    label="rotation" v-model="properties.rotation" hide-details>
                                </v-text-field>
                                <v-checkbox @change="applyProperties" v-model="keepAspectRatio"
                                    v-if="selectedItem.attrs.name=='image'" label="Keep aspect ratio">
                                </v-checkbox>

                                <v-text-field type="color" label="Color" v-model="properties.fill"
                                    @change="applyProperties($event)">
                                </v-text-field>
                            </v-card-text>
                            <v-toolbar v-if="selectedTool != 'open_with'" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Brush</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="selectedTool != 'open_with'" class="pt-3"
                                style="height: 30%; overflow-y: scroll;">
                                <v-text-field v-if="selectedTool=='crop_square'||selectedTool=='show_chart'"
                                    label="Height" v-model="brush.height" hide-details>
                                </v-text-field>
                                <v-text-field v-if="selectedTool=='crop_square'" label="Width" v-model="brush.width"
                                    hide-details>
                                </v-text-field>
                                <v-text-field v-if="selectedTool=='fiber_manual_record'" label="Radius"
                                    v-model="brush.radius" hide-details>
                                </v-text-field>
                                <v-text-field type="color" label="Color" v-model="brush.color" hide-details>
                                </v-text-field>
                            </v-card-text>
                            <v-toolbar dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Layers</div>
                                    <div v-if="selectedLayer!=null">
                                    </div>
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small @click="log" color="primary">add</v-btn>
                                    </template>
                                    <v-list dense class="pa-0">
                                        <v-list-tile tile @click="addLayer">
                                            <v-list-tile-title>Layer</v-list-tile-title>
                                        </v-list-tile>
                                        <v-divider></v-divider>
                                        <v-list-tile tile @click="addGroup">
                                            <v-list-tile-title>Group</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-toolbar>
                            <v-card-text class="pa-0 pt-0" style="height: 40%; overflow-y: scroll;">
                                <!-- <div @dragover.prevent draggable="true" @drop="MoveLayerTopTop($event)">
                                    <div class="pa-1 grey lighten-3" style="display: flex;">
                                        <div>
                                            Drag layer here to move to top.
                                        </div>
                                    </div>
                                    <v-divider></v-divider>
                                </div> -->
                                <RecursiveLayer v-if="layerTree.length>0" ref="RecursiveLayer"
                                    :selectItemFromSidePanel="selectItemFromSidePanel" :setItemVisible="setItemVisible"
                                    :selectedLayerTreeItem="selectedLayerTreeItem" :editLayerName="editLayerName"
                                    :showChild="true" :layers="layerTree" :selectLayer="selectLayer"
                                    :setLayerVisible="setLayerVisible" :deleteLayer="deleteLayer" :endDrag="endDrag"
                                    :swapIndex="swapIndex" :startDrag="startDrag" :selectedLayerTree="selectedLayerTree"
                                    :selectedLayer="selectedLayer" :toggleLock="toggleLock" />

                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </div>
            <input @change="onFileChange" type="file" style="display: none;" ref="fileInput">
            <PlanogramDetailsSelector ref="PlanogramDetailsSelector" />
            <floorPlanSelector ref="floorPlanSelector" />
            <Prompt ref="Prompt" />
            <Spinner ref="spinner"></Spinner>
            <FloorConfigModal ref="FloorConfigModal" />
            <FloorPlanMediaModal ref="FloorPlanMediaModal" />

        </v-container>
        <v-snackbar v-model="snackbar" color="primary" :timeout="3000">
            {{ snackbarText }}
            <v-btn dark flat @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
        <threeD ref="threeD" />
    </div>
</template>

<script>
    import Konva from 'konva'

    import treeItem from './libs/tree/TreeItem'
    import Rect from './libs/drawing/shape/rect'
    import Circle from './libs/drawing/shape/circle'
    import Label from './libs/drawing/shape/label'
    import Line from './libs/drawing/shape/line'
    import Arrow from './libs/drawing/shape/arrow'
    import StageImage from './libs/drawing/shape/image'
    import Area from './libs/drawing/shape/area'



    import DuplicationHelper from './libs/drawing/Functions/duplication-Helper'
    import DragHandler from './libs/drawing/Functions/Drag-Handler'
    import ClickTapHelper from './libs/drawing/Functions/ClickTap-helper'
    import TransFormerHelper from './libs/drawing/Functions/TransFormer-Helper'
    import MultiSelectHelper from './libs/drawing/Functions/MultiSelect-helper'
    import GroupingHandler from './libs/drawing/Functions/Grouping-handler'
    import GroupDuplicationHelper from './libs/drawing/Functions/Group-Duplication-Helper'



    import SnappingHandler from './libs/drawing/Functions/snapping-handler'

    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector';
    import Prompt from '@/components/Common/Prompt';
    import Spinner from '@/components/Common/Spinner';


    import FloorPlanMediaModal from "./FloorPlanMediaModal"
    import Settings from './Settings'
    import RecursiveLayer from "./RecursiveLayer.vue"
    import PlanogramLibrary from "./PlanogramLibrary.vue"
    import floorPlanSelector from "./floorPlanSelector.vue"
    import FloorConfigModal from "./FloorConfigModal"
    import threeD from './3D/Index'

    import library from "@/components/Main/Planogram/spaceplanning/src/components/Library/Library";
    import axios from 'axios'

    let dragHandler = new DragHandler(this)
    let clickTapHelper = new ClickTapHelper()
    let transFormerHelper = new TransFormerHelper()
    let multiSelectHelper = new MultiSelectHelper()

    var height = 0;
    var width = 0;

    const scaleBy = 1.05;

    export default {
        components: {
            FloorConfigModal,
            Settings,
            RecursiveLayer,
            PlanogramDetailsSelector,
            PlanogramLibrary,
            library,
            floorPlanSelector,
            Prompt,
            Spinner,
            FloorPlanMediaModal,
            threeD
        },
        // 1 block = 1 meter
        data() {
            return {
                showRotation: false,
                makingChanges: false,
                hasTape: null,
                clusterTypes: [{
                        text: "All Stores Cluster",
                        value: "allStores"
                    },
                    {
                        text: "Select Stores",
                        value: "stores"
                    },
                    {
                        text: "Store Cluster",
                        value: "cluster"
                    },
                    {
                        text: "Department Cluster",
                        value: "department"
                    },
                    {
                        text: "Regional Cluster",
                        value: "regional"
                    },
                    {
                        text: "Custom Cluster",
                        value: "custom"
                    }
                ],
                clusterOptions: {
                    allStores: [{
                        text: "All Stores",
                        value: "allStores"
                    }],
                    category: [],
                    custom: [],
                    department: [],
                    regional: [],
                    cluster: [],
                    stores: [],
                },
                selectedClusterOption: null,
                selectedClusterType: null,
                fixtureLayer: null,
                fixtureTree: null,
                departmentTree: null,
                backgroundTree: null,
                departmentLayer: null,
                backgroundLayer: null,
                buildingLayer: null,
                buildingLayerTree: null,
                areaLayer: null,
                areaLayerTree: null,
                dotted: null,
                wall: null,
                area: null,
                rect: null,
                circle: null,
                image: null,
                arrow: null,
                arrowStartY: null,
                arrowStartX: null,
                textNode: null,
                areaTree: null,
                firstPosition: {
                    x: 0,
                    y: 0
                },
                imagePos: {
                    x: 0,
                    y: 0
                },
                lastPosition: {
                    x: 0,
                    y: 0
                },
                multiSelectGroup: null,
                snackbar: false,
                snackbarText: "",
                x: 0,
                y: 0,
                showMenu: false,
                lastdeletedItem: [],
                lastDeletedTree: [],
                meterRatio: 25,
                // 1 block = 1 meter
                duplicationSequence: {
                    up: 1,
                    down: 1,
                    left: 1,
                    right: 1
                },
                dragStartIndex: null,
                KonvaLayerDragStart: null,
                selectedLayerTreeItem: null,
                doubleClickTime: 0,
                groupLayer: null,
                snapableItems: ['.wall', '.rect-group', '.circle'],
                dragItem: null,
                dragParent: null,
                dragidx: null,
                ctrlDown: false,
                stage: null,
                layer: null,
                layerTree: [],
                layers: [],
                properties: {
                    name: "",
                    radius: null,
                    height: null,
                    depth: null,
                    width: null,
                    fill: "#1976d2",
                    rotation: null,
                },
                keepAspectRatio: null,
                selectedItem: null,
                selectedLayer: null,
                selectedLayerTree: null,
                brush: {
                    height: 10,
                    width: 10,
                    radius: 10,
                    color: "#1976d2",
                    snapOption: 15,
                    snappingAngles: []
                },
                tools: [{
                        name: 'open_with',
                        tooltip: "move & selection"
                    }, {
                        name: 'crop_square',
                        tooltip: "Draw Block"
                    }, {
                        name: 'fiber_manual_record',
                        tooltip: "Draw circle"
                    }, {
                        name: 'show_chart',
                        tooltip: "Draw wall"
                    },
                    {
                        name: 'image',
                        tooltip: "Draw Image"
                    }, {
                        name: 'local_offer',
                        tooltip: "Add label"
                    },
                    {
                        name: 'arrow_upward',
                        tooltip: "Draw Arrow"
                    },
                    {
                        name: 'tab_unselected',
                        tooltip: "Draw Areas"
                    },
                    {
                        name: 'linear_scale',
                        tooltip: "Tape Measure"
                    }
                ],
                floorConfig: {
                    blockRatio: 1,
                    floorHeight: null,
                    floorWidth: null,
                    floorImageID: null,
                    repeat: false
                },
                selectedTool: 'open_with',
                transformProperties: {
                    radius: 0,
                    height: 0,
                    width: 0
                },
                Floorplan_ID: null,
                LabelText: "",
                saveArr: [],
                imageIDArr: [],
            }
        },
        computed: {
            currentCursor() {
                let self = this;
                if (self.selectedTool != "open_with") {
                    return 'crosshair';
                } else {
                    return 'default';
                }
            }
        },
        methods: {
            detatchShape(node, layer, callback) {
                let self = this

                const matrix = node.getAbsoluteTransform().getMatrix();
                console.log("matrix", matrix);
                const attrs = decompose(matrix);
                node.moveTo(layer);
                node.setAttrs(attrs)
                callback()
            },
            logMutli() {
                let self = this
                console.log("self.multiSelectGroup", self.multiSelectGroup);
                console.log("self.stage", self.stage);
                console.log("selectedItem", self.selectedItem);
                console.log("properties", self.properties);

            },
            addItemToGroup() {
                let self = this
                let groupingHandler = new GroupingHandler()

                groupingHandler.addItemToGroup(self.stage, self.selectedItem, self.selectedLayer, self
                    .selectedLayerTree, self.selectedLayerTreeItem, self.multiSelectGroup, self.findLayerItem, self
                    .layerTree, callback => {
                        if (self.multiSelectGroup != undefined && self.multiSelectGroup != null) {
                            self.multiSelectGroup.destroy()
                            self.multiSelectGroup = null
                        }
                        self.stage.find('Transformer').destroy()
                        self.stage.batchDraw()
                    })
            },
            removeItemFromGroup() {
                let self = this
                let groupingHandler = new GroupingHandler()
                let layerParent = self.selectedLayerTreeItem.parent
                let parent = self.selectedItem.parent
                for (let index = self.selectedItem.children.length - 1; index > -1; index--) {
                    const child = self.selectedItem.children[index];
                    self.findLayerItem(self.layerTree, child._id, cb => {
                        cb.parent.children.forEach((layerItem, idx) => {
                            if (layerItem == cb) {
                                let spliceItem = cb.parent.children.splice(idx, 1)
                                self.selectedLayerTreeItem.parent.children.push(spliceItem[0])
                                spliceItem[0].parent = self.selectedLayerTreeItem.parent
                                self.detatchShape(child, parent, callback => {
                                    if (index == 0) {
                                        self.selectedItem.destroy()
                                        self.selectedLayerTreeItem.parent.children.forEach((
                                            tree,
                                            tidx) => {
                                            if (tree == self.selectedLayerTreeItem) {
                                                self.selectedLayerTreeItem.parent
                                                    .children
                                                    .splice(tidx, 1)
                                            }
                                        })
                                    }
                                })
                            }
                        })

                    })
                }

                // groupingHandler.removeItemFromGroup(self.stage, self.selectedItem, self.selectedLayer, self
                //     .selectedLayerTree, self.selectedLayerTreeItem, self.multiSelectGroup, self.findLayerItem, self
                //     .layerTree, parent, callback => {
                //         self.findLayerItem(self.layerTree, callback._id, cb => {
                //             cb.parent.children.forEach((element, idx) => {
                //                 if (cb == element) {
                //                     cb.parent.children.splice(idx, 1)
                //                     callback.destroy()
                //                     self.selectLayer(cb.parent, self.layerTree, layerCB => {
                //                         self.selectedItem = null
                //                         self.stage.batchDraw()
                //                         cb.parent.showChildren = false
                //                     })

                //                 }
                //             })
                //         })
                //     })
            },
            getClusters() {
                let self = this
                axios.get(process.env.VUE_APP_API + `Cluster/Store`).then(r => {
                    self.clusterOptions.stores = []
                    r.data.forEach(store => {
                        self.clusterOptions.cluster.push({
                            text: store.store_Cluster,
                            value: store.id,
                        })
                    })
                })


            },
            getStores() {
                let self = this
                axios.get(process.env.VUE_APP_API + `Store?db=CR-Devinspire`).then(r => {
                    r.data.forEach(store => {
                        self.clusterOptions.stores.push({
                            text: store.storeName,
                            value: store.storeID,
                        })
                    })
                })
            },
            onClusterTypeChange() {
                let self = this;
                self.$nextTick(() => {

                    if (self.selectedClusterType == "stores") {
                        self.getStores()

                    }
                    self.selectedClusterOption = null;
                })
            },
            applyFloorProperties() {
                let self = this
                self.stage.setWidth(self.floorConfig.floorWidth * 25)
                self.stage.setHeight(self.floorConfig.floorHeight * 25)
                self.stage.children.forEach((element, idx) => {
                    if (element.attrs.name == "grid") {
                        element.destroy()
                        self.drawGrid()
                        self.stage.batchDraw()
                    }
                })
            },
            openMediaManager() {
                let self = this
                self.$refs.FloorPlanMediaModal.open(true, media => {

                })
            },
            openFloorSettings() {
                let self = this
                self.$refs.FloorConfigModal.open(self.floorConfig, callback => {

                    self.floorConfig.blockRatio = parseFloat(callback.blockRatio)
                    self.floorConfig.floorHeight = parseFloat(callback.floorHeight)
                    self.floorConfig.floorWidth = parseFloat(callback.floorWidth)
                    self.floorConfig.floorImageID = callback.floorImageID
                    self.floorConfig.repeat = callback.repeat
                    self.stage.setWidth(self.floorConfig.floorWidth * 25)
                    self.stage.setHeight(self.floorConfig.floorHeight * 25)
                    self.stage.children.forEach((element, idx) => {
                        if (element.attrs.name == "grid") {
                            element.destroy()
                            self.drawGrid()
                            self.stage.batchDraw()

                        }
                    })
                })

            },
            FloorMediaSrc(id) {
                let self = this
                return process.env.VUE_APP_API +
                    `FloorplanMedia/Image?ImageID=${id}&databaseID=${sessionStorage.currentDatabase}`
            },
            DrawFixture(item, parentArr, parentLayerTree, callback) {
                let self = this
                switch (item.name) {
                    case "wall": {
                        let wall = new Line(parentArr, {
                            x: item.x,
                            y: item.y,
                            name: 'wall',
                            drawType: 'wall'
                        })
                        wall.shape.setAttrs({
                            width: item.width,
                            height: item.height,
                            depth: item.depth,
                            rotation: item.rotation,
                            fill: item.color,
                            draggable: false

                        })
                        let treeitem = new treeItem({
                            KonvaID: wall.shape._id,
                            name: 'wall',
                            drawType: 'wall',
                            children: [],
                            width: null,
                            parent: parentLayerTree
                        })
                        parentLayerTree.children.push(treeitem)
                        self.stage.batchDraw()

                    }
                    break;
                case "circle": {
                    let circle = new Circle(parentArr, {
                        x: item.x,
                        y: item.y,
                    });
                    circle.shape.setAttrs({
                        fill: item.color,
                        depth: item.depth,
                        radius: item.radius,
                        draggable: false

                    })
                    parentLayerTree.children.push(new treeItem({
                        KonvaID: circle.shape._id,
                        visible: true,
                        showEditName: false,
                        selected: false,
                        showChildren: false,
                        draggable: true,
                        name: "Circle",
                        children: [],
                        parent: parentLayerTree
                    }))
                    self.stage.batchDraw()

                }
                break;

                case "Gondola-Rect": {
                    let rect
                    if (item.fixture_ID == 0) {
                        rect = new Rect(parentArr, {
                            x: item.x,
                            y: item.y,
                        }, null, null, null);
                    } else {
                        rect = new Rect(parentArr, {
                            x: item.x,
                            y: item.y,
                        }, null, null, null, self.imageSrc(item.fixture_ID,
                            "Top"), self.stage);
                    }
                    parentLayerTree.children.push(new treeItem({
                        KonvaID: rect.shape._id,
                        visible: true,
                        showEditName: false,
                        selected: false,
                        showChildren: false,
                        draggable: false,
                        name: "rect-group",
                        children: [],
                        parent: parentLayerTree
                    }))
                    rect.shape.setAttrs({
                        DropID: item.fixture_ID,
                        fill: item.color,
                        width: item.width,
                        depth: item.depth,
                        height: item.height,
                        rotation: item.rotation,
                        draggable: true
                    })
                }
                break;

                case "image": {
                    let image = new StageImage(parentArr, {
                        x: item.x,
                        y: item.y
                    });

                    parentLayerTree.children.push(new treeItem({
                        KonvaID: image.shape._id,
                        visible: true,
                        showEditName: false,
                        selected: false,
                        showChildren: false,
                        draggable: false,
                        name: "Image",
                        children: [],
                        parent: parentLayerTree
                    }))
                    image.shape.setAttrs({
                        width: item.width,
                        depth: item.depth,
                        height: item.height
                    })
                    image.shape.attrs.imageID = item.imageID
                    var imageObj = new Image();

                    imageObj.onload = function () {
                        image.shape.image(imageObj);
                        self.stage.batchDraw();
                        // self.selectedTool = ''
                        image.shape.draggable(true)
                    }
                    imageObj.src = self.imageFloorplanFixtureSrc(item.imageID);
                }
                break;

                case "arrow": {
                    let arrow = new Arrow(parentArr, {
                        x: item.x,
                        y: item.y,
                    });


                    parentLayerTree.children.push(new treeItem({
                        KonvaID: arrow.shape._id,
                        visible: true,
                        showEditName: false,
                        selected: false,
                        showChildren: false,
                        draggable: false,
                        name: "arrow",
                        children: [],
                        parent: parentLayerTree
                    }))
                    arrow.shape.points([item.x, item.y, item.arrowEndX, item.arrowEndY])
                }

                case "Area": {
                    let area = new Area(self.areaLayer, {
                        x: item.x,
                        y: item.y,
                    }, {
                        color: item.color,
                        height: item.height,
                        width: item.width
                    });

                    self.areaLayerTree.children.push(new treeItem({
                        KonvaID: area.shape._id,
                        visible: true,
                        showEditName: false,
                        selected: false,
                        showChildren: false,
                        draggable: false,
                        name: "Area",
                        children: [],
                        parent: areaLayerTree
                    }))
                    area.shape.setAttrs({
                        width: item.width,
                        height: item.height,
                        fill: item.color
                    })
                }
                default:
                    break;
                }
                callback()
            },
            drawSavedItems(menuItems, parentArr, parentLayerTree, callback) {
                let self = this
                menuItems.forEach((item, idx) => {
                    switch (item.type) {
                        case 0: {
                            let layer = new Konva.Layer({
                                name: item.name,
                                visible: true,
                                showEditName: false,
                                selected: false,
                                showChildren: false,
                                drawType: "Layer",
                                type: "Layer"
                            })
                            let layertreeitem = new treeItem({
                                KonvaID: layer._id,
                                children: [],
                                name: item.name,
                                showEditName: false,
                                visible: layer.visible,
                                selected: layer.selected,
                                showChildren: layer.showChildren,
                                drawType: "Layer"
                            })

                            switch (item.name) {
                                case "Background": {
                                    layer = self.backgroundLayer
                                    layertreeitem = self.backgroundTree
                                    self.selectedLayer = self.backgroundLayer
                                }
                                break;
                            case "Building": {
                                layer = self.buildingLayer
                                layertreeitem = self.buildingLayerTree
                            }
                            break;
                            case "Fixtures": {
                                layer = self.fixtureLayer
                                layertreeitem = self.fixtureTree
                            }
                            break;
                            case "Departments": {
                                layer = self.departmentLayer
                                layertreeitem = self.departmentTree
                            }
                            break;
                            case "Areas": {
                                layer = self.area
                                layertreeitem = self.areaLayerTree
                            }
                            break;

                            default:
                                layer = new Konva.Group({
                                    x: item.x,
                                    x: item.y,
                                    name: item.name,
                                    visible: true,
                                    showEditName: false,
                                    selected: false,
                                    showChildren: false,
                                    drawType: "Layer",
                                    type: "Layer"
                                })
                                layertreeitem = new treeItem({
                                    KonvaID: layer._id,
                                    children: [],
                                    name: item.name,
                                    showEditName: false,
                                    visible: layer.visible,
                                    selected: layer.selected,
                                    showChildren: layer.showChildren,
                                    drawType: "Layer"
                                })
                                parentLayerTree.children.push(layertreeitem)
                                parentArr.add(layer);


                                break;
                            }
                            if (item.children.length > 0) {
                                self.drawSavedItems(item.children, layer, layertreeitem, SB => {})
                            }
                        }
                        break;
                    case 1: {
                        let self = this;
                        if (item.name == "Gondola-Rect") {
                            self.DrawFixture(item, parentArr, parentLayerTree, cb => {
                                self.stage.batchDraw()
                            })
                        } else {
                            let group = new Konva.Group({
                                x: item.x,
                                y: item.y,
                                rotation: item.rotation,
                                name: item.name,
                                visible: true,
                                showEditName: false,
                                selected: false,
                                showChildren: false,
                                draggable: true,
                                locked: false,
                                drawType: "group",
                                type: "group",
                            })
                            let layertreeitem = new treeItem({
                                KonvaID: group._id,
                                children: [],
                                name: item.name,
                                showEditName: false,
                                visible: group.visible,
                                selected: group.selected,
                                showChildren: group.showChildren,
                                drawType: "group",
                                locked: true,
                                parent: parentLayerTree
                            })
                            parentArr.add(group)
                            parentLayerTree.children.push(layertreeitem)
                            if (item.children.length > 0) {
                                self.drawSavedItems(item.children, group, layertreeitem, sb => {})
                            }
                        }
                        // drawGroup
                    }
                    break;
                    case 2: {
                        // drawFixture
                        self.DrawFixture(item, parentArr, parentLayerTree, cb => {
                            self.stage.batchDraw()
                        })
                    }
                    break;

                    default:
                        break;
                    }

                    if (idx == menuItems.length - 1) {
                        callback()
                    }
                });


            },
            open() {
                let self = this
                self.$refs.floorPlanSelector.show(callback => {
                    self.Floorplan_ID = callback.id
                    if (callback.store_ID != null) {
                        self.selectedClusterType = "stores"
                        self.selectedClusterOption = callback.store_ID
                    }
                    if (callback.storeCluster_ID != null) {
                        self.selectedClusterType = "cluster"
                        self.selectedClusterOption = callback.storeCluster_ID
                    }
                    self.floorConfig.blockRatio = callback.blockWidth
                    self.floorConfig.floorHeight = callback.height
                    self.floorConfig.floorWidth = callback.width
                    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    self.applyFloorProperties()
                    axios.get(process.env.VUE_APP_API + `GetFloorPlanItems?Header_ID=${callback.id}`).then(
                        r => {
                            self.stage.children.forEach(child => {
                                if (child.attrs.name != 'grid') {
                                    child.destroyChildren()
                                }
                            })
                            self.drawSavedItems(r.data, self.stage, self.layerTree,
                                cb => {
                                    self.stage.batchDraw()
                                    self.selectLayer(self.fixtureTree, self.layerTree, cb => {})
                                })
                            self.Floorplan_ID = callback.id
                        })

                })
            },
            CheckType(item) {

                switch (item.attrs.type) {
                    case "Layer":
                        return 0
                        break;
                    case "group":
                        return 1
                        break;
                    case "planogramGroup":
                        return 1
                        break;
                    case "Duplication Group":
                        return 1
                        break;
                    case "PlanogramFixture":
                        return 1
                        break;
                    case "Fixture":
                        return 2
                        break;

                    default: {
                        return 2
                    }
                    break;
                }

            },
            FormatItems(menuItems, parentArr, Floorplan_Fixture_ID, Floorplan_ID, callback) {
                let self = this

                menuItems.forEach((item, idx) => {
                    if (item.attrs.name != "grid") {
                        let reqObj = {
                            type: self.CheckType(item),
                            x: item.attrs.x,
                            y: item.attrs.y,
                            width: item.attrs.width,
                            height: item.attrs.height,
                            depth: item.attrs.depth,
                            rotation: item.attrs.rotation,
                            radius: item.attrs.radius,
                            name: item.attrs.name,
                            Floorplan_ID: Floorplan_ID,
                            Fixture_ID: item.saveID,
                            color: item.attrs.fill,
                            imageID: item.attrs.imageID,
                            children: []
                        }
                        if (item.attrs.name == "arrow") {
                            reqObj.x = item.attrs.points[0]
                            reqObj.y = item.attrs.points[1]
                            reqObj.arrowEndX = item.attrs.points[2]
                            reqObj.arrowEndY = item.attrs.points[3]

                        }
                        if (item.attrs.name == "image") {
                            self.imageIDArr.push(item)
                        }
                        parentArr.push(reqObj)
                        if (item.children.length > 0) {
                            self.FormatItems(item.children, reqObj.children, item.attrs.DropID, Floorplan_ID,
                                recCall => {})
                        }
                        if (idx + 1 == menuItems.length) {
                            callback()
                        }
                    }
                })
            },
            handleImageSaving() {
                let self = this
                if (self.imageIDArr.length > 0) {
                    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    axios.get(process.env.VUE_APP_API + `Floorplan?Floorplan_ID=${self.Floorplan_ID}`).then(r => {
                        r.data.forEach(saveditem => {
                            self.imageIDArr.forEach(item => {
                                if (saveditem.x == item.attrs.x.toFixed(0) && saveditem.y ==
                                    item.attrs
                                    .y.toFixed(0)) {
                                    if (item.attrs.refFile != null && item.attrs.refFile !=
                                        undefined) {
                                        axios.post(process.env.VUE_APP_API +
                                            `Floorplan/Image?ImageID=${saveditem.id}`, item
                                            .attrs.refFile).then(
                                            resp => {

                                            })
                                    }
                                }
                            })
                        })
                    })
                } else {

                }
                self.$refs.spinner.hide()
            },
            generateName(Name) {
                let self = this
                let perp
                self.clusterOptions[self.selectedClusterType].forEach(element => {
                    if (element.value == self.selectedClusterOption) {
                        perp = element.text
                    }
                })
                let string = ""
                string += perp + " - " + Name
                return string
            },
            saveFloorplan() {
                let self = this
                self.stage.find('Transformer').destroy()
                self.saveArr = []
                if (self.selectedClusterOption == null) {
                    alert("Please fill in cluster options")
                    return
                }
                self.$refs.Prompt.show("", " Save FloorPlan", "Please enter floorplan name", Name => {
                    self.$refs.spinner.show()
                    if (self.hasTape != null) {
                        self.hasTape.shape.destroy()
                        self.hasTape = null
                    }

                    let req = {
                        id: self.Floorplan_ID,
                        name: self.generateName(Name),
                        width: parseFloat(self.floorConfig.floorWidth),
                        height: parseFloat(self.floorConfig.floorHeight),
                        blockWidth: parseFloat(self.floorConfig.blockRatio),
                        repeat: self.floorConfig.repeat
                    }

                    switch (self.selectedClusterType) {
                        case "stores": {
                            req.storeID = self.selectedClusterOption
                        }
                        break;
                    case "cluster": {
                        req.storeCluster_ID = self.selectedClusterOption
                    }
                    break;

                    default:
                        break;
                    }
                    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    axios.post(process.env.VUE_APP_API + `saveFloorHeader`, req).then(r => {
                        self.Floorplan_ID = r.data.id
                        self.imageIDArr = []
                        self.FormatItems(self.stage.children, self.saveArr, 0, self.Floorplan_ID,
                            callback => {
                                console.log(self.saveArr);
                                axios.post(process.env.VUE_APP_API +
                                    `saveFloorHeader?header_ID=${self.Floorplan_ID}`, self
                                    .saveArr).then(
                                    resp => {
                                        self.handleImageSaving()
                                    })

                            })
                    })
                })
            },
            imageSrc(imgID, type) {
                let self = this;
                return process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${imgID}&type=${type}`
            },
            imageFloorplanFixtureSrc(ImageID) {
                let self = this
                return process.env.VUE_APP_API + `Floorplan?ImageID=${ImageID}`

            },
            addShape(parent, item, idx, dropPos, callback) {
                let self = this
                let shape = JSON.parse(item.attributes)
                switch (shape.name) {
                    case "Gondola-Rect": {
                        let rect = new Rect(self.selectedLayer, {
                            x: dropPos.x + (shape.x / 4),
                            y: dropPos.y + (shape.y / 4)
                        }, null, null, null, self.imageSrc(item.floorplan_Fixture_ID,
                            "Top"));

                        rect.shape.saveID = item.id
                        rect.shape.guid = item.guid
                        // rect.shape.attrs = shape
                        rect.shape.attrs.type = "PlanogramFixture"
                        rect.shape.setAttrs({
                            width: shape.width / 4,
                            height: shape.height / 4
                        })
                        self.selectedLayerTree.children.push(new treeItem({
                            KonvaID: rect.shape._id,
                            visible: true,
                            showEditName: true,
                            selected: true,
                            showChildren: false,
                            draggable: true,
                            name: "rect-group",
                            children: [],
                            parent: self.selectedLayerTree
                        }))
                        rect.shape.moveTo(parent)

                        rect.shape.draggable(false)
                    }
                    break;
                case "circle": {
                    let circle = new Circle(self.selectedLayer, {
                        x: shape.x / 4,
                        y: shape.y / 4,
                    }, null, {
                        radius: shape.radius / 4,
                        color: "#1976d2"
                    });
                    circle.shape.attrs = shape
                    circle.shape.setAttrs({
                        x: dropPos.x + (shape.x / 4),
                        y: dropPos.y + (shape.y / 4),
                        radius: shape.radius / 4
                    })
                    circle.shape.saveID = item.id
                    circle.shape.guid = item.guid
                    circle.shape.attrs.type = "PlanogramFixture"
                    circle.shape.draggable(false)


                    self.selectedLayerTree.children.push(new treeItem({
                        KonvaID: circle.shape._id,
                        visible: true,
                        showEditName: true,
                        selected: true,
                        showChildren: false,
                        draggable: true,
                        name: "Circle",
                        children: [],
                        parent: self.selectedLayerTree
                    }))
                    circle.shape.moveTo(parent)

                }
                break;
                default:
                    break;
                }
                callback()
            },
            createDepartment(department, callback) {
                let self = this
                var retVal = {
                    layerTreeItem: null,
                    Konvalayer: null,
                }
                self.departmentLayer.children.forEach(item => {
                    if (department.department == item.attrs.name) {
                        retVal.Konvalayer = item
                    }
                })
                self.departmentTree.children.forEach(item => {
                    if (department.department == item.name) {
                        retVal.layerTreeItem = item
                    }
                })
                if (retVal.layerTreeItem == null &&
                    retVal.Konvalayer == null) {
                    retVal.Konvalayer = new Konva.Group({
                        name: department.department,
                        type: "planogramGroup",
                        visible: true,
                        showEditName: false,
                        selected: true,
                        showChildren: false,
                        draggable: true,
                        locked: true,
                        drawType: "group",
                        isPlanogram: true,
                    })

                    retVal.layerTreeItem = new treeItem({
                        KonvaID: retVal.Konvalayer._id,
                        children: [],
                        name: department.department,
                        showEditName: false,
                        visible: retVal.Konvalayer.visible,
                        selected: retVal.Konvalayer.selected,
                        showChildren: retVal.Konvalayer.showChildren,
                        drawType: "group",
                        locked: true,
                        parent: retVal.layerTreeItem
                    })

                    self.departmentTree.children.push(retVal.layerTreeItem)
                    self.departmentLayer.add(retVal.Konvalayer)
                    callback(retVal)
                } else {
                    callback(retVal)

                }
            },
            getDepartment(planoID, callback) {
                let self = this
                console.log("getDepartment", planoID);

                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API + `Planogram/department?ID=${planoID}`).then(r => {
                    self.createDepartment(r.data, departmentLayers => {
                        callback(departmentLayers)
                    })

                })
            },
            GetTransformedMousePoint(stage) {
                let transform = stage.getAbsoluteTransform().copy();
                // to detect relative position we need to invert transform
                transform.invert();
                // now we find relative point
                let pos = stage.getPointerPosition();
                let dropPos = transform.point(pos);

                return dropPos;
            },
            drawSaved(cb, ev) {
                let self = this

                self.getDepartment(cb.planogram_ID, depart => {

                    self.getSavedData(cb.id, data => {
                        let container = self.stage.container().getBoundingClientRect();
                        self.stage._setPointerPosition(ev);
                        let dropPos = self.GetTransformedMousePoint(self.stage);

                        let group = new Konva.Group({
                            name: cb.planogram_Name,
                            type: "planogramGroup",
                            visible: true,
                            showEditName: false,
                            selected: true,
                            showChildren: false,
                            draggable: true,
                            locked: true,
                            drawType: "group",
                            isPlanogram: true,
                        })

                        let layertreeitem = new treeItem({
                            KonvaID: group._id,
                            children: [],
                            name: cb.planogram_Name,
                            showEditName: false,
                            visible: group.visible,
                            selected: group.selected,
                            showChildren: group.showChildren,
                            drawType: "group",
                            locked: true,
                            parent: depart.layerTreeItem
                        })
                        let tmplayer = self.selectedLayer
                        let tmplayertreeitem = self.selectedLayerTree
                        depart.layerTreeItem.children.push(layertreeitem)
                        depart.Konvalayer.add(group);
                        self.selectedLayerTree = layertreeitem
                        self.selectedLayer.draw();
                        data.forEach((item, idx) => {
                            self.addShape(group, item, idx, dropPos, callback => {
                                self.stage.batchDraw()
                                self.departmentLayer.draw()
                            })

                        })
                        self.selectLayer(self.departmentTree, self.layers, layercb => {
                            self.selectedLayer = tmplayer
                            self.selectedLayerTree = tmplayertreeitem
                            self.stage.batchDraw()

                        })


                    })
                })
            },
            getSavedData(header, callback) {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API +
                    `FloorplanItems/Exisitng?headerID=${header}`).then(r => {

                    callback(r.data)
                })
            },
            acceptDrag(ev) {
                ev.preventDefault();
            },
            drawLibraryFixture(ev, libraryItem) {
                let self = this
                let container = self.stage.container().getBoundingClientRect();
                self.stage._setPointerPosition(ev);
                let dropPos = self.GetTransformedMousePoint(self.stage);
                let rect = new Rect(self.fixtureLayer, {
                    x: dropPos.x,
                    y: dropPos.y
                }, null, null);

                self.fixtureTree.children.push(new treeItem({
                    KonvaID: rect.shape._id,
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    draggable: true,
                    name: "rect-group",
                    children: [],
                    parent: self.fixtureTree
                }))
                let height = (libraryItem.data.depth / 100) * (self.meterRatio * self.floorConfig.blockRatio)
                let width = (libraryItem.data.width / 100) * (self.meterRatio * self.floorConfig.blockRatio)
                let depth = (libraryItem.data.height / 100) * (self.meterRatio * self.floorConfig.blockRatio)

                rect.shape.setAttrs({
                    height: height,
                    width: width,
                    depth: depth,
                    type: "fixture"
                })
                self.selectLayer(self.fixtureTree, self.layers, layerCB => {

                })
                self.stage.batchDraw()

            },
            checkForHeader(item, callback) {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.post(process.env.VUE_APP_API + `FloorPlanheader/Exisitng?systemFileID=${item.id}`)
                    .then(
                        r => {
                            callback(r.data)
                        })
            },
            dropDragItem(ev) {
                ev.preventDefault();
                let self = this
                let librarydata = window.library
                if (window.library != null) {
                    if (window.library.type == "CUSTOM_PLANOGRAM") {
                        self.checkForHeader(window.library.data, HeaderCallback => {
                            if (HeaderCallback != null) {
                                self.drawSaved(HeaderCallback, ev)
                            } else {
                                self.getPlanogramData(librarydata.data.id, defaultData => {
                                    if (defaultData != null && defaultData != undefined) {
                                        self.drawDefaultSpace(defaultData, ev)
                                    } else {
                                        alert("No fixture setup found for spaceplan")
                                    }
                                })
                            }
                        })
                    } else {
                        self.drawLibraryFixture(ev, window.library, cb => {
                            window.libraryDrag = null
                            window.library = null
                        })
                    }
                } else {
                    self.drawSaved(window.libraryDrag)
                }
            },
            getPlanogramData(id, callback) {
                let self = this

                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API +
                    `Planogram_Details/BysystemFileID?systemFile_ID=${id}`).then(resp => {
                    axios.get(process.env.VUE_APP_API +
                        `FloorPlan_Fixtures/GetFixtures?planogramDetail_ID=${resp.data.id}`).then(
                        r => {
                            callback({
                                plano: resp.data,
                                data: r.data
                            })
                        })
                })


            },
            drawDefaultSpace(data, ev) {
                let self = this
                let widthInc = 0
                let lastPos = ev.x
                let meters = self.meterRatio
                if (self.floorConfig.blockRatio == 1) {
                    meters = 1
                } else {
                    meters = self.meterRatio
                }
                console.log("drawDefaultSpace[DATA]", data);


                self.getDepartment(data.plano.id, depart => {
                    let container = self.stage.container().getBoundingClientRect();
                    self.stage._setPointerPosition(ev);
                    let dropPos = self.GetTransformedMousePoint(self.stage);

                    let group = new Konva.Group({
                        name: data.plano.planogramName,
                        type: "planogramGroup",
                        visible: true,
                        showEditName: false,
                        selected: true,
                        showChildren: false,
                        draggable: true,
                        locked: true,
                        drawType: "group",
                        isPlanogram: true,
                    })

                    let layertreeitem = new treeItem({
                        KonvaID: group._id,
                        children: [],
                        name: data.plano.planogramName,
                        showEditName: false,
                        visible: group.visible,
                        selected: group.selected,
                        showChildren: group.showChildren,
                        drawType: "group",
                        locked: true,
                        parent: depart.layerTreeItem
                    })
                    let tmplayer = self.selectedLayer
                    let tmplayertreeitem = self.selectedLayerTree
                    depart.layerTreeItem.children.push(layertreeitem)
                    console.log("{OPEN DEFAULT SPACE}   dragged department", depart.Konvalayer);

                    depart.Konvalayer.add(group);
                    self.selectedLayerTree = layertreeitem
                    self.selectedLayer.draw();
                    data.data.forEach((element, idx) => {

                        if (element.shape == "Circle") {
                            let circle = new Circle(group, {
                                x: ev.x,
                                y: ev.y + 0,
                            }, null, {
                                radius: (element.width / 4) * (self.floorConfig.blockRatio *
                                        meters)
                                    .toFixed(2),
                                color: "#1976d2"
                            });
                            circle.shape.setAttrs({
                                width: (element.width / 4) * (self.floorConfig.blockRatio *
                                        meters)
                                    .toFixed(2),
                                DropID: element.id.toString(),
                                x: lastPos,
                                y: ev.y
                            })
                            circle.shape.attrs.DropID = element.id.toString()
                            lastPos = circle.shape.attrs.x + (element.width / 4) * (self.floorConfig
                                .blockRatio *
                                meters).toFixed(2)
                            layertreeitem.children.push(new treeItem({
                                KonvaID: circle.shape._id,
                                visible: true,
                                showEditName: true,
                                selected: true,
                                showChildren: false,
                                draggable: false,
                                name: "circle",
                                children: [],
                                parent: layertreeitem
                            }))
                            circle.shape.draggable(true)
                        } else {
                            element.shape = "Square"
                            let rect = new Rect(group, {
                                x: ev.x,
                                y: ev.y,
                            }, null, null, null, self.imageSrc(element
                                .id,
                                "Top"));
                            rect.shape.setAttrs({
                                width: (element.width / 4) * (self.floorConfig.blockRatio *
                                        meters)
                                    .toFixed(2),
                                height: (element.height / 4) * (self.floorConfig.blockRatio *
                                        meters)
                                    .toFixed(2),
                                draggable: false
                            })
                            rect.shape.setAttrs({
                                x: lastPos,
                                y: ev.y
                            })

                            rect.shape.setAttrs({
                                width: (element.width / 4) * (self.floorConfig.blockRatio *
                                        meters)
                                    .toFixed(2),
                                height: (element.height / 4) * (self.floorConfig.blockRatio *
                                        meters)
                                    .toFixed(2),
                            })
                            rect.shape.saveID = element.id
                                .toString()
                            lastPos = rect.shape.attrs.x + (element.width / 4) * (self.floorConfig
                                .blockRatio *
                                meters).toFixed(2)
                            rect.shape.draggable(false)
                            layertreeitem.children.push(new treeItem({
                                KonvaID: rect.shape._id,
                                visible: true,
                                showEditName: true,
                                selected: true,
                                showChildren: false,
                                draggable: true,
                                name: "rect-group",
                                children: [],
                                parent: layertreeitem
                            }))
                        }
                        widthInc = (element.width / 4) * (self.floorConfig.blockRatio * meters)

                        self.stage.batchDraw()
                        self.$refs.spinner.hide()

                    })
                })
            },
            MoveLayerTopTop(event) {
                let self = this
                // if(self.dragStartIndex<1){
                //     return
                // }
                let tmptreeItem = self.layerTree.splice(self.dragStartIndex, 1)
                self.layerTree.unshift(tmptreeItem[0]);
                // self.layerTree.splice(0, 0, tmpt0reeItem);
            },
            applyProperties(event, field) {
                let self = this
                self.$nextTick(() => {
                    self.makeChanges(field, callback => {
                        self.stage.batchDraw()
                        self.$nextTick(() => {
                            self.makingChanges = false
                            console.log("batchDraw");
                            self.selectedItem.draw()
                            self.stage.batchDraw()
                        })
                    })
                })

            },
            makeChanges(field, callback) {
                let self = this
                self.makingChanges = true
                let dimension = null
                if (self.selectedItem.attrs.name == "group" || self.selectedItem.attrs.name == "Duplication Group") {
                    let tr = self.stage.find("Transformer")
                    console.log('tr', tr);
                    console.log('si', self.selectedItem);
                    // calcCenterRotation(self.selectedItem, parseFloat(self.properties.rotation))
                    // let dimension = node.getClientRect()

                    self.selectedItem.rotation(parseFloat(self.properties.rotation))
                } else {
                    self.selectedItem.rotation(parseFloat(self.properties.rotation))
                }
                self.selectedItem.attrs.radius = parseFloat(self.properties.radius) * (self.meterRatio *
                    self
                    .floorConfig.blockRatio)
                self.selectedItem.attrs.fill = self.properties.fill * (self.meterRatio * self.floorConfig
                    .blockRatio)
                self.selectedItem.attrs.depth = self.properties.depth * (self.meterRatio * self.floorConfig
                    .blockRatio)


                self.selectedItem.attrs["fill"] = self.properties["fill"]
                if (self.selectedItem.attrs.name == "image") {
                    self.selectedItem.attrs.keepAspectRatio = self.keepAspectRatio
                    if (self.selectedItem.attrs.keepAspectRatio == true) {
                        if (field == "height") {
                            // adjusted height = <user-chosen width> * original height / original width
                            self.selectedItem.attrs.width = (parseFloat(self.properties.height) * (self.meterRatio *
                                    self.floorConfig.blockRatio)) * self.selectedItem.attrs.width / self.selectedItem
                                .attrs.height

                            self.selectedItem.attrs.height = parseFloat(self.properties.height) * (self.meterRatio *
                                self.floorConfig.blockRatio)
                        }
                        if (field == "width") {
                            self.selectedItem.attrs.height = (parseFloat(self.properties.width) * (self.meterRatio *
                                    self.floorConfig.blockRatio)) * self.selectedItem.attrs.height / self.selectedItem
                                .attrs.width
                            self.selectedItem.attrs.width = parseFloat(self.properties.width) * (self
                                .meterRatio *
                                self
                                .floorConfig
                                .blockRatio)
                        }
                    } else {
                        self.selectedItem.attrs.height = parseFloat(self.properties.height) * (self
                            .meterRatio * self
                            .floorConfig
                            .blockRatio)
                        self.selectedItem.attrs.width = parseFloat(self.properties.width) * (self
                            .meterRatio * self
                            .floorConfig
                            .blockRatio)
                    }
                } else {
                    self.selectedItem.attrs.height = parseFloat(self.properties.height) * (self.meterRatio *
                        self
                        .floorConfig
                        .blockRatio)
                    self.selectedItem.attrs.width = parseFloat(self.properties.width) * (self.meterRatio *
                        self
                        .floorConfig
                        .blockRatio)
                }

                console.log("[AFTER CHANEGES APPLIED ]", self.selectedItem);
                callback()
            },
            applyBrushProperties(tool) {
                let self = this
                switch (tool) {
                    case "crop_square": {
                        self.brush.height = 50
                        self.brush.width = 50
                    }
                    break;
                case "fiber_manual_record": {
                    self.brush.radius = 50
                }
                break;
                case "show_chart": {
                    self.brush.height = 6.25
                }
                break;
                default:
                    break;
                }
            },
            resetStageScale() {
                let self = this
                self.stage.scale({
                    x: 1,
                    y: 1
                });
                var newPos = {
                    x: 0,
                    y: 0
                };
                self.stage.position(newPos);
                self.stage.batchDraw()
            },
            selectItemFromSidePanel(item) {
                let self = this
                console.log("selectItemFromSidePanel", item);

                self.findKonvaItem(self.stage.children, item.KonvaID, e => {
                    if (e.attrs.drawType == "Layer") {
                        return
                    }
                    clickTapHelper.destroyTransformer(self.stage, cb => {
                        self.clickselect(e, callback => {

                        })
                        // clickTapHelper.setSelectedItem(e, self.findLayerItem, self
                        //     .selectedLayerTreeItem, self.selectedItem, self.selectedLayer, self
                        //     .layerTree, cb => {
                        //         console.log("self.selectedLayerTreeItem",cb);

                        //         self.selectedLayerTreeItem = cb
                        //     })
                    })
                    self.selectedLayerTreeItem = item
                    self.resetDuplication()

                    if (self.selectedTool == "open_with") {

                        if (e != self.stage) {
                            self.selectedItem = e;
                            self.properties.name = self.selectedItem.attrs.name;
                            self.properties.height = (self.selectedItem.attrs.height / (self.meterRatio *
                                self.floorConfig.blockRatio)).toFixed(2);
                            self.properties.width = (self.selectedItem.attrs.width / (self.meterRatio * self
                                .floorConfig.blockRatio)).toFixed(2);
                            self.properties.fill = self.selectedItem.attrs.fill;
                            self.properties.depth = self.selectedItem.attrs.depth / (self.selectedItem.attrs
                                .radius / (self.meterRatio *
                                    self.floorConfig.blockRatio)).toFixed(2);

                            self.properties.radius = (self.selectedItem.attrs.radius / (self.meterRatio *
                                self.floorConfig.blockRatio)).toFixed(2);
                            self.properties.rotation = self.selectedItem.attrs.rotation;
                            if (self.selectedItem.attrs.name == "image") {
                                self.selectedItem.attrs.keepAspectRatio = self.keepAspectRatio
                            }
                            var tr
                            if (self.selectedItem.attrs.name == "image") {
                                if (self.selectedItem.attrs.keepAspectRatio != true) {
                                    tr = new Konva.Transformer({
                                        enabledAnchors: ["top-left", "top-center", "top-right",
                                            "middle-right", "middle-left", "bottom-left",
                                            "bottom-center", "bottom-right"
                                        ],
                                    });
                                } else {
                                    tr = new Konva.Transformer({
                                        enabledAnchors: ['top-left', 'top-right', 'bottom-left',
                                            'bottom-right'
                                        ],
                                    });
                                }

                            } else {
                                tr = new Konva.Transformer({
                                    enabledAnchors: self.selectedItem.attrs.enabledAnchors,
                                });
                            }

                            if (self.selectedItem.attrs.name == "Gondola-Rect" || self.selectedItem.attrs
                                .name ==
                                "image" || self.selectedItem.attrs.name == "Label") {
                                tr.rotateEnabled(true);

                            } else {
                                tr.rotateEnabled(false);
                            }

                            self.selectedLayer.add(tr);
                            tr.attachTo(e);
                            self.selectedLayer.draw();

                            tr.on('transform', function (z) {
                                transFormerHelper.handleTransform(e, z, self.handleSnapping, self.stage,
                                    self.lastPosition, self.ctrlDown, self.selectedItem,
                                    rotateAroundCenter, self.transformProperties)
                            });

                            tr.on('transformend', function () {
                                transFormerHelper.handleTransformEnd(self.selectedItem, self.properties,
                                    (self.meterRatio * self.floorConfig.blockRatio))
                                self.stage.batchDraw();
                            });
                        }
                    }

                })
            },
            getItemFromArr(arr, id, prop, callback) {
                let self = this
                arr.forEach((item, idx) => {
                    if (item[prop] == id) {
                        callback({
                            item: item,
                            idx: idx
                        })
                    }
                })
            },
            moveSelectedBack() {
                let self = this
                if (self.selectedLayer.children.length > 1) {
                    self.getItemFromArr(self.selectedLayer.children, self.selectedItem._id, "_id", konvaCallback => {
                        self.getItemFromArr(self.selectedLayerTree.children, self.selectedItem._id, "KonvaID",
                            treeCallback => {
                                arraymove(self.selectedLayer.children, konvaCallback.idx, konvaCallback
                                    .idx - 1)
                                arraymove(self.selectedLayerTree.children, treeCallback.idx, treeCallback
                                    .idx - 1)
                                self.selectedLayer.draw()
                            })
                    })
                }
            },
            moveSelectedForward() {
                let self = this
                if (self.selectedLayer.children.length > 1) {
                    self.getItemFromArr(self.selectedLayer.children, self.selectedItem._id, "_id", konvaCallback => {
                        self.getItemFromArr(self.selectedLayerTree.children, self.selectedItem._id, "KonvaID",
                            treeCallback => {
                                arraymove(self.selectedLayer.children, konvaCallback.idx, konvaCallback
                                    .idx + 1, self.selectedLayer.children.length + 1)
                                arraymove(self.selectedLayerTree.children, treeCallback.idx, treeCallback
                                    .idx + 1, self.selectedLayerTree.children.length)
                                self.selectedLayer.draw()
                            })
                    })
                }
            },
            resetDuplication() {
                let self = this
                self.duplicationSequence.up = 1
                self.duplicationSequence.down = 1
                self.duplicationSequence.right = 1
                self.duplicationSequence.left = 1
            },
            toggleLock(layer) {
                let self = this
                self.stage.batchDraw()
                self.findKonvaItem([self.stage], layer.KonvaID, KonvaEndcallback => {
                    KonvaEndcallback.draggable(true)
                    KonvaEndcallback.children.forEach(child => {
                        child.draggable(layer.locked)
                    })
                })
            },
            openSpaceDesigner() {
                let self = this
                self.$refs.PlanogramDetailsSelector.show(null, false, null, spacePlanID => {

                    self.$router.push("/FloorplanDesigner/" + spacePlanID.id)
                })
            },
            onToolChange(tool) {
                let self = this
                self.$nextTick(() => {

                    self.selectedTool = tool
                    self.applyBrushProperties(tool)
                    if (self.selectedTool == "open_with") {
                        self.selectedLayer.children.forEach(child => {
                            child.draggable(true);
                        })
                    } else {

                        self.selectedLayer.children.forEach(child => {
                            child.draggable(false);
                        })
                    }
                    switch (self.selectedTool) {
                        case "open_with":
                            self.snackbarText = "Click and drag items to move them"
                            self.snackbar = true
                            break;
                        case "crop_square":
                            self.snackbarText = "Click on stage to add a Block"
                            self.snackbar = true
                            self.brush.color = "#1976d2"
                            break;
                        case "fiber_manual_record":
                            self.snackbarText = "Click and drag on the stage to add Circle"
                            self.snackbar = true
                            self.brush.color = "#00ff00"

                            break;
                        case "show_chart":
                            self.snackbarText = "Click and drag on the stage to add a wall"
                            self.snackbar = true
                            self.brush.color = "#808080"
                            break;
                        case "image":
                            self.snackbarText = "Click on the stage to add an image"
                            self.snackbar = true
                            break;
                        case "local_offer":
                            self.snackbarText = "Click and drag on the stage to add a label"
                            self.snackbar = true
                            break;
                        case "arrow_upward":
                            self.snackbarText = "Click and drag on the stage to add an arrow"
                            self.snackbar = true
                            break;
                        case "linear_scale":
                            self.snackbarText = "Add tape measure to stage"
                            self.snackbar = true
                            self.addTapeMeasure()
                            break;
                        case "tab_unselected":
                            self.snackbarText = "Drag to draw area"
                            self.snackbar = true
                            break;


                        default:
                            break;
                    }
                })
            },
            addTapeMeasure() {
                let self = this
                if (self.hasTape != null) {
                    return
                }
                let image = new StageImage(self.departmentLayer, self.imagePos);

                self.departmentTree.children.push(new treeItem({
                    KonvaID: image.shape._id,
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    draggable: true,
                    name: "Tape",
                    children: [],
                    parent: self.departmentTree
                }))

                var imageObj = new Image();

                imageObj.onload = function () {
                    image.shape.image(imageObj);
                    self.departmentLayer.draw();
                    self.onToolChange("open_with")
                    self.imagePos.x = 0
                    self.imagePos.y = 0

                    image.shape.draggable(true)
                    image.shape.attrs.width = parseFloat(self.meterRatio) * parseFloat(self.floorConfig
                        .blockRatio) * 23.48
                    image.shape.attrs.height = parseFloat(self.meterRatio) * parseFloat(self.floorConfig
                        .blockRatio) * 2
                    image.shape.attrs.name = "Tape"
                    self.stage.batchDraw()

                }
                imageObj.src = "/20M Tape with Head.png";
                self.hasTape = image

            },
            swapIndex(item, layers, idx) {
                let self = this
                var KonvaEnditem
                var konvaItem
                let tmp = self.dragItem
                self.findKonvaItem([self.stage], item.KonvaID, KonvaEndcallback => {
                    KonvaEnditem = KonvaEndcallback
                    self.findKonvaItem([self.stage], tmp.KonvaID, konvaItemcallback => {
                        konvaItem = konvaItemcallback
                        if (self.dragParent != null) {
                            self.dragParent.splice(self.dragidx, 1)
                            layers.splice(idx, 0, self.dragItem);
                            let sad = konvaItem.parent.children.splice(self.dragidx, 1)
                            let asd = KonvaEnditem.parent.children.splice(idx, 0, konvaItem)
                            self.dragItem = null
                            self.dragParent = null
                            self.dragidx = null
                        }

                    })
                })
            },
            endDrag(item, parent) {
                let self = this
                if (self.dragItem != null && item != null && self.dragItem != item) {
                    item.children.push(self.dragItem)
                    self.selectLayer(item, parent, layerCB => {

                    })
                    self.dragParent.splice(self.dragidx, 1)
                    var KonvaEndLayer
                    var konvaItem
                    self.findKonvaItem([self.stage], item.KonvaID, KonvaEndcallback => {
                        KonvaEndLayer = KonvaEndcallback
                        self.findKonvaItem([self.stage], self.dragItem.KonvaID, konvaItemcallback => {
                            konvaItem = konvaItemcallback
                            KonvaEndLayer.children.push(konvaItem)
                            konvaItem.parent = KonvaEndLayer
                            self.KonvaLayerDragStart.children.forEach((item, idx) => {
                                if (item._id == konvaItem._id) {
                                    self.KonvaLayerDragStart.children.splice(idx, 1)
                                }
                            })
                            self.dragItem = null
                            self.dragParent = null
                            self.dragidx = null
                        })
                    })
                }
            },
            startDrag(item, idx, layers) {
                let self = this
                self.dragItem = item
                self.dragStartIndex = idx
                var Konvaitem
                self.findKonvaItem([self.stage], item.KonvaID, Konvaitemcallback => {
                    Konvaitem = Konvaitemcallback
                    self.findKonvaItem([self.stage], Konvaitem.parent._id, KonvaLayerDragStart => {
                        self.KonvaLayerDragStart = KonvaLayerDragStart
                        self.dragParent = layers
                        self.dragidx = idx
                    })
                })
            },
            log() {
                let self = this
                console.log("log", self.stage);
                console.log("logTree", self.layerTree);

            },
            updateSnappingAngles() {
                let self = this;

                self.$nextTick(() => {
                    let finalValue = 180;
                    let incrementAmount = self.brush.snapOption;
                    let incrementValue = -180;

                    self.brush.snappingAngles = [];

                    while (incrementValue <= finalValue) {
                        self.brush.snappingAngles.push(incrementValue);
                        incrementValue += incrementAmount;
                    }
                })
            },
            addImage(dataUrl, file) {
                let self = this;
                let image = new StageImage(self.selectedLayer, self.imagePos);

                self.selectedLayerTree.children.push(new treeItem({
                    KonvaID: image.shape._id,
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    draggable: true,
                    name: "Image",
                    children: [],
                    parent: self.selectedLayerTree
                }))
                image.shape.attrs.refFile = file
                image.shape.attrs.keepAspectRatio = true
                var imageObj = new Image();

                imageObj.onload = function () {
                    image.shape.image(imageObj);
                    self.selectedLayer.draw();
                    self.onToolChange("open_with")
                    self.imagePos.x = 0
                    self.imagePos.y = 0

                    image.shape.draggable(true)
                    image.shape.attrs.width = image.shape.attrs.image.width
                    image.shape.attrs.height = image.shape.attrs.image.height
                }
                imageObj.src = dataUrl;


            },
            selectImage() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onFileChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];

                blobToDataUrl(file, dataUrl => {
                    self.addImage(dataUrl, file)
                })
            },
            editLayerName(layer, name) {
                let self = this

                // let tmpItems = self.stage.find(".EnterName")
                self.findKonvaItem([self.stage], layer.KonvaID, callback => {
                    callback.attrs.name = name
                })

                // tmpItems.forEach(item => {
                //     if (layer.KonvaID == item._id) {
                //         item.setAttrs({
                //             name: name
                //         })
                //         item.attrs.name = name
                //     }
                // })
            },
            addLayer() {
                let self = this;

                let layer = new Konva.Layer({
                    name: "",
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer",
                    type: "Layer"
                })

                layer.attrs.name = "Enter Name" + layer._id

                self.layers.forEach(el => {
                    el.attrs.selected = false;
                })

                let layertreeitem = new treeItem({
                    KonvaID: layer._id,
                    children: [],
                    name: "Layer",
                    showEditName: true,
                    visible: layer.visible,
                    selected: layer.selected,
                    showChildren: layer.showChildren,
                    drawType: "Layer"
                })

                self.layerTree.push(layertreeitem)



                self.layers.unshift(layer);
                self.stage.add(layer);
                self.selectLayer(layertreeitem, self.layerTree, layerCB => {

                })
                self.$refs.RecursiveLayer.focusRename(layer._id)
            },
            addGroup() {
                let self = this;
                let group = new Konva.Group({
                    name: "group",
                    visible: true,
                    showEditName: false,
                    selected: true,
                    showChildren: true,
                    draggable: true,
                    locked: true,
                    drawType: "group",
                    type: "group",
                })

                let layertreeitem = new treeItem({
                    KonvaID: group._id,
                    children: [],
                    name: "Group",
                    showEditName: false,
                    visible: group.visible,
                    selected: group.selected,
                    showChildren: group.showChildren,
                    drawType: "group",
                    locked: true,
                    parent: self.selectedLayerTree
                })

                self.selectedLayerTree.children.push(layertreeitem)
                self.selectedLayer.draw();
            },
            selectLayer(layer, parent, callback) {
                let self = this;

                self.$nextTick(() => {

                    self.selectedLayer.children.forEach(child => {

                        child.draggable(false);
                    })
                    self.findKonvaItem([self.stage], layer.KonvaID, callback => {
                        self.selectedLayerTree = layer
                        self.selectedLayer = callback;
                        if (self.selectedLayer.attrs.drawType == "group") {
                            self.findparentLayer(callback)
                        }
                        if (parent != undefined) {
                            // parent.forEach(el => {
                            //     el.selected = false;
                            //     el.children.forEach(child => {
                            //         child.draggable(false);
                            //     })
                            // })
                        }
                        layer.selected = true;

                        if (self.selectedLayer.attrs.name == "Duplication Group") {

                        } else {
                            self.selectedLayer.children.forEach(child => {
                                child.draggable(true)
                            })
                        }

                    })
                    if (self.hasTape != null) {
                        console.log("self.hasTape", self.hasTape);
                        self.hasTape.shape.attrs.draggable = true
                    }
                    self.stage.batchDraw()
                    callback()
                })
            },
            duplicateDrag(e) {
                let self = this
                let duplicationHelper = new DuplicationHelper();
                let groupDuplicationHelper = new GroupDuplicationHelper();
                let layerTree
                switch (e.target.attrs.name) {
                    case "Gondola-Rect":
                        duplicationHelper.DuplicateRectGroupDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree, )

                        break;

                    case "circle":
                        duplicationHelper.DuplicateCircleDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree)

                        break;
                    case "wall":
                        duplicationHelper.DuplicateWallDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree)

                        break;

                    case "image":
                        duplicationHelper.DuplicateImageDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree)
                        break;
                    case "group": {
                        console.log("[SELECTED LAYERTREE] group", self.selectedLayerTree);
                        if (self.selectedLayerTree.parent != undefined) {
                            groupDuplicationHelper.duplicateGroupDrag(e.target, self.selectedLayerTree.parent)
                        } else {
                            groupDuplicationHelper.duplicateGroupDrag(e.target, self.selectedLayerTree)
                        }
                    }
                    break
                case "Duplication Group": {
                    console.log("[SELECTED LAYERTREE] Duplication Grou", self.selectedLayerTree);
                    if (self.selectedLayerTree.parent != undefined) {
                        groupDuplicationHelper.duplicateGroupDrag(e.target, self.selectedLayerTree.parent)
                    } else {
                        groupDuplicationHelper.duplicateGroupDrag(e.target, self.selectedLayerTree)
                    }
                }
                break


                default:
                    break;
                }

            },
            scaleSelected(Inputlength) {
                let self = this
                let useRotated = false
                if (self.selectedItem == null) {
                    self.dotted.shape.destroy()
                    self.dotted = null
                    self.stage.batchDraw()
                    return
                }
                if (self.selectedItem.attrs.name != 'image') {
                    return
                }
                let rotation = self.dotted.shape.attrs.rotation
                if (rotation == 180 || rotation == -180 || rotation == 0) {
                    rotation = 90
                    useRotated = true
                } else {
                    if (Math.abs(rotation) > 90) {
                        rotation = Math.abs(rotation) - 90

                    }
                }


                let angle = rotation * (180 / Math.PI);
                let metersInPX = (self.meterRatio * self.floorConfig.blockRatio) * Inputlength

                let dottedHeight = Math.abs((metersInPX) * Math.sin(angle))
                let dottedWidth = Math.abs((metersInPX) * Math.cos(angle))


                var heightRatio = dottedHeight / self.selectedItem.attrs.height
                var WidthRatio = dottedHeight / self.selectedItem.attrs.width

                let newHeight = self.selectedItem.attrs.height * Math.abs(heightRatio)
                let newWidth = self.selectedItem.attrs.width * Math.abs(WidthRatio)
                if (rotation == 90 || rotation == -90) {
                    let dottedHeightratio = self.dotted.shape.attrs.width / self.selectedItem.attrs.height
                    if (!useRotated) {
                        self.selectedItem.setAttrs({
                            height: Math.abs(newHeight),
                            width: Math.abs(self.dotted.shape.attrs.width * heightRatio)
                        })
                    } else {
                        self.selectedItem.setAttrs({
                            height: Math.abs(self.dotted.shape.attrs.width * heightRatio),
                            width: Math.abs(newHeight)
                        })
                    }
                    self.dotted.shape.destroy()
                    self.dotted = null
                    self.stage.batchDraw()
                    return
                }

                if (rotation != 180 && rotation != -180 && rotation != 90 && rotation != -90 && rotation != 0) {

                    if (!useRotated) {
                        self.selectedItem.setAttrs({
                            height: Math.abs(newHeight),
                            width: Math.abs(self.dotted.shape.attrs.width * heightRatio)
                        })
                    } else {
                        self.selectedItem.setAttrs({
                            height: Math.abs(self.dotted.shape.attrs.width * heightRatio),
                            width: Math.abs(newHeight)
                        })
                    }
                }
                self.dotted.shape.destroy()
                self.dotted = null
                self.stage.batchDraw()

            },
            onContextMenu(e, item) {
                let self = this;
                self.showMenu = false
                self.x = e.evt.clientX
                self.y = e.evt.clientY
                self.$nextTick(() => {
                    self.stage.find('Transformer').destroy()
                    self.showMenu = true
                })
            },
            clearMultiselect(e) {
                let self = this
                if (self.multiSelectGroup != null) {
                    let multiSelectHelper = new MultiSelectHelper()
                    multiSelectHelper.clearMultiselect({
                            target: self.multiSelectGroup
                        }, self.multiSelectGroup, self.stage,
                        callback => {
                            self.multiSelectGroup.destroy()
                            self.multiSelectGroup = null
                            self.stage.find('Transformer').destroy()
                            self.stage.batchDraw()
                        })
                }

            },
            handleMultiSelect(item, callback) {
                let self = this
                // if (!item.attrs.draggable) {
                //     console.log("[HANDLEMULTI SELECTE INDEX]------not raggable");

                //     callback()
                // }
                self.clickFindParentLayer(item, layerchild => {
                    let multiSelectHelper = new MultiSelectHelper()
                    let muitiParent = null
                    if (layerchild.drawType == "Layer") {
                        muitiParent = layerchild
                    } else {
                        muitiParent = layerchild.parent
                    }
                    console.log("[handleMultiSelect]-----layerchild", layerchild);

                    multiSelectHelper.handleMultiselect(self.multiSelectGroup, muitiParent, item, self
                        .stage,
                        cb => {
                            self.multiSelectGroup = cb
                            self.selectedLayer.draw()
                            callback(cb)
                        })
                })


            },
            clickselect(item, callback) {
                let self = this
                self.showRotation = true;
                switch (item.parent.attrs.name) {
                    case "Building": {
                        self.selectLayer(self.buildingLayerTree, self.layerTree, layerCB => {
                            callback(item)
                        })
                    }
                    break;

                case "Background": {
                    self.selectLayer(self.backgroundTree, self.layerTree, layerCB => {
                        callback(item)
                    })
                }
                break;

                case "Areas": {
                    self.selectLayer(self.areaLayerTree, self.layerTree, LayerCB => {
                        callback(item)
                    })
                }
                break;

                case "Fixtures": {
                    self.selectLayer(self.fixtureTree, self.layerTree, LayerCB => {
                        callback(item)
                    })
                }
                break;

                case "Department": {
                    self.selectLayer(self.departmentTree, self.layerTree, layerCB => {
                        callback(item)
                    })
                }
                break;

                case "Duplication Group": {
                    if (item.parent.attrs.rotation == 0)
                        self.showRotation = false;
                    self.clickSelectFindCurrentParent(item, cbitem => {
                        self.findLayerItem(self.layerTree, cbitem._id, cb => {
                            self.selectLayer(cb, self.layerTree, layerCB => {
                                cbitem.draggable(true)
                                if (cbitem.children.length > 0) {

                                    self.setChildrendraggable(cbitem.children)
                                }
                                callback(cbitem)
                            })

                        })
                    })

                }

                break;
                case "MultiSelectGroup": {
                    if (item.parent.attrs.rotation == 0)
                        self.showRotation = false;

                    self.findLayerItem(self.layerTree, item.parent._id, cb => {
                        self.selectLayer(cb, self.layerTree, layerCB => {
                            item.parent.draggable(true)
                            if (cbitem.children.length > 0) {
                                self.setChildrendraggable(cbitem.children)
                            }
                            callback(item.parent)
                        })
                    })
                }

                break;
                case "group": {
                    if (item.parent.attrs.rotation == 0)
                        self.showRotation = false;
                    self.clickSelectFindCurrentParent(item, cbitem => {
                        self.findLayerItem(self.layerTree, cbitem._id, cb => {
                            self.selectLayer(cb, self.layerTree, layerCB => {
                                cbitem.draggable(true)
                                if (cbitem.children.length > 0) {
                                    self.setChildrendraggable(cbitem.children)
                                }
                                callback(cbitem)
                            })
                        })
                    })
                }
                break;
                case "image": {
                    self.selectLayer(self.backgroundTree, self.layerTree, layerCB => {
                        callback(item)
                    })
                }
                break;
                default: {
                    if (item.parent.attrs.isPlanogram) {
                        if (item.parent.attrs.rotation == 0)
                            self.showRotation = false;

                        self.findLayerItem(self.layerTree, item.parent._id, cb => {
                            self.selectLayer(cb, self.layerTree, lasyerCB => {
                                item.parent.draggable(true)
                                item.parent.children.forEach(child => {
                                    child.draggable(false)
                                })
                                callback(item.parent)
                            })
                        })
                    } else {
                        self.selectLayer(self.departmentTree, self.layerTree, layerCB => {
                            callback(item)
                        })
                    }
                }
                break;
                }
            },
            attachGondolaInsideGroup(target, dragItem, group) {
                let self = this
                target.attrs.hasAttached = dragItem.saveID
                dragItem.setAttrs({
                    x: target.attrs.x + group.attrs.x,
                    y: target.attrs.y + group.attrs.y
                })
                self.stage.batchDraw()
            },
            attachGondola(target, dragItem) {
                let self = this
                target.attrs.hasAttached = dragItem.saveID
                dragItem.setAttrs({
                    x: target.attrs.x,
                    y: target.attrs.y
                })
                self.stage.batchDraw()
            },
            clickFindParentLayer(item, callback) {
                let self = this
                if (item.parent.attrs.drawType == "Layer") {
                    callback(item)
                } else {
                    self.clickFindParentLayer(item.parent, cb => {
                        callback(cb)
                    })
                }
            },
            clickSelectFindCurrentParent(item, callback) {
                let self = this
                if (self.selectedItem == null || self.ctrlDown) {
                    self.clickFindParentLayer(item, cb => {
                        callback(cb)
                    })
                } else {
                    if (item.parent == self.selectedItem || item.parent.attrs.drawType == "Layer") {
                        callback(item)
                    } else {
                        self.clickSelectFindCurrentParent(item.parent, cb => {
                            callback(cb)
                        })
                    }
                }
            },
            setChildrendraggable(children) {
                let self = this
                children.forEach(child => {
                    child.draggable(false)
                    if (child.children.length > 0) {
                        self.setChildrendraggable(child.children)
                    }
                })
            },
            addStageEvents() {
                let self = this;
                let isPaint = false;
                self.stage.on('click tap', function (e) {
                    if (e.target == self.stage) {
                        self.selectedItem = null
                    }
                    clickTapHelper.handleClickTap(e.target, self.stage, self
                        .selectedItem, self.clickselect, self
                        .findLayerItem, self.selectedLayerTreeItem, self.properties,
                        self.ctrlDown, self
                        .selectedTool, self.resetDuplication, self
                        .handleMultiSelect, self.layerTree, self
                        .floorConfig, self.meterRatio, self.keepAspectRatio, self
                        .handleSnapping, self
                        .lastPosition, self.transformProperties, self.imagePos, self
                        .selectImage, self
                        .selectedLayer, self.clearMultiselect, cb => {

                            self.selectedItem = cb.selectedItem
                            self.selectedLayerTreeItem = cb.selectedLayerTreeItem
                            if (self.multiSelectGroup != null) {
                                self.multiSelectGroup.draggable(true)
                            }

                        });
                });
                self.stage.on('contextmenu', function (ev) {
                    self.onContextMenu(ev)
                })

                self.stage.on('contentMousedown', function () {
                    dragHandler.handleContentMousedown(self.buildingLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.buildingLayerTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode, self.brush, self, self.dotted, self.area, self
                        .areaLayerTree, self.areaLayer, self.areaTree, callback => {
                            self.wall = callback.wall
                            self.rect = callback.rect
                            self.circle = callback.circle
                            self.textNode = callback.textNode
                            self.arrow = callback.arrow
                            self.arrowStartY = self.firstPosition.y
                            self.arrowStartX = self.firstPosition.x
                            self.dotted = callback.dotted
                            self.area = callback.area
                            self.areaTree = callback.areaTree
                        })
                })

                self.stage.on('contentMouseup', function (e) {
                    if (self.firstPosition.x == 0) {
                        return
                    }
                    dragHandler.handleContentMouseUp(self.backgroundLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.backgroundTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode, self.resetDuplication, self.area, callback => {
                            self.lastPosition = {
                                x: 0,
                                y: 0
                            }
                            self.firstPosition = {
                                x: 0,
                                y: 0
                            }
                            self.arrowStartY = 0
                            self.arrowStartX = 0
                            if (self.selectedTool != "open_with" && self.selectedTool != "show_chart") {
                                if (self.selectedTool == "tab_unselected") {
                                    self.$refs.Prompt.show("", " Area Name",
                                        "Please Enter a  name for area", value => {
                                            self.areaTree.name = value
                                            self.area.shape.attrs.LabelText = value
                                        })
                                }
                                self.onToolChange("open_with")
                            }
                            if (self.dotted != null && self.selectedItem != null) {
                                self.$refs.Prompt.show("", " Line Length",
                                    "Please enter line length in meters", value => {
                                        self.scaleSelected(parseFloat(value))
                                    })
                            }
                        })
                });

                self.stage.on('contentMousemove', function (e) {

                    if (self.firstPosition.x == 0) {
                        return
                    }
                    dragHandler.handleContentMousemove(self.backgroundLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.backgroundTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode, self.ctrlDown, self.handleSnapping, self.brush, self
                        .transformProperties, self.dotted, self.area)

                });
                self.departmentLayer.on('dragmove', function (e) {
                    if (self.selectedTool == "open_with" && e.target.attrs.name != 'Tape') {
                        var target = e.target;
                        var targetRect = e.target.getClientRect();
                        self.fixtureLayer.children.each(function (group) {
                            if (group === target) {
                                return;
                            }
                            if (haveIntersection(group.getClientRect(), targetRect)) {
                                if (group.attrs.name == "group" || group.attrs.name ==
                                    "Duplication Group") {
                                    group.children.each(function (item) {

                                        if (haveIntersection(item.getClientRect(),
                                                targetRect)) {
                                            self.attachGondolaInsideGroup(item, target, group)
                                        }
                                    })
                                } else {
                                    self.attachGondola(group, target)
                                }


                            } else {

                            }
                        });
                    }
                })
                self.stage.on('dragstart', (e) => {
                    if (self.ctrlDown && self.selectedTool == "open_with") {
                        self.duplicateDrag(e)
                    }
                    if (self.selectedTool != "open_with") {
                        self.stage.stopDrag()
                    } else {

                    }
                })

                self.stage.on('dragend', (e) => {
                    if (self.selectedTool != "open_with") {
                        self.stage.stopDrag()
                    } else {
                        self.stage.find('.guid-line').destroy();
                        self.stage.batchDraw();
                        if (e.target.attrs.name == "MultiSelectGroup") {
                            multiSelectHelper.clearMultiselect(e, self.multiSelectGroup, self.stage,
                                callback => {
                                    self.multiSelectGroup.destroy()
                                    self.multiSelectGroup = null
                                    self.stage.find('Transformer').destroy()
                                    self.stage.batchDraw()
                                })
                        }
                        if (e.target.attrs.name == "group" || e.target.attrs.name == "Duplication Group") {
                            self.applyGroupProps(e.target, applyCallback => {
                                e.target.setAttrs({
                                    x: 0,
                                    y: 0,
                                    scaleX: 1,
                                    scaleY: 1,
                                    rotation: 0,
                                })
                            })
                        }
                    }
                })
                var scaleBy = 1.05;
                self.stage.addEventListener('wheel', (e) => {
                    var oldScale = self.stage.scaleX();
                    var mousePointTo = {
                        x: self.stage.getPointerPosition().x / oldScale - self.stage.x() / oldScale,
                        y: self.stage.getPointerPosition().y / oldScale - self.stage.y() / oldScale,
                    };
                    var newScale = (e.deltaY * -1) > 0 ? oldScale * scaleBy : oldScale / scaleBy;
                    self.stage.scale({
                        x: newScale,
                        y: newScale
                    });

                    var newPos = {
                        x: -(mousePointTo.x - self.stage.getPointerPosition().x / newScale) * newScale,
                        y: -(mousePointTo.y - self.stage.getPointerPosition().y / newScale) * newScale
                    };
                    if (self.stage.scaleX() < 1 || self.stage.scaleY() < 1) {
                        self.stage.position({
                            x: 0,
                            y: 0
                        })
                        self.stage.batchDraw();
                    } else {
                        self.stage.position(newPos);
                        self.stage.batchDraw();
                    }
                });
            },
            applyGroupProps(parent, callback) {
                let self = this
                parent.children.forEach((child, index) => {
                    if (child.children.length > 0) {
                        self.applyGroupProps(child, cb => {
                            child.setAttrs({
                                x: 0,
                                y: 0,
                                scaleX: 1,
                                scaleY: 1,
                                rotation: 0,
                            })
                        })
                    } else {
                        const matrix = child.getAbsoluteTransform().getMatrix();
                        const attrs = decompose(matrix);
                        child.setAttrs({
                            x: (attrs.x - self.stage.attrs.x) / self.stage.attrs.scaleX,
                            y: (attrs.y - self.stage.attrs.y) / self.stage.attrs.scaleY,
                            rotation: attrs.rotation,
                        })
                    }
                    if (index + 1 == parent.children.length) {
                        callback()
                    }
                })
            },
            findparentLayer(item) {
                let self = this
                if (item.parent.attrs.drawType == "Layer") {
                    self.groupLayer = item.parent
                } else {
                    self.findparentLayer(item.parent)
                }
            },
            handleSnapping(e) {
                let self = this
                let snappingHandler = new SnappingHandler()
                // clear all previous lines on the screen
                self.stage.find('.guid-line').destroy();
                // find possible snapping lines
                var lineGuideStops = snappingHandler.getLineGuideStops(e, self.stage, self
                    .snapableItems);
                // find snapping points of current object
                var itemBounds = snappingHandler.getObjectSnappingEdges(e, self.stage);
                // now find where can we snap current object
                var guides = snappingHandler.getGuides(lineGuideStops, itemBounds, self.stage);
                // do nothing of no snapping
                if (!guides.length) {
                    return;
                }
                snappingHandler.drawGuides(guides, self.stage, self.selectedLayer);
                // now force object position
                guides.forEach(lg => {
                    if (e.attrs.name != "front-Line" && e.attrs.name != "Gondola-Rect") {
                        switch (lg.snap) {
                            case 'start': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'end': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                });
            },
            addEvents() {
                let self = this;
                document.addEventListener('keydown', function (event) {
                    const key = event.key;
                    switch (key) {
                        case "Delete":
                            if (self.selectedItem != null) {
                                let tmpItem = null
                                if (self.selectedItem.attrs.name == "Tape") {
                                    self.hasTape = null
                                }
                                self.lastdeletedItem.unshift(self.selectedItem)
                                deleteTreeItem(self.layerTree, self.selectedItem._id, self)
                                self.selectedItem.parent.children.forEach((element, idx) => {
                                    if (element._id == self.selectedItem._id) {
                                        tmpItem = self.selectedItem.parent.children.splice(idx, 1)
                                    }
                                })
                                self.stage.find('Transformer').destroy()
                                if (self.lastdeletedItem.length > 50) {
                                    self.lastdeletedItem.splice(50, 1)
                                }
                                if (self.lastDeletedTree.length > 50) {
                                    self.lastDeletedTree.splice(50, 1)
                                }
                                self.stage.batchDraw();
                                self.selectedItem = null;
                                for (var prop in self.properties) {
                                    self.properties[prop] = null
                                }
                            }
                            break;
                        case "Control":
                            self.ctrlDown = true;
                            break;
                        case "z":
                            if (self.ctrlDown && self.lastdeletedItem.length > 0) {
                                self.$nextTick(() => {
                                    let item = self.lastdeletedItem.splice(0, 1)[0]
                                    self.selectedLayer.children.push(item)
                                    self.selectedLayerTree.children.push(self.lastDeletedTree.splice(0,
                                        1)[0])

                                    self.selectedLayer.draw()
                                })
                            }
                            break;
                    }
                });
                document.addEventListener('keyup', function (event) {
                    const key = event.key;
                    switch (key) {
                        case "Control": {
                            self.ctrlDown = false;
                        }
                    }
                });
            },
            setLayerVisible(layer) {
                let self = this;
                let tmpItems = self.stage.find("." + layer.name)
                self.findKonvaItem([self.stage], layer.KonvaID, callback => {
                    if (callback.attrs.visible) {
                        callback.hide();
                        self.setRecursiveVisibility(callback.children, false)
                    } else {
                        callback.show();
                        self.setRecursiveVisibility(callback.children, true)
                    }
                    self.stage.batchDraw()
                })
            },
            setItemVisible(layer) {
                let self = this;
                self.findKonvaItem([self.stage], layer.KonvaID, callback => {
                    layer.visible = !layer.visible
                    if (callback.attrs.visible) {

                        callback.hide();
                    } else {
                        callback.show();
                    }
                    self.stage.batchDraw()
                })
            },
            deleteLayer(layer, parent, idx) {
                let self = this;
                self.findKonvaItem(self.stage.children, layer.KonvaID, callback => {
                    parent.splice(idx, 1)
                    callback.destroy();
                    self.stage.batchDraw();
                    if (self.stage.children.length == 1) {
                        self.addLayer()
                    }
                })
            },
            duplicate(direction) {
                let self = this;
                let duplicationHelper = new DuplicationHelper()
                let groupDuplicationHelper = new GroupDuplicationHelper()
                if (self.selectedItem == null) {
                    return;
                }
                self.stage.find('Transformer').destroy()

                let tr = new Konva.Transformer({
                    enabledAnchors: [],
                });
                tr.rotateEnabled(true);
                switch (self.selectedItem.attrs.name) {
                    case "Gondola-Rect":
                        duplicationHelper.DuplicateRectGroup(self.selectedItem, self.selectedLayer, self
                            .selectedLayerTree, direction, self.duplicationSequence, self.findLayerItem,
                            callback => {
                                self.selectLayer(callback.layer, self.layers, layercb => {
                                    callback.item.parent.add(tr);
                                    tr.attachTo(callback.item)
                                    self.selectedItem = callback.item
                                    self.stage.batchDraw()
                                })
                            })

                        break;

                    case "circle":
                        duplicationHelper.DuplicateCircle(self.selectedItem, self.selectedLayer, self
                            .selectedLayerTree, direction, self.duplicationSequence, callback => {
                                self.selectLayer(callback.layer, self.layers, self.findLayerItem, layercb => {
                                    self.selectedItem = callback.item
                                    callback.item.parent.add(tr);
                                    tr.attachTo(callback.item)
                                    self.stage.batchDraw()

                                })
                            })
                        break;
                    case "wall":
                        duplicationHelper.DuplicateWall(self.selectedItem, self.selectedLayer, self
                            .selectedLayerTree, direction, self.duplicationSequence, callback => {
                                self.selectLayer(callback.layer, self.layers, self.findLayerItem, layercb => {
                                    self.selectedItem = callback.item
                                    callback.item.parent.add(tr);
                                    tr.attachTo(callback.item)
                                    self.stage.batchDraw()

                                })
                            })
                        break;
                    case "group": {
                        groupDuplicationHelper.duplicateGroupDirection(self.selectedItem, self.selectedLayerTree,
                            direction, self.stage, callback => {
                                self.selectedItem = callback
                                callback.parent.add(tr);
                                tr.attachTo(callback)
                                self.stage.batchDraw()

                            })
                    }
                    break;
                case "Duplication Group": {
                    groupDuplicationHelper.duplicateGroupDirection(self.selectedItem, self.selectedLayerTree,
                        direction, self.stage, callback => {
                            self.selectedItem = callback
                            callback.parent.add(tr);
                            tr.attachTo(callback)
                            self.stage.batchDraw()

                        })
                }
                break;



                default:
                    break;
                }
                // switch (direction) {
                //     case "UP":
                //         ++self.duplicationSequence.up
                //         break;
                //     case "DOWN":
                //         ++self.duplicationSequence.down
                //         break;
                //     case "LEFT":
                //         ++self.duplicationSequence.left
                //         break;
                //     case "RIGHT":
                //         ++self.duplicationSequence.right
                //         break;
                //     default:
                //         break;
                // }
            },
            findLayerItem(subMenuItems, id, callback) {
                let self = this
                let retval = null;
                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (item.KonvaID == id) {
                            retval = item
                            callback(item)
                        }
                        if (item.children.length > 0) {
                            self.findLayerItem(item.children, id, recursiveCallback => {
                                callback(recursiveCallback)
                            })
                        }
                    })
                }
            },
            setRecursiveVisibility(subMenuItems, visible) {
                let self = this
                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (!visible)
                            item.hide();
                        else
                            item.show();
                        if (item.children.length > 0) {
                            self.findKonvaItem(item.children, visible)
                        }
                    })
                }
            },
            findKonvaItem(subMenuItems, id, callback) {
                let self = this
                let retval = null;

                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (item._id == id) {
                            retval = item
                            callback(item)
                        }
                        if (item.children.length > 0) {
                            self.findKonvaItem(item.children, id, recursiveCallback => {
                                callback(recursiveCallback)
                            })
                        }
                    })
                }
            },
            drawGrid() {
                let self = this
                var gridLayer = new Konva.Layer();
                gridLayer.attrs.name = "grid"
                let image = new StageImage(gridLayer, {
                    x: 0,
                    y: 0
                });
                var imageObj = new Image();

                imageObj.onload = function () {
                    image.shape.image(imageObj);
                    self.selectedLayer.draw();
                    self.imagePos.x = 0
                    self.imagePos.y = 0
                    image.shape.draggable(false)
                    if (!self.floorConfig.repeat) {
                        image.shape.attrs.width = self.stage.attrs.width
                        image.shape.attrs.height = self.stage.attrs.height
                    }

                    self.stage.batchDraw()
                }
                imageObj.src = self.FloorMediaSrc(self.floorConfig.floorImageID);
                var padding = self.meterRatio * self.floorConfig.blockRatio;

                for (var i = 0; i < self.stage.attrs.width / padding; i++) {
                    gridLayer.add(new Konva.Line({
                        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, self.stage
                            .attrs.height
                        ],
                        stroke: '#ddd',
                        strokeWidth: 2,
                    }));
                }
                gridLayer.add(new Konva.Line({
                    points: [0, 0, 10, 10]
                }));
                for (var j = 0; j < self.stage.attrs.height / padding; j++) {
                    gridLayer.add(new Konva.Line({
                        points: [0, Math.round(j * padding), self.stage.attrs.width, Math.round(j *
                            padding)],
                        stroke: '#ddd',
                        strokeWidth: 2,
                    }));
                }
                self.stage.add(gridLayer);
                gridLayer.setZIndex(0)
                // self.stage.children.unshift(gridLayer)
                self.stage.batchDraw()

            },
            createBaseLayers(callback) {
                let self = this
                let startLayer = new Konva.Layer({
                    name: 'Background',
                    visible: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer",
                    type: "Layer"
                });
                let tmplayertree = new treeItem({
                    KonvaID: startLayer._id,
                    children: [],
                    name: 'Background',
                    visible: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer"
                })
                let areaLayer = new Konva.Layer({
                    name: 'Areas',
                    visible: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer",
                    type: "Layer"
                });
                let areaLayerTree = new treeItem({
                    KonvaID: startLayer._id,
                    children: [],
                    name: 'Areas',
                    visible: true,
                    selected: false,
                    showChildren: false,
                    drawType: "Layer"
                })
                self.areaLayer = areaLayer
                self.areaLayerTree = areaLayerTree
                self.layerTree.push(tmplayertree)
                self.selectedLayerTree = tmplayertree
                self.selectedLayer = startLayer
                self.layers.unshift(startLayer);
                let buildingLayer = new Konva.Layer({
                    name: 'Building',
                    visible: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer",
                    type: "Layer"
                });
                let buildinglayertree = new treeItem({
                    KonvaID: buildingLayer._id,
                    children: [],
                    name: 'Building',
                    visible: true,
                    selected: false,
                    showChildren: false,
                    drawType: "Layer"
                })
                let DepartmentLayer = new Konva.Layer({
                    name: 'Departments',
                    visible: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer",
                    type: "Layer"
                });
                let Depttree = new treeItem({
                    KonvaID: DepartmentLayer._id,
                    children: [],
                    name: 'Departments',
                    visible: true,
                    selected: false,
                    showChildren: false,
                    drawType: "Layer"
                })

                let FixtureLayer = new Konva.Layer({
                    name: 'Fixtures',
                    visible: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer",
                    type: "Layer"
                });
                let FixtureTree = new treeItem({
                    KonvaID: FixtureLayer._id,
                    children: [],
                    name: 'Fixtures',
                    visible: true,
                    selected: false,
                    showChildren: false,
                    drawType: "Layer"
                })
                self.fixtureLayer = FixtureLayer
                self.fixtureTree = FixtureTree
                self.backgroundLayer = startLayer
                self.departmentLayer = DepartmentLayer
                self.departmentTree = Depttree
                self.backgroundTree = tmplayertree
                self.buildingLayer = buildingLayer
                self.buildingLayerTree = buildinglayertree
                self.layerTree.push(areaLayerTree)
                self.layerTree.push(buildinglayertree)

                self.layerTree.push(FixtureTree)
                self.layerTree.push(Depttree)
                self.stage.add(startLayer);
                self.stage.add(areaLayer);
                self.stage.add(buildingLayer);
                self.stage.add(FixtureLayer);
                self.stage.add(DepartmentLayer);
                callback()

            },
        },
        mounted() {
            let self = this;
            self.getStores();
            self.getClusters()
            let container = document.getElementById('stage_container');

            height = container.offsetHeight
            width = container.offsetWidth
            self.floorConfig.floorHeight = height / 25
            self.floorConfig.floorWidth = width / 25
            self.stage = new Konva.Stage({
                container: "container",
                width: width,
                height: height,
                scaleX: 1,
                scaleY: 1,
                draggable: true,
                dragBoundFunc: function (pos) {
                    var newY = pos.y > 0 ? 0 : pos.y;
                    var newX = pos.x > 0 ? 0 : pos.x;
                    return {
                        x: newX,
                        y: newY
                    };
                }
            })
            self.drawGrid()
            self.createBaseLayers(cb => {})
            self.addStageEvents();
            self.addEvents();
            self.updateSnappingAngles();
        }
    }

    const rotatePoint = ({
        x,
        y
    }, rad) => {
        const rcos = Math.cos(rad);
        const rsin = Math.sin(rad);
        return {
            x: x * rcos - y * rsin,
            y: y * rcos + x * rsin
        };
    };

    function decompose(mat) {
        var a = mat[0];
        var b = mat[1];
        var c = mat[2];
        var d = mat[3];
        var e = mat[4];
        var f = mat[5];

        var delta = a * d - b * c;

        let result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };

        // Apply the QR-like decomposition.
        if (a != 0 || b != 0) {
            var r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = Math.atan((a * c + b * d) / (r * r));
            result.scleY = 0;
        } else if (c != 0 || d != 0) {
            var s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s
            result.scaleY = s;
            result.skewX = 0
            result.skewY = Math.atan((a * c + b * d) / (s * s));
        } else {
            // a = b = c = d = 0
        }

        result.rotation *= 180 / Math.PI;
        return result;
    }

    function haveIntersection(r1, r2) {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    function deleteTreeItem(subMenuItems, id, self) {
        if (subMenuItems) {
            subMenuItems.forEach((item, idx) => {

                if (item.KonvaID == id) {
                    let tmp = subMenuItems.splice(idx, 1)
                    self.lastDeletedTree.unshift(tmp[0])
                }
                if (item.children.length > 0) {
                    deleteTreeItem(item.children, id, self)
                }
            })
        }
    }
    // will work for shapes with top-left origin, like rectangle
    function rotateAroundCenter(node, rotation, hyp) {
        //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
        let dimension = node.getBoundingClientRect()

        const right = {
            x: -dimension.width / 2,
            y: -dimension.height / 2
        };
        const current = rotatePoint(right, Konva.getAngle(node.rotation()));
        const rotated = rotatePoint(right, Konva.getAngle(rotation));
        const dx = rotated.x - current.x,
            dy = rotated.y - current.y;
        node.rotation(rotation);

        node.x(node.x() + dx);
        node.y(node.y() + dy);

    }

    function arraymove(arr, fromIndex, toIndex, comparitor) {
        if (fromIndex != toIndex && fromIndex > -1 && toIndex > -1 && toIndex < arr.length + 1) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }

    }

    function blobToDataUrl(blob, callback) {
        var a = new FileReader();

        a.onload = function () {
            callback(a.result);
        }

        a.readAsDataURL(blob);
    }

    const CentterRotatePoint = ({
        x,
        y
    }, rad) => {
        const rcos = Math.cos(rad);
        const rsin = Math.sin(rad);
        return {
            x: x * rcos - y * rsin,
            y: y * rcos + x * rsin
        };
    };

    // will work for shapes with top-left origin, like rectangle
    function calcCenterRotation(node, rotation) {
        //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
        let dimension = node.getClientRect()
        const topLeft = {
            x: -dimension.width,
            y: -dimension.height
        };

        const current = CentterRotatePoint(topLeft, Konva.getAngle(node.rotation()));
        const rotated = CentterRotatePoint(topLeft, Konva.getAngle(rotation));
        const dx = rotated.x - current.x,
            dy = rotated.y - current.y;

        node.rotation(rotation);

        node.x(node.x() + dx);
        node.y(node.y() + dy);
    }
</script>

<style>
    #panel_container {
        border-left: 1px solid lightgray;
    }

    .fill-height {
        height: calc(100vh - 95px);
    }

    .toolbar {
        width: 40px;
    }

    .selected-tool {
        background: #111111;
    }
</style>