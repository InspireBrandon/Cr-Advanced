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

    getAllRouteItems() {
        let self = this;
        return self.routes;
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
            title: "TOOLS",
            dispaly: "Tools",
            route: '/TestingView',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Software,
            children: []
        },
        {
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
                    title: "SHARED",
                    dispaly: "Shared",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer,
                        accessTypes.Supplier,
                        accessTypes.Store
                    ],
                    routeType: RouteType.Folder,
                    children: []
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                }
            ]
        },
        {
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
                    title: "SHARED",
                    dispaly: "Shared",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer,
                        accessTypes.Supplier,
                        accessTypes.Store
                    ],
                    routeType: RouteType.Folder,
                    children: []
                },
                {
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
                }
            ]
        },
        {
            title: "CLUSTERING",
            dispaly: "Clustering",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: [{
                title: "STORE",
                dispaly: "Store",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                children: []
            }, {
                title: "CUSTOM",
                dispaly: "Custom",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                children: []
            },{
                title: "BASKET",
                dispaly: "Basket",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                children: []
            },{
                title: "CATEGORY",
                dispaly: "Category",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                children: []
            },{
                title: "DEPARTMENT",
                dispaly: "Department",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                children: []
            }]
        },
        {
            title: "FLOORPLANNING",
            dispaly: "Floor Planning",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: [{
                title: "DEPARTMENT",
                dispaly: "Department",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.Folder,
                children: []
            },{
                title: "OUTPUT",
                dispaly: "Outputs",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.Folder,
                children: []
            }]
        },
        {
            title: "PROMOTION",
            dispaly: "Promotions",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            children: [{
                title: "Department",
                dispaly: "Department",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.Folder,
                children: []
            }]
        }
    ];


    BuildRoutes(staticRoutes, routes, "");

    return routes;
}

function BuildRoutes(values, finalArr, parentString) {

    values.forEach(element => {
        let id = element.title;
        let tmp = id;

        if (parentString != "")
            tmp = parentString + "_" + id;

        finalArr.push(new RouteItem({
            id: tmp,
            parentID: parentString == "" ? "0" : parentString,
            route: element.route,
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
            BuildRoutes(element.children, finalArr, tmp);
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