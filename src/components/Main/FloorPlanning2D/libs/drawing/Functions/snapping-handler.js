import Konva from 'konva'

class snappinghandler {
    constructor() {}

    getLineGuideStops(skipShape, stage, snapableItems) {
        let self = this
        // we can snap to stage borders and the center of the stage
        let scale = stage.scaleX();
        var vertical = [];
        var horizontal = [];

        // and we snap over edges and center of each object on the canvas
        snapableItems.forEach(element => {
            stage.find(element).forEach(guideItem => {
               
                
                if (guideItem === skipShape||guideItem.attrs.visible==false) {
                    return;
                }

                var box = guideItem.getClientRect();
                box.x = box.x / scale;
                box.y = box.y / scale;
                box.width = box.width / scale;
                box.height = box.height / scale;
                // and we can snap to all edges of shapes
                vertical.push([box.x, (box.x + box.width), (box.x +
                    box.width / 2)]);
                horizontal.push([box.y, (box.y + box.height), (box.y *
                    +box.height / 2)]);
            });
        });

        return {
            vertical: vertical.flat(),
            horizontal: horizontal.flat()
        };
    }

    getObjectSnappingEdges(node, stage) {
        let self = this
        let scale = stage.scaleX();
        var box = node.getClientRect();
        box.x = box.x / scale;
        box.y = box.y / scale;
        box.width = box.width / scale;
        box.height = box.height / scale;
        return {
            vertical: [{
                    guide: Math.round(box.x),
                    offset: Math.round(node.x() - box.x),
                    snap: 'start'
                },
                // {
                //     guide: Math.round(box.x + box.width / 2),
                //     offset: Math.round(node.x() - box.x - box.width / 2),
                //     snap: 'center'
                // },
                {
                    guide: Math.round(box.x + box.width),
                    offset: Math.round(node.x() - box.x - box.width),
                    snap: 'end'
                }
            ],
            horizontal: [{
                    guide: Math.round(box.y),
                    offset: Math.round(node.y() - box.y),
                    snap: 'start'
                },
                // {
                //     guide: Math.round(box.y + box.height / 2),
                //     offset: Math.round(node.y() - box.y - box.height / 2),
                //     snap: 'center'
                // },
                {
                    guide: Math.round(box.y + box.height),
                    offset: Math.round(node.y() - box.y - box.height),
                    snap: 'end'
                }
            ]
        };


    }

    getGuides(lineGuideStops, itemBounds, stage) {
        let self = this
        var GUIDELINE_OFFSET = 5;
        var resultV = [];
        var resultH = [];

        lineGuideStops.vertical.forEach(lineGuide => {
            itemBounds.vertical.forEach(itemBound => {
                var diff = Math.abs(lineGuide - itemBound.guide);
                // if the distance between guild line and object snap point is close we can consider this for snapping
                if (diff < GUIDELINE_OFFSET) {
                    resultV.push({
                        lineGuide: lineGuide,
                        diff: diff,
                        snap: itemBound.snap,
                        offset: itemBound.offset
                    });
                }
            });
        });

        lineGuideStops.horizontal.forEach(lineGuide => {
            itemBounds.horizontal.forEach(itemBound => {
                var diff = Math.abs(lineGuide - itemBound.guide);
                if (diff < GUIDELINE_OFFSET) {
                    resultH.push({
                        lineGuide: lineGuide,
                        diff: diff,
                        snap: itemBound.snap,
                        offset: itemBound.offset
                    });
                }
            });
        });

        var guides = [];

        // find closest snap
        var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
        var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
        if (minV) {
            guides.push({
                lineGuide: minV.lineGuide,
                offset: minV.offset,
                orientation: 'V',
                snap: minV.snap
            });
        }
        if (minH) {
            guides.push({
                lineGuide: minH.lineGuide,
                offset: minH.offset,
                orientation: 'H',
                snap: minH.snap
            });
        }
        return guides;
    }
    drawGuides(guides, stage, selectedLayer) {
        let self = this
        let scaleX = stage.scaleX()
        let scaleY = stage.scaleY()
        let xOffset = stage.x() / scaleX;
        let yOffset = stage.y() / scaleY;

        let y_V1 = 0;
        let y_V2 = stage.height();
        let x_V = 0; // change according to rect

        let y_H = 0; // change according to rect
        let x_H1 = 0;
        let x_H2 = stage.width();


        guides.forEach(lg => {
            if (lg.orientation === 'H') {
                y_H = lg.lineGuide -
                    yOffset; //(lg.lineGuide * scaleY); //- ((lg.lineGuide * scaleY) - lg.lineGuide);

                var line = new Konva.Line({
                    points: [x_H1, y_H, x_H2, y_H],
                    stroke: 'rgb(0, 161, 255)',
                    strokeWidth: 1,
                    name: 'guid-line',
                    dash: [4, 6]
                });
                selectedLayer.add(line);
                stage.batchDraw();
            } else if (lg.orientation === 'V') {
                x_V = lg.lineGuide - xOffset; // * scaleX;// - ((lg.lineGuide * scaleX) - lg.lineGuide);
                var line = new Konva.Line({
                    points: [x_V, y_V1, x_V, y_V2],
                    stroke: 'rgb(0, 161, 255)',
                    strokeWidth: 1,
                    name: 'guid-line',
                    dash: [4, 6]
                });
                selectedLayer.add(line);
                stage.batchDraw();
            }
        });


    }



}

export default snappinghandler