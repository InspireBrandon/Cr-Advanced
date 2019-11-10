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
            group: "SOFTWARE",
            dispaly: "Tools",
            route: '/Home',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Software,
            showChildrenCount: false,
            children: []
        },
        {
            title: "TASKS",
            group: "SOFTWARE",
            dispaly: "Tasks",
            route: '/Tasks',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Software,
            showChildrenCount: false,
            children: []
        },
        {
            title: "PLANOGRAM",
            group: "FOLDER",
            dispaly: "Planogram",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Store
            ],
            routeType: RouteType.Folder,
            showChildrenCount: false,
            children: [{
                    title: "IN PROGRESS",
                    group: "DYNAMIC_PLANOGRAM_TASK",
                    dispaly: "Complete",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    showChildrenCount: true,
                    routeType: RouteType.Folder,
                    children: []
                }, {
                    title: "REQUESTING APPROVAL",
                    group: "DYNAMIC_PLANOGRAM_TASK",
                    dispaly: "Requesting approval",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: true,
                    children: []
                },
                {
                    title: "APPROVAL IN PROGRESS",
                    group: "DYNAMIC_PLANOGRAM_TASK",
                    dispaly: "Approval in progress",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: true,
                    children: []
                },
                {
                    title: "APPROVED",
                    group: "DYNAMIC_PLANOGRAM_TASK",
                    dispaly: "Approved",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: true,
                    children: []
                },
                {
                    title: "AWAITING IMPLEMENTATION",
                    group: "DYNAMIC_PLANOGRAM_STORE",
                    dispaly: "Distributed",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: false,
                    children: []
                },
                {
                    title: "IMPLEMENTATION IN PROGRESS",
                    group: "DYNAMIC_PLANOGRAM_STORE",
                    dispaly: "Implementation In Progress",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: false,
                    children: []
                },
                {
                    title: "IMPLEMENTED",
                    group: "DYNAMIC_PLANOGRAM_STORE",
                    dispaly: "Implemented",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: false,
                    children: []
                }
            ]
        },
        {
            title: "RANGING",
            group: "FOLDER",
            dispaly: "Range Analysis",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder,
            showChildrenCount: false,
            children: [{
                    title: "REQUESTING APPROVAL",
                    dispaly: "Requesting approval",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer,
                        accessTypes.Supplier,
                        accessTypes.Store
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: true,
                    children: []
                },
                {
                    title: "APPROVAL IN PROGRESS",
                    dispaly: "Approval in progress",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer,
                        accessTypes.Supplier
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: true,
                    children: []
                },
                {
                    title: "APPROVED",
                    dispaly: "Approved",
                    allowedAccessLevels: [
                        accessTypes.SuperUser,
                        accessTypes.Buyer,
                        accessTypes.Supplier,
                        accessTypes.Store
                    ],
                    routeType: RouteType.Folder,
                    showChildrenCount: true,
                    children: []
                }
            ]
        },
        {
            title: "CLUSTERING",
            group: "FOLDER",
            dispaly: "Clustering",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder,
            showChildrenCount: false,
            children: [{
                title: "STORE",
                dispaly: "Store cluster",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                showChildrenCount: true,
                children: []
            }, {
                title: "CUSTOM",
                dispaly: "Custom cluster",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                showChildrenCount: true,
                children: []
            }, {
                title: "BASKET",
                dispaly: "Basket analysis",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                showChildrenCount: true,
                children: []
            }, {
                title: "CATEGORY",
                dispaly: "Category cluster",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                showChildrenCount: true,
                children: []
            }, {
                title: "DEPARTMENT",
                dispaly: "Department cluster",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.File,
                showChildrenCount: true,
                children: []
            }]
        },
        {
            title: "FLOORPLANNING",
            group: "FOLDER",
            dispaly: "Floor Planning",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder,
            showChildrenCount: false,
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
                showChildrenCount: true,
                children: []
            }, {
                title: "OUTPUT",
                dispaly: "Outputs",
                allowedAccessLevels: [
                    accessTypes.SuperUser,
                    accessTypes.Buyer,
                    accessTypes.Supplier,
                    accessTypes.Store
                ],
                routeType: RouteType.Folder,
                showChildrenCount: false,
                children: []
            }]
        },
        {
            title: "PROMOTION",
            group: "FOLDER",
            dispaly: "Promotions",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder,
            showChildrenCount: false,
            children: []
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
            group: element.group,
            parentID: parentString == "" ? "0" : parentString,
            route: element.route,
            title: element.dispaly,
            allowedAccessLevels: element.allowedAccessLevels,
            showChildrenCount: element.showChildrenCount,
            routeType: element.routeType
        }))

        if (element.children.length > 0) {
            BuildRoutes(element.children, finalArr, tmp);
        }
    });
}

const accessTypes = {
    SuperUser: 0,
    Buyer: 1,
    Supplier: 2,
    Store: 3,
}

const RouteType = {
    Folder: 0,
    File: 1,
    Software: 2
}

export default RouteController;