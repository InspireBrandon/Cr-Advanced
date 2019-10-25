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
            return route.parentID === parentID && route.allowedAccessLevels.includes(self.userType);
        })
    }

    addRoute(routeItem) {
        let self = this;
        
        let checkRouteExists = self.routes.find(route => {
            return route.id == routeItem.id;
        });

        if(checkRouteExists === undefined || checkRouteExists === null) {
            self.routes.push(routeItem);
        }
    }
}

const accessTypes = {
    SuperUser: 0,
    Operations: 1,
    Buyer: 2,
    Supplier: 3,
    Store: 4,
}

function GetAllRoutes() {
    let routes = [];

    // Planogram
    routes.push(
        new RouteItem({
            id: "1",
            parentID: "0",
            title: "Planogram",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "1.1",
            parentID: "1",
            title: "View",
            route: "/PlanogramImplementation",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ]
        }),
        new RouteItem({
            id: "1.2",
            parentID: "1",
            title: "View",
            route: "/PlanogramImplementation",
            allowedAccessLevels: [
                accessTypes.Supplier,
                accessTypes.Buyer
            ]
        })
    );

    // Ranging
    return routes;
}

export default RouteController;