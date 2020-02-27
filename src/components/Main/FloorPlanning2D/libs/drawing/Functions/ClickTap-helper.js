import Konva from 'konva'
import TransFormerHelper from './TransFormer-Helper'
let transFormerHelper = new TransFormerHelper()


class ClickTapHelper {
    constructor() {}

    destroyTransformer(stage, callback) {
        stage.find('Transformer').destroy()
        callback()
    }
    setSelectedItem(e, findLayerItem, selectedLayerTreeItem, selectedItem, selectedLayer, layerTree, returnOBj) {
        findLayerItem(layerTree, e.parent._id, callback => {
            selectedLayerTreeItem = callback
            selectedItem = e
            returnOBj(callback)
        })

    }
    handleSelection(e, stage, selectedLayer, selectedItem, selectedLayerTreeItem, ctrlDown, handleMultiSelect) {

    }
    handleClickTap(e, stage, selectedItem, clickselect, findLayerItem, selectedLayerTreeItem, properties, ctrlDown, selectedTool, resetDuplication, handleMultiSelect, layerTree, floorConfig, meterRatio, keepAspectRatio, handleSnapping, lastPosition, transformProperties, imagePos, selectImage, selectedLayer, clicktapcallback) {
        let self = this
        
        self.destroyTransformer(stage, cb => {
            if (selectedTool == "open_with") {
                if (e == stage) {
                    selectedItem = null
                    selectedLayerTreeItem = null
                    for (var prop in properties) {
                        properties[prop] = null
                    }
                } else {

                }
            }
        })
        resetDuplication()
        if (selectedTool == "open_with") {
            
            if (e === stage) {

                selectedLayer.draw();
                selectedItem = null
                selectedLayerTreeItem = null
                return;
            } else {
                clickselect(e, callback => {
                    e = callback
                    e.draggable(true)
                })
            }
            if (ctrlDown && e.attrs.draggable) {
                handleMultiSelect(e)
            }
            if (e.attrs.name == "Tape") {
                e.draggable(true)
            }
            if (e.attrs.draggable && e != stage) {
                self.setSelectedItem(e, findLayerItem, selectedLayerTreeItem, selectedItem, selectedLayer, layerTree, cb => {
                    selectedLayerTreeItem = cb
                    selectedItem = e;
                    if (e.attrs.name == "Duplication Group") {
                        e.draggable(true)
                        e.children.forEach(element => {
                            element.attrs.draggable = false
                            element.draggable(false)
                        })
                    }
                    stage.batchDraw()
                    properties.name = selectedItem.attrs.name;
                    properties.height = (selectedItem.attrs.height / (floorConfig
                        .blockRatio * meterRatio)).toFixed(2);
                    properties.width = (selectedItem.attrs.width / (floorConfig
                        .blockRatio * meterRatio)).toFixed(2);
                    properties.fill = selectedItem.attrs.fill;
                    properties.radius = (selectedItem.attrs.radius / (floorConfig
                        .blockRatio * meterRatio)).toFixed(2);
                    properties.rotation = selectedItem.attrs.rotation;
                    properties.depth = selectedItem.attrs.depth / ((floorConfig
                        .blockRatio * meterRatio)).toFixed(2);

                    if (selectedItem.attrs.name == "image") {
                        keepAspectRatio = selectedItem.attrs.keepAspectRatio
                    }
                    // start transform region
                    var tr
                    if (selectedItem.attrs.name == "image") {
                        if (selectedItem.attrs.keepAspectRatio != true) {
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
                            enabledAnchors: selectedItem.attrs.enabledAnchors,
                        });
                    }

                    if (selectedItem.attrs.name == "Tape") {
                        tr = new Konva.Transformer({
                            enabledAnchors: [],
                        });
                    }
                    if (selectedItem.attrs.name == "Gondola-Rect" || selectedItem.attrs
                        .name ==
                        "image" || selectedItem.attrs
                        .name == "Tape") {
                        tr.rotateEnabled(true);

                    } else {
                        tr.rotateEnabled(false);
                    }

                    e.parent.add(tr);

                    tr.attachTo(e);
                    stage.batchDraw();
                    tr.on('transform', function (z) {
                        transFormerHelper.handleTransform(e, z, handleSnapping, self
                            .stage,
                            lastPosition, ctrlDown, selectedItem,
                            rotateAroundCenter, transformProperties, self
                            .propertiesLabelHorizontal, propertiesLabelVertical)
                    });
                    tr.on('transformend', function () {
                        transFormerHelper.handleTransformEnd(selectedItem, properties,
                            (floorConfig.blockRatio * meterRatio))
                        stage.batchDraw();
                    });
                })
            }
            // End transform region
        }

        // addimage start
        if (selectedTool == "image") {
            let transform = stage.getAbsoluteTransform().copy();
            // to detect relative position we need to invert transform
            transform.invert();
            // now we find relative point
            let pos = stage.getPointerPosition();
            let dropPos = transform.point(pos);
            imagePos.x = dropPos.x
            imagePos.y = dropPos.y
            setTimeout(() => {
                selectImage()

            }, 200);
        }
        // addimage End
        clicktapcallback({
            selectedLayerTreeItem: selectedLayerTreeItem,
            selectedItem: selectedItem
        })
    }

    handleClickTapDoubleClick(e, stage, selectedItem, clickselect, findLayerItem, selectedLayerTreeItem, properties, ctrlDown, selectedTool, resetDuplication, handleMultiSelect, layerTree, floorConfig, meterRatio, keepAspectRatio, handleSnapping, lastPosition, transformProperties, imagePos, selectImage, selectedLayer, clicktapcallback) {
        let self = this
        console.log("[DBLCLIKC] TARGET",e);
        
        self.destroyTransformer(stage, cb => {
            if (selectedTool == "open_with") {
                if (e == stage) {
                    selectedItem = null
                    selectedLayerTreeItem = null
                    for (var prop in properties) {
                        properties[prop] = null
                    }
                } else {

                }
            }
        })
        resetDuplication()
        if (selectedTool == "open_with") {
            if (e === stage) {
                selectedLayer.draw();
                selectedItem = null
                selectedLayerTreeItem = null
                return;
            } else {
                clickselect(e, callback => {


                })
            }
            console.log("[DOUBLECLICK]-TARGET",e);
            if (ctrlDown && e.attrs.draggable) {
                handleMultiSelect(e)
            }
            if (e.attrs.name == "Tape") {
                e.draggable(true)
            }
            if (e.attrs.draggable && e != stage) {
                self.setSelectedItem(e, findLayerItem, selectedLayerTreeItem, selectedItem, selectedLayer, layerTree, cb => {
                    selectedLayerTreeItem = cb
                    selectedItem = e;
                    if (e.attrs.name == "Duplication Group") {
                        e.draggable(true)
                        e.children.forEach(element => {
                            element.attrs.draggable = false
                            element.draggable(false)
                        })
                    }
                    stage.batchDraw()
                    properties.name = selectedItem.attrs.name;
                    properties.height = (selectedItem.attrs.height / (floorConfig
                        .blockRatio * meterRatio)).toFixed(2);
                    properties.width = (selectedItem.attrs.width / (floorConfig
                        .blockRatio * meterRatio)).toFixed(2);
                    properties.fill = selectedItem.attrs.fill;
                    properties.radius = (selectedItem.attrs.radius / (floorConfig
                        .blockRatio * meterRatio)).toFixed(2);
                    properties.rotation = selectedItem.attrs.rotation;
                    properties.depth = selectedItem.attrs.depth / ((floorConfig
                        .blockRatio * meterRatio)).toFixed(2);

                    if (selectedItem.attrs.name == "image") {
                        keepAspectRatio = selectedItem.attrs.keepAspectRatio
                    }
                    // start transform region
                    var tr
                    if (selectedItem.attrs.name == "image") {
                        if (selectedItem.attrs.keepAspectRatio != true) {
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
                            enabledAnchors: selectedItem.attrs.enabledAnchors,
                        });
                    }

                    if (selectedItem.attrs.name == "Tape") {
                        tr = new Konva.Transformer({
                            enabledAnchors: [],
                        });
                    }
                    if (selectedItem.attrs.name == "Gondola-Rect" || selectedItem.attrs
                        .name ==
                        "image" || selectedItem.attrs
                        .name == "Tape") {
                        tr.rotateEnabled(true);

                    } else {
                        tr.rotateEnabled(false);
                    }

                    e.parent.add(tr);

                    tr.attachTo(e);
                    stage.batchDraw();
                    tr.on('transform', function (z) {
                        transFormerHelper.handleTransform(e, z, handleSnapping, self
                            .stage,
                            lastPosition, ctrlDown, selectedItem,
                            rotateAroundCenter, transformProperties, self
                            .propertiesLabelHorizontal, propertiesLabelVertical)
                    });
                    tr.on('transformend', function () {
                        transFormerHelper.handleTransformEnd(selectedItem, properties,
                            (floorConfig.blockRatio * meterRatio))
                        stage.batchDraw();
                    });
                })

            }
            // End transform region
        }

        // addimage start
        if (selectedTool == "image") {
            let transform = stage.getAbsoluteTransform().copy();
            // to detect relative position we need to invert transform
            transform.invert();
            // now we find relative point
            let pos = stage.getPointerPosition();
            let dropPos = transform.point(pos);
            imagePos.x = dropPos.x
            imagePos.y = dropPos.y
            setTimeout(() => {
                selectImage()

            }, 200);
        }
        // addimage End
        clicktapcallback({
            selectedLayerTreeItem: selectedLayerTreeItem,
            selectedItem: selectedItem
        })



    }
}
export default ClickTapHelper