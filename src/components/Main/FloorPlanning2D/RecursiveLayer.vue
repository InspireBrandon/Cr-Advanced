<template>
    <div style="margin-left: 15px;">
        <div v-for="(layer, idx) in layers" :key="idx"  >
            <div :class="{ 'highlighted': selectedLayer == layer  }" @dragover.prevent draggable="true" v-on:dragstart="startDrag(layer,idx,layers)" @drop="endDrag(layer,layers)" v-if="layer.attrs.drawType=='Layer'" style="display: flex;" class="pa-2" @click="layer.attrs.showChildren = !layer.attrs.showChildren">
                <input @change="selectLayer(layer,layers)" v-model="layer.attrs.selected"
                    style="margin-top: 4px; margin-right: 10px;" type="checkbox">
                <div style="width: 80%">
                    <div v-if="!layer.attrs.showEditName">{{ layer.attrs.name }}</div>
                    <v-form @submit.prevent="layer.attrs.showEditName = false">
                        <input :ref="'editLayer' + idx" v-model="layer.attrs.name" v-if="layer.attrs.showEditName"
                            class="mb-1" style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <v-icon :size="22" @click="setLayerVisible(layer)" color="grey darken-2">
                    {{ layer.attrs.visible ? 'visibility' : 'visibility_off' }}</v-icon>
                <v-menu offset-y offset-x>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" :size="22" color="grey darken-2">more_vert</v-icon>
                    </template>
                    <v-list dense class="pa-0">
                        <v-list-tile tile>
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
            
            <div @dragover.prevent draggable="true" v-on:dragstart="startDrag(layer,idx,layers)"  v-if="showChild&&layer.attrs.drawType!='Layer'">
                
                <!-- <div v-for="(child, idx) in layer.children" :key="idx" class="grey lighten-3"> -->
                    <div class="pa-1 grey lighten-3" style="display: flex;">
                        <div>{{ layer.attrs.name }}</div>
                    </div>
                    <v-divider></v-divider>
                <!-- </div> -->
            </div>
            <RecursiveLayer :selectedLayer="selectedLayer" v-if="layer.attrs.selected&&layer.children.length!=0" :layers="layer.children" :selectLayer="selectLayer" :setLayerVisible="setLayerVisible" :deleteLayer="deleteLayer" :showChild="layer.attrs.selected" :endDrag="endDrag" :startDrag="startDrag"/>
        </div>
    </div>

</template>
<script>
    export default {
        props: ["layers", "selectLayer", "setLayerVisible", "deleteLayer","showChild","startDrag","endDrag","selectedLayer"],
          name: "RecursiveLayer",
        data() {
            return {

            }
        }

    }
</script>
<style>

 .highlighted {
    background-color: #1976d2;
  }
</style>
