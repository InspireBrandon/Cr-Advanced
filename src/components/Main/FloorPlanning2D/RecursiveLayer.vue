<template>
    <div>
        <div v-for="(layer, idx) in layers" :key="idx">
            <div :class="{ 'highlighted': selectedLayerTree == layer  }" @dragover.prevent draggable="true"
                v-on:dragstart="startDrag(layer,idx,layers)" @drop="endDrag(layer,layers)"
                v-if="layer.drawType=='Layer'" style="display: flex;" class="pa-2"
                @click="layer.showChildren = !layer.showChildren">
                <input @change="selectLayer(layer,layers)" v-model="layer.selected"
                    style="margin-top: 4px; margin-right: 10px;" type="checkbox">
                <div style="width: 80%">
                    <div v-if="!layer.showEditName">{{ layer.name }}-{{layer.KonvaID}}</div>
                    <v-form @submit.prevent="editname(layer)">
                        <input :ref="'editLayer' + idx" v-model="layer.name" v-if="layer.showEditName" class="mb-1"
                            style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <v-icon :size="22" @click="togglevisible(layer)" color="grey darken-2">
                    {{ layer.visible ? 'visibility' : 'visibility_off' }}</v-icon>
                <v-menu offset-y offset-x>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :size="22" color="grey darken-2">more_vert</v-icon>
                    </template>
                    <v-list dense class="pa-0">
                        <v-list-tile tile @click="enableEdit(layer)">
                            <v-list-tile-title>Rename</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile tile @click="deleteLayer(layer)">
                            <v-list-tile-title>Remove</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <v-divider></v-divider>

            <div @dragover.prevent draggable="true" v-on:dragstart="startDrag(layer,idx,layers)"
                v-if="showChild&&layer.drawType!='Layer'">

                <!-- <div v-for="(child, idx) in layer.children" :key="idx" class="grey lighten-3"> -->
                <div class="pa-1 grey lighten-3" style="display: flex;">
                    <div>{{ layer.name }}-{{layer.KonvaID}}</div>
                </div>
                <v-divider></v-divider>
                <!-- </div> -->
            </div>
            <RecursiveLayer style="margin-left: 15px;" :selectedLayer="selectedLayer"
                v-if="layer.selected&&layer.children.length!=0" :layers="layer.children" :selectLayer="selectLayer"
                :selectedLayerTree="selectedLayerTree" :setLayerVisible="setLayerVisible" :deleteLayer="deleteLayer"
                :showChild="layer.selected" :endDrag="endDrag" :startDrag="startDrag" :editLayerName="editLayerName" />
        </div>
    </div>

</template>
<script>
    export default {
        props: ["layers", "selectLayer", "setLayerVisible", "deleteLayer", "showChild", "startDrag", "endDrag",
            "selectedLayer", "editLayerName", "selectedLayerTree"
        ],
        name: "RecursiveLayer",
        data() {
            return {

            }
        },
        methods: {
            enableEdit(item) {
                let self = this
                console.log(item);
                self.$set(item, "showEditName", true);

            },
            editname(layer) {
                let self = this
                console.log("[editname]", layer);

                layer.showEditName = false
                self.editLayerName(layer, layer.name)
            },
            togglevisible(layer) {
                let self = this
                layer.visible = !layer.visible
                self.setLayerVisible(layer)
                console.log(layer.visible);
                
            }
        }

    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>