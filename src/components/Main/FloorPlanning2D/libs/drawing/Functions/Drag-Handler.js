import Konva from 'konva'
import Rect from '@/components/Main/FloorPlanning2D/libs/drawing/shape/rect'
import Circle from '@/components/Main/FloorPlanning2D/libs/drawing/shape/circle'
import Line from '@/components/Main/FloorPlanning2D/libs/drawing/shape/line'
import StageImage from '@/components/Main/FloorPlanning2D/libs/drawing/shape/image'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'
import Label from '@/components/Main/FloorPlanning2D/libs/drawing/shape/label'
import Arrow from '@/components/Main/FloorPlanning2D/libs/drawing/shape/arrow'
import Area from '@/components/Main/FloorPlanning2D/libs/drawing/shape/area'






class DragHandler {
    constructor() {}
    handleContentMousedown(SelectedLayer, stage, firstPosition, lastPosition, selectedTool, SelectedLayerTree, selectImage, isPaint, wall, rect, circle, image, arrow, arrowStartY, arrowStartX, textNode, brush, vueCtx, dotted, area, areaLayertree, areaLayer, areaTree, callback) {

        if (SelectedLayer.attrs.visible == false && selectedTool != "open_with") {
            alert("cannot draw on invisible layer")
            return
        }
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);


        if (firstPosition.x == 0) {
            firstPosition.x = dropPos.x
            firstPosition.y = dropPos.y
            lastPosition.x = dropPos.x
            lastPosition.y = dropPos.y
        } else {
            lastPosition.x = dropPos.x
            lastPosition.y = dropPos.y

        }

        isPaint = true;

        switch (selectedTool) {
            case "show_chart": {
                wall = new Line(SelectedLayer, {
                    x: firstPosition.x,
                    y: firstPosition.y,
                    name: 'wall',
                    drawType: 'wall'
                }, brush)
                let treeitem = new treeItem({
                    KonvaID: wall.shape._id,
                    name: 'wall',
                    drawType: 'wall',
                    children: [],
                    width: null,
                    parent:SelectedLayerTree
                })
                SelectedLayerTree.children.push(treeitem)
            }
            break;
        case "arrow_upward": {
            if (firstPosition.x == 0) {
                return
            }
            arrow = new Arrow(SelectedLayer, {
                x: firstPosition.x,
                y: firstPosition.y,
            });

            arrowStartY = firstPosition.y
            arrowStartX = firstPosition.x


            SelectedLayerTree.children.push(new treeItem({
                KonvaID: arrow.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: true,
                draggable: true,
                name: "arrow",
                children: [],
                parent:SelectedLayerTree
            }))
        }
        break;
        case "crop_square": {
            rect = new Rect(SelectedLayer, {
                x: firstPosition.x,
                y: firstPosition.y
            }, null, null, brush);
            SelectedLayerTree.children.push(new treeItem({
                KonvaID: rect.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: true,
                draggable: true,
                name: "rect-group",
                children: [],
                parent:SelectedLayerTree
            }))
        }
        break;
        case "fiber_manual_record": {
            circle = new Circle(SelectedLayer, {
                x: firstPosition.x,
                y: firstPosition.y,
            }, null, brush);

            SelectedLayerTree.children.push(new treeItem({
                KonvaID: circle.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: true,
                draggable: true,
                name: "Circle",
                children: [],
                parent:SelectedLayerTree
            }))
        }
        break;
        case "local_offer": {
            textNode = new Label(SelectedLayer, {
                x: firstPosition.x,
                y: firstPosition.y,
            });


            SelectedLayerTree.children.push(new treeItem({
                KonvaID: textNode.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: true,
                draggable: true,
                name: "Label",
                children: [],
                parent:SelectedLayerTree
            }))
            textNode.shape.on('dblclick dbltap', () => {

                // create textarea over canvas with absolute position
                // first we need to find position for textarea
                // how to find it?
                stage.find('Transformer').destroy()
                // at first lets find position of text node relative to the stage:
                var textPosition = textNode.shape.getAbsolutePosition();

                // then lets find position of stage container on the page:
                var stageBox = stage.getContainer().getBoundingClientRect();

                // so position of textarea will be the sum of positions above:
                var areaPosition = {
                    x: stageBox.left + textPosition.x,
                    y: stageBox.top + textPosition.y
                };

                // create textarea and style it
                var textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                textNode.shape.hide();
                SelectedLayer.draw();
                textarea.value = textNode.shape.text();
                textarea.style.fontFamily = 'Arial';
                textarea.style.fontSize = '18';
                textarea.style.position = 'absolute';
                textarea.style.top = areaPosition.y + 'px';
                textarea.style.left = areaPosition.x + 'px';
                textarea.style.width = textNode.shape.width();

                textarea.focus();

                textarea.addEventListener('keydown', function (e) {
                    // hide on enter
                    if (e.keyCode === 13) {
                        let StringText = textarea.value;
                        textNode.shape.text(StringText);
                        textNode.shape.show();
                        SelectedLayer.draw();
                        document.body.removeChild(textarea);
                    }
                });
                textarea.addEventListener('blur', function (e) {
                    // hide on blur
                    let StringText = textarea.value;
                    textNode.shape.text(StringText);
                    textNode.shape.show();
                    SelectedLayer.draw();
                    document.body.removeChild(textarea);
                });
            });
        }
        break;
        case "linear_scale": {
            // dotted = new Line(SelectedLayer, {
            //     x: firstPosition.x,
            //     y: firstPosition.y,
            //     name: 'wall',
            //     drawType: 'wall'
            // }, {
            //     height: 2,
            //     color: "#1976d2"
            // })
            // dotted.shape.setAttrs({
            //     stroke: 'black',
            //     strokeWidth: 1,
            //     dash: [10, 10],
            //     name: "dotted"
            // })
        }
        break;
        case "tab_unselected": {
            area = new Area(areaLayer, {
                x: firstPosition.x,
                y: firstPosition.y,
                name: 'Area',
                drawType: 'Area'
            }, brush)

            areaTree = new treeItem({
                KonvaID: area.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: true,
                draggable: true,
                name: "area",
                children: [],
                parent:areaLayertree
            })
            areaLayertree.children.push(areaTree)

        }
        break;
        default:
            break;

        }
        callback({
            wall: wall,
            rect: rect,
            circle: circle,
            textNode: textNode,
            arrow: arrow,
            arrowStartX: arrowStartX,
            arrowStartY: arrowStartX,
            dotted: dotted,
            area: area,
            areaTree: areaTree
        })

    }

    handleContentMouseUp(SelectedLayer, stage, firstPosition, lastPosition, selectedTool, SelectedLayerTree, selectImage, isPaint, wall, rect, circle, image, arrow, arrowStartY, arrowStartX, textNode, resetDuplication, area, callback) {
        isPaint = false;
        var pos = stage.getPointerPosition();

        var deltaX = lastPosition.x - firstPosition.x;
        var deltaY = lastPosition.y - firstPosition.y;

        let hyp = Math.hypot(deltaY, deltaX)

        var rad = Math.atan2(deltaY, deltaX);

        var deg = rad * (180 / Math.PI);
        switch (selectedTool) {
            case "show_chart":
                if (wall.shape.attrs.width < 10) {
                    wall.shape.width(10);
                }

                break;
            case "crop_square":
                if (rect.shape.attrs.width < 5) {
                    rect.shape.width(5);
                    rect.shape.height(5);
                }
                // rect.shape.width(hyp);
                break;

            case "fiber_manual_record":
                if (circle.shape.attrs.width < 5) {
                    circle.shape.width(5);
                    circle.shape.height(5);
                }
                // circle.shape.width(hyp);
                break;
            case "arrow_upward":
                // arrow.shape.width(hyp);
                break;
            case "local_offer":
                // textNode.shape.width(hyp);
                break;

            case "tab_unselected":
                if (area.shape.attrs.width < 5) {
                    area.shape.width(5);
                    area.shape.height(5);
                }
                break;

            default:
                break;
        }

        // firstPosition.x = 0;
        // firstPosition.y = 0;
        // lastPosition.x = 0;
        // lastPosition.y = 0;
        stage.find('.guid-line').destroy();
        let guides = stage.find('.guid-line')
        resetDuplication()
        stage.batchDraw()
        callback()
    }

    handleContentMousemove(SelectedLayer, stage, firstPosition, lastPosition, selectedTool, SelectedLayerTree, selectImage, isPaint, wall, rect, circle, image, arrow, arrowStartY, arrowStartX, textNode, ctrlDown, handleSnapping, brush, transformProperties, dotted, area) {
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);

        lastPosition = dropPos;

        var deltaX = lastPosition.x - firstPosition.x;
        var deltaY = lastPosition.y - firstPosition.y;

        let hyp = Math.hypot(deltaY, deltaX)
        var rad = Math.atan2(deltaY, deltaX);

        var deg = rad * (180 / Math.PI);


        switch (selectedTool) {
            case "show_chart":

                wall.shape.width(hyp);
                transformProperties.width = wall.shape.width()
                transformProperties.height = wall.shape.height()
                if (!ctrlDown) {
                    wall.shape.rotation(deg);
                } else {
                    let updateDegrees = false;
                    let snappedAngle = 0;
                    let tolerance = brush.snapOption * 0.45;

                    brush.snappingAngles.forEach(sa => {
                        let lowerBounds = sa - tolerance
                        let upperBounds = sa + tolerance

                        if (deg >= lowerBounds && deg <= upperBounds) {
                            updateDegrees = true;
                            snappedAngle = sa;
                        }
                    })

                    if (updateDegrees)
                        wall.shape.rotation(snappedAngle);
                }

                break;

            case "crop_square":
                rect.shape.width(hyp);
                rect.shape.height(hyp);
                transformProperties.width = rect.shape.width()
                transformProperties.height = rect.shape.height()
                if (!ctrlDown) {
                    // rect.shape.rotation(deg);
                } else {
                    //   handleSnapping(rect.shape)
                    let updateDegrees = false;
                    let snappedAngle = 0;
                    let tolerance = brush.snapOption * 0.45;

                    brush.snappingAngles.forEach(sa => {
                        let lowerBounds = sa - tolerance
                        let upperBounds = sa + tolerance

                        if (deg >= lowerBounds && deg <= upperBounds) {
                            updateDegrees = true;
                            snappedAngle = sa;
                        }
                    })

                    if (updateDegrees) {
                        // rect.shape.rotation(snappedAngle);
                    }

                }
                break;


            case "arrow_upward":

                var deltaXArrow = lastPosition.x - firstPosition.x;
                var deltaYArrow = lastPosition.y - firstPosition.y;


                var radArrow = Math.atan2(deltaYArrow, deltaXArrow);


                var degArrow = radArrow * (180 / Math.PI);
                if (!ctrlDown) {
                    arrow.shape.points([arrowStartX, arrowStartY, lastPosition.x, lastPosition.y])
                } else {

                    let updateDegrees = false;
                    let snappedAngle = 0;
                    let tolerance = brush.snapOption * 0.45;

                    brush.snappingAngles.forEach(sa => {
                        let lowerBounds = sa - tolerance
                        let upperBounds = sa + tolerance

                        if (deg >= lowerBounds && deg <= upperBounds) {
                            updateDegrees = true;
                            snappedAngle = sa;
                        }
                    })

                    if (updateDegrees) {
                        arrow.shape.rotation(degArrow);
                    }

                    arrow.shape.points([arrowStartX, arrowStartY, lastPosition.x, lastPosition.y])
                }
                break;

            case "fiber_manual_record":
                circle.shape.width(hyp);
                transformProperties.radius = circle.shape.width()
                //   handleSnapping(circle.shape)
                break;
            case "local_offer":
                textNode.shape.width(hyp);

                if (!ctrlDown) {
                    textNode.shape.rotation(deg);
                } else {
                    let updateDegrees = false;
                    let snappedAngle = 0;
                    let tolerance = brush.snapOption * 0.45;

                    brush.snappingAngles.forEach(sa => {
                        let lowerBounds = sa - tolerance
                        let upperBounds = sa + tolerance

                        if (deg >= lowerBounds && deg <= upperBounds) {
                            updateDegrees = true;
                            snappedAngle = sa;
                        }
                    })

                    if (updateDegrees)
                        textNode.shape.rotation(snappedAngle);
                }
                break;
            case "linear_scale": {
                dotted.shape.width(hyp);
                //    handleSnapping(dotted.shape)
                if (!ctrlDown) {
                    dotted.shape.rotation(deg);
                } else {
                    let updateDegrees = false;
                    let snappedAngle = 0;
                    let tolerance = brush.snapOption * 0.45;

                    brush.snappingAngles.forEach(sa => {
                        let lowerBounds = sa - tolerance
                        let upperBounds = sa + tolerance

                        if (deg >= lowerBounds && deg <= upperBounds) {
                            updateDegrees = true;
                            snappedAngle = sa;
                        }
                    })

                    if (updateDegrees)
                        dotted.shape.rotation(snappedAngle);
                }
                break;

            }
            case "tab_unselected":
                area.shape.width(hyp);
                area.shape.height(hyp);

                //    handleSnapping(dotted.shape)
                break;
            default:
                break;
        }
        stage.batchDraw();
    }
}

export default DragHandler;