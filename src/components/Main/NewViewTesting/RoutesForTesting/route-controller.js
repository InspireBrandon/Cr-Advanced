import RouteItem from './route-item';

class RouteController {
    constructor(data) {
        let self = this;
        self.userType = data.userType;
        self.accessRights = data.accessRights;
        self.routes = GetAllRoutes();
    }

    getRoutesByParentID(parentID) {
        let self = this;

        return self.routes.filter(route => {
            return route.parentID == parentID && route.allowedAccessLevels.includes(self.userType);
        })
    }

    addRoute(routeItem) {
        let self = this;

        let checkRouteExists = self.routes.find(route => {
            return route.id == routeItem.id;
        });

        if (checkRouteExists === undefined || checkRouteExists === null) {
            self.routes.push(routeItem);
        }
    }
}

function GetAllRoutes() {
    let routes = [];

    const staticRoutes = [{
        title: "PLANOGRAM",
        dispaly: "Planogram",
        allowedAccessLevels: [
            accessTypes.SuperUser,
            accessTypes.Buyer,
            accessTypes.Supplier,
            accessTypes.Store
        ],
        routeType: RouteType.Folder,
        children: [{
            title: "VIEW",
            dispaly: "Ready to view",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: []
        }, {
            title: "AWAITING_IMPLEMENTATION",
            dispaly: "Ready to implement",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: []
        }, {
            title: "IMPLEMENTATION_IN_PROGRESS",
            dispaly: "In progress",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: []
        }, {
            title: "IMPLEMENTED",
            dispaly: "Implemented",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: []
        }]
    }, {
        title: "RANGING",
        dispaly: "Range Analysis",
        allowedAccessLevels: [
            accessTypes.SuperUser,
            accessTypes.Buyer,
            accessTypes.Supplier,
            accessTypes.Store
        ],
        routeType: RouteType.Folder,
        children: [{
            title: "VIEW",
            dispaly: "Ready to view",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: []
        }]
    }];

    BuildRoutes(staticRoutes, routes, "");

    return routes;
}

function BuildRoutes(values, finalArr, parentString) {

    values.forEach(element => {
        let id = element.title;

        if (parentString != "")
            id += "_" + parentString

        finalArr.push(new RouteItem({
            id: id,
            parentID: parentString == "" ? "0" : parentString,
            title: element.dispaly,
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: element.routeType
        }))

        console.log(finalArr);
        if (element.children.length > 0) {
            BuildRoutes(element.children, finalArr, id);
        }
    });
}

const accessTypes = {
    SuperUser: 0,
    Operations: 1,
    Buyer: 2,
    Supplier: 3,
    Store: 4,
}

const RouteType = {
    Folder: 0,
    File: 1,
    Software: 2
}

export default RouteController;