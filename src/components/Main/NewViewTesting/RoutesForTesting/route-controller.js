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
            // routeType: 0,
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "1.1",
            parentID: "1",
            title: "View",
            route: "/PlanogramImplementation",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "1.2",
            parentID: "1",
            title: "View",
            allowedAccessLevels: [
                accessTypes.Supplier,
                accessTypes.Buyer
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "1.3",
            parentID: "1",
            title: "Space Planning",
            route: "/SpacePlanning",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "1.4",
            parentID: "1",
            title: "Default Fixtures",
            route: "/Fixtures",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.File
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
            routeType: RouteType.Folder
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
            routeType: RouteType.Folder
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
            routeType: RouteType.Folder
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
            routeType: RouteType.File
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
            routeType: RouteType.File
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
            routeType: RouteType.File
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
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.2",
            parentID: "3",
            title: "Market",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "3.2.1",
            parentID: "3.2",
            title: "Store",
            route: '/DataPreparation/Store',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.2.2",
            parentID: "3.2",
            title: "Store Cluster",
            route: '/DataPreparation/StoreCluster',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3",
            parentID: "3",
            title: "Fact",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "3.3.1",
            parentID: "3.3",
            title: "Category Code",
            route: '/DataPreparation/CategoryCode',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3.2",
            parentID: "3.3",
            title: "Planogram Maintenance",
            route: '/DataPreparation/PlanogramMaintenance',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3.3",
            parentID: "3.3",
            title: "Supergroup A",
            route: '/DataPreparation/Supergroup_A',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3.4",
            parentID: "3.3",
            title: "Supergroup B",
            route: '/DataPreparation/Supergroup_B',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3.5",
            parentID: "3.3",
            title: "Segment",
            route: '/DataPreparation/Segment',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3.6",
            parentID: "3.3",
            title: "Item Status",
            route: '/DataPreparation/Item_Status',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.3.7",
            parentID: "3.3",
            title: "Active Shop Code",
            route: '/DataPreparation/Active_Shop_Code',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "3.4",
            parentID: "3",
            title: "Period",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "3.4.1",
            parentID: "3.4",
            title: "Period",
            route: '/DataPreparation/Period',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "4",
            parentID: "0",
            title: "Data Import",
            route: '/DataImport',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "5",
            parentID: "0",
            title: "Project Planning",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "5.1",
            parentID: "5",
            title: "Project Planning Drawer",
            route: '/Drawer',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "5.2",
            parentID: "5",
            title: "Transaction Allocation",
            route: '/Allocation/:ProjectID',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "5.3",
            parentID: "5",
            title: "Meetings And Workshops",
            route: '/MeetingsAndWorkshops',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "6",
            parentID: "0",
            title: "Tasks",
            route: '/Tasks',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "7",
            parentID: "0",
            title: "Floor Planning",
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "7.1",
            parentID: "7",
            title: "Floor Planning",
            route: '/FloorPlanning',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "7.2",
            parentID: "7",
            title: "Floor Planning 2D",
            route: '/FloorPlanning2D',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "8",
            parentID: "0",
            title: "Clustering",
            route: '/Clustering',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "9",
            parentID: "0",
            title: "Mapping",
            route: '/map',
            allowedAccessLevels: [
                accessTypes.SuperUser,
                accessTypes.Buyer,
                accessTypes.Supplier,
                accessTypes.Store
            ],
            routeType: RouteType.Folder
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

const RouteType = {
    Folder: 0,
    File: 1,
    Software: 2
}


export default RouteController;