import Konva from 'konva'

class RunBuilder {
    constructor() {
    }

    buildRun(element, params) {
        let self = this;

        let elementsToBuild = [];

        let runs = params.runs;
        let doubleSided = params.doubleSided;
        let useEnds = params.useEnds;

        let ep = element.attrs;

        let dsy = ep.y - ep.height;
        
        // if double sided
        if(doubleSided) {
            elementsToBuild.push(new FloorPlanItem(ep.x, dsy, ep.height, ep.width));
        }

        let xShift = ep.x;

        // use runs - 1 here because we have already built the first item;
        for(var i = 0; i < (runs - 1); i++) {
            // build next to main
            xShift += ep.width;
            elementsToBuild.push(new FloorPlanItem(xShift, ep.y, ep.height, ep.width));

            // build if double sided
            if(doubleSided) {
                elementsToBuild.push(new FloorPlanItem(xShift, dsy, ep.height, ep.width));
            }
        }

        // build sides if useEnds
        if(useEnds) {
            let endY = dsy + (((ep.height * 2) - ep.width) / 2);

            elementsToBuild.push(new FloorPlanItem(ep.x, endY, ep.height, ep.width, 90));
            elementsToBuild.push(new FloorPlanItem((xShift + ep.width + ep.height), endY, ep.height, ep.width, 90));
        }

        return elementsToBuild;
    }
}

class FloorPlanItem {
    constructor(x, y, h, w, r = 0) {
        let self = this;

        self.x = x;
        self.y = y;
        self.h = h;
        self.w = w;
        self.r = r;
    }
}

export default RunBuilder;