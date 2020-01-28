<template>
    <div>
        <div v-for="(layer, idx) in layers" :key="idx">
            <div v-on:dragstart="dragStart(layer,idx,layers)" @dragend="togglekids" @drop="endlayer(layer,layers)"
                @dragover.prevent draggable="true" :class="{ 'highlighted': selectedLayerTree == layer  }"
                v-if="layer.drawType=='Layer'||layer.drawType=='group'" style="display: flex;" class="pa-2"
                @click="layer.showChildren = !layer.showChildren">
                <v-icon :size="22" @click="toggleCollapsed(layer)" color="grey darken-2">
                    {{ layer.collapsed ? 'arrow_drop_down' : 'arrow_drop_up' }}</v-icon>
                <input @change="selectLayer(layer,layers)" v-model="layer.selected"
                    style="margin-top: 4px; margin-right: 10px;" type="checkbox">
                <div style="width: 80%">
                    <div v-if="!layer.showEditName">{{ layer.name }}</div>
                    <v-form @submit.prevent="editname(layer)">
                        <input :ref="'editLayer' + idx" v-model="layer.name" v-if="layer.showEditName" class="mb-1"
                            style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <v-icon :size="22" @click="togglevisible(layer)" color="grey darken-2">
                    {{ layer.visible ? 'visibility' : 'visibility_off' }}</v-icon>


                <v-icon v-if="layer.drawType=='group'" :size="22" @click="togglelocked(layer)" color="grey darken-2">
                    {{ layer.locked ? 'lock_open' : 'lock' }}</v-icon>
                <v-menu offset-y offset-x>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :size="22" color="grey darken-2">more_vert</v-icon>
                    </template>
                    <v-list dense class="pa-0">
                        <v-list-tile tile @click="enableEdit(layer)">
                            <v-list-tile-title>Rename</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile tile @click="deleteLayer(layer,layers,idx)">
                            <v-list-tile-title>Remove</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <v-divider></v-divider>
            <div @dragover.prevent draggable="true" @drop="endgroupDrag(layer,layers,idx)"
                v-on:dragstart="dragStart(layer,idx,layers)"
                v-if="(layer.drawType!='Layer'&&layer.drawType!='group')">
                <div class="pa-1 grey lighten-3" style="display: flex;">
                    <div :class="{ 'highlighted': selectedLayerTreeItem == layer  }">{{ layer.name }}
                    </div>
                </div>
                <v-divider></v-divider>
            </div>
            <RecursiveLayer :selectedLayerTreeItem="selectedLayerTreeItem" :toggleLock="toggleLock"
                v-show="layer.visible" style="margin-left: 15px;" :selectedLayer="selectedLayer"
                v-if="((layer.children.length!=0||layer.drawType=='group')&&dragging==false&&layer.collapsed!=true)"
                :layers="layer.children" :selectLayer="selectLayer" :selectedLayerTree="selectedLayerTree"
                :setLayerVisible="setLayerVisible" :deleteLayer="deleteLayer" :showChild="layer.selected"
                :endDrag="endDrag" :startDrag="startDrag" :swapIndex="swapIndex" :editLayerName="editLayerName" />
        </div>
    </div>
</template>
<script>
    export default {
        props: ["layers", "selectLayer", "setLayerVisible", "deleteLayer", "showChild", "startDrag", "endDrag",
            "selectedLayer", "editLayerName", "selectedLayerTree", "selectedLayerTreeItem", "toggleLock",
            "swapIndex"
        ],
        name: "RecursiveLayer",
        data() {
            return {
                dragging: false
            }
        },
        methods: {
            togglekids() {
                this.dragging = false
            },
            endlayer(layer, layers) {
                let self = this
                self.dragging = false
                self.endDrag(layer, layers)
            },
            dragStart(layer, idx, layers) {
                let self = this
                self.dragging = true
                self.startDrag(layer, idx, layers)
            },
            endgroupDrag(layer, layers, idx) {
                let self = this
                self.dragging = false
                console.log("endgroupDrag");

                if (layer.drawType == "group") {
                    self.endDrag(layer, layers)
                } else {
                    self.swapIndex(layer, layers, idx)
                }
            },
            enableEdit(item) {
                let self = this
                self.$set(item, "showEditName", true);
            },
            editname(layer) {
                let self = this
                layer.showEditName = false
                self.editLayerName(layer, layer.name)
            },
            togglevisible(layer) {
                let self = this
                layer.visible = !layer.visible
                self.setLayerVisible(layer)
            },
            togglelocked(layer) {
                let self = this
                layer.locked = !layer.locked
                self.toggleLock(layer)

            },
            toggleCollapsed(layer) {
                let self = this
                layer.collapsed = !layer.collapsed
            }
        }

    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>