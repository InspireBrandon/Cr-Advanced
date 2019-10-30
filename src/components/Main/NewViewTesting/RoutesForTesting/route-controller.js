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
            title: "Requesting Approval",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "1.1.1",
            parentID: "1.1",
            title: "Garden Accessories",
            route: `/TestingView/PlanogramImplementationNew/2/1069/12`,
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "1.1.2",
            parentID: "1.1",
            title: "Adhesives and Sealants",
            route: `/TestingView/PlanogramImplementationNew/28/1155/12`,
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "1.1.3",
            parentID: "1.1",
            title: "Beverages Refrigerated",
            route: `/TestingView/PlanogramImplementationNew/85/293/12`,
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.File
        }),
        new RouteItem({
            id: "1.2",
            parentID: "1",
            title: "Complete",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "1.3",
            parentID: "1",
            title: "In progress",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder
        }),
        new RouteItem({
            id: "1.4",
            parentID: "1",
            title: "RequestingApproval",
            allowedAccessLevels: [
                accessTypes.SuperUser
            ],
            routeType: RouteType.Folder
        }),
        // new RouteItem({
        //     id: "1.2",
        //     parentID: "1",
        //     title: "View",
        //     allowedAccessLevels: [
        //         accessTypes.Supplier,
        //         accessTypes.Buyer
        //     ],
        //     routeType: RouteType.File
        // }),
        // new RouteItem({
        //     id: "1.3",
        //     parentID: "1",
        //     title: "Space Planning",
        //     route: "/SpacePlanning",
        //     allowedAccessLevels: [
        //         accessTypes.SuperUser
        //     ],
        //     routeType: RouteType.Software
        // }),
        // new RouteItem({
        //     id: "1.4",
        //     parentID: "1",
        //     title: "Default Fixtures",
        //     route: "/Fixtures",
        //     allowedAccessLevels: [
        //         accessTypes.SuperUser
        //     ],
        //     routeType: RouteType.Software
        // }),
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

const SectionType = {
    Event: 0,
    DataPreparation: 1,
    Ranging: 2,
    Planogram: 3,
    Promotion: 4,
    Empty: 5,
    Subtask: 6,
    Mail: 7
}

const ProccessLevel = {
    InProgress: 0,
    Complete: 1,
    Workshop: 2,
    WorkshopEnded: 3,
    Meeting: 4,
    DataPreparationStart: 5,
    RangingStart: 6,
    PlanogramStart: 7,
    MeetingSupplier: 8,
    RequestingApproval: 9,
    Declined: 10,
    Approved: 11,
    ImplementationPending: 12,
    VariationRequest: 13,
    Implemented: 14,
    OnHold: 15,
    WaitingFixtureRequirements: 16,
    WaitingSupplier: 17,
    AwaitingDistribution: 18,
    ApprovalInProgress: 19,
    DistributionInProgress: 20,
    ReviewRange: 21,
    ReviewPlanogram: 22,
    ImplementationInProgress: 23,
    Like: 24,
    ImplementationComplete: 25,
    DistributionComplete: 26,
    WaitingProductInfoStart: 27,
    WaitingProductInfoInProgress: 28,
    WaitingProductInfoComplete: 29,
    WaitingPlanogramInputStart: 30,
    WaitingPlanogramInputInProgress: 31,
    WaitingPlanogramInputComplete: 32,
    WaitingFixtureInputStart: 33,
    WaitingFixtureInputInProgress: 34,
    WaitingFixtureInputComplete: 35,
    WaitingCheckPlanogramStart: 36,
    WaitingCheckPlanogramInProgress: 37,
    WaitingCheckPlanogramComplete: 38,
    AssignedTo: 39,
    RequestNewVariant: 40,
    TaskTakeover: 41,
    Mail: 42,
    DistributionViewed: 43,
    Park: 44,
    VariationInProgress: 45,
    VariationComplete: 46,
    VariationSent: 47,
    Recalled: 48,
    RecallViewed: 49,
    RecallCompleted: 50,
    RecallSent: 51
}

export default RouteController;