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
            allowedAccessLevels: [
                accessTypes.Supplier,
                accessTypes.Buyer
            ]
        }),
        new RouteItem({
            id: "1.3",
            parentID: "1",
            title: "Space Planning",
            route: "/SpacePlanning",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ]
        }),
        new RouteItem({
            id: "1.4",
            parentID: "1",
            title: "Default Fixtures",
            route: "/Fixtures",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ]
        }),
        new RouteItem({
            id: "2",
            parentID: "0",
            title: "Ranging",
            route: "/RangePlanning/:rangeFileID",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "3",
            parentID: "0",
            title: "Data Preparation",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "3.1",
            parentID: "3",
            title: "Product",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "3.1.1",
            parentID: "3.1",
            title: "Brand",
            route: '/DataPreparation/Brand',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "3.1.2",
            parentID: "3.1",
            title: "Manufacturer",
            route: '/DataPreparation/Manufacturer',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "3.1.3",
            parentID: "3.1",
            title: "Supplier",
            route: '/DataPreparation/Supplier',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
        new RouteItem({
            id: "3.1.4",
            parentID: "3.1",
            title: "Department",
            route: '/DataPreparation/Department',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
        }),
    );

    // Ranging
    return routes;
}

const accessTypes = {
    SuperUser: 0,
    Operations: 1,
    Buyer: 2,
    Supplier: 3,
    Store: 4,
}

export default RouteController;