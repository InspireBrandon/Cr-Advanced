// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A layer that provides access checks to the planogram distribution tool
// Author: Brandon Lange
// Date: 2019-09-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////
function StatusHandler() {
    let self = this;

    const buttons = [
        // new ButtonItem({
        //     id: 'store_overview',
        //     icon: 'store',
        //     buttonColor: '',
        //     iconColor: 'black',
        //     tooltip: 'Store overview',
        //     availableStatuses: [
        //         PlanogramStoreStatus.Assigned,
        //         PlanogramStoreStatus.Distrubuted,
        //         PlanogramStoreStatus.ImplementationInProgress,
        //         PlanogramStoreStatus.Implemented,
        //         PlanogramStoreStatus.Recalled,
        //         PlanogramStoreStatus.Unassigned,
        //         PlanogramStoreStatus.Variation
        //     ],
        //     allowedUsers: [
        //         UserTypes.SuperUser
        //     ],
        //     allowRupert: true
        // }),
        new ButtonItem({
            id: 'view',
            icon: 'visibility',
            buttonColor: '',
            iconColor: 'orange',
            tooltip: 'View Planogram',
            availableStatuses: [
                PlanogramStoreStatus.Assigned,
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress,
                PlanogramStoreStatus.Implemented
            ],
            allowedUsers: [
                UserTypes.SuperUser,
                UserTypes.Buyer,
                UserTypes.Supplier,
                UserTypes.Store
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'assign',
            icon: 'assignment',
            buttonColor: '',
            iconColor: 'primary',
            tooltip: 'Assign planogram',
            availableStatuses: [
                PlanogramStoreStatus.Unassigned
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: false
        }),
        new ButtonItem({
            id: 'replace_planogram',
            icon: 'swap_horiz',
            buttonColor: '',
            iconColor: 'success',
            tooltip: 'Replace',
            availableStatuses: [
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress,
                PlanogramStoreStatus.Implemented,
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: false
        }),
        new ButtonItem({
            id: 'distribute',
            icon: 'send',
            buttonColor: '',
            iconColor: 'success',
            tooltip: 'Distribute',
            availableStatuses: [
                PlanogramStoreStatus.Assigned
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'set_implemented',
            icon: 'check',
            buttonColor: '',
            iconColor: '',
            tooltip: 'Implement',
            availableStatuses: [
                PlanogramStoreStatus.Assigned,
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress
            ],
            allowedUsers: [
                UserTypes.SuperUser,
                UserTypes.Store
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'model_variation',
            icon: 'M',
            buttonColor: '',
            iconColor: 'warning',
            tooltip: 'Request Model Variation',
            availableStatuses: [
                PlanogramStoreStatus.Assigned,
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress,
                PlanogramStoreStatus.Implemented
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'store_variation',
            icon: 'S',
            buttonColor: '',
            iconColor: 'warning',
            tooltip: 'Request Store Variation',
            availableStatuses: [
                PlanogramStoreStatus.Assigned,
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress,
                PlanogramStoreStatus.Implemented
            ],
            allowedUsers: [
                UserTypes.SuperUser,
                UserTypes.Store
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'park',
            icon: 'time_to_leave',
            buttonColor: '',
            iconColor: 'black',
            tooltip: 'Park',
            availableStatuses: [
                PlanogramStoreStatus.Assigned,
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress,
                PlanogramStoreStatus.Implemented,
                PlanogramStoreStatus.Recalled,
                PlanogramStoreStatus.Unassigned,
                PlanogramStoreStatus.Variation
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'continue',
            icon: 'stop',
            buttonColor: '',
            iconColor: 'black',
            tooltip: 'Continue',
            availableStatuses: [
                PlanogramStoreStatus.OnHold
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: true
        }),
        new ButtonItem({
            id: 'remove_planogram_from_store',
            icon: 'remove_circle_outline',
            buttonColor: '',
            iconColor: 'error',
            tooltip: 'Remove Planogram From Store',
            availableStatuses: [
                PlanogramStoreStatus.Distrubuted,
                PlanogramStoreStatus.ImplementationInProgress,
                PlanogramStoreStatus.Implemented,
            ],
            allowedUsers: [
                UserTypes.SuperUser
            ],
            allowRupert: true
        }),
    ];

    self.getButtons = function () {
        return buttons;
    }
}

function ButtonItem(data) {
    let self = this;
    self.id = data.id;
    self.icon = data.icon;
    self.buttonColor = data.buttonColor;
    self.iconColor = data.iconColor;
    self.tooltip = data.tooltip;
    self.availableStatuses = data.availableStatuses;
    self.allowedUsers = data.allowedUsers;
    self.allowRupert = data.allowRupert;
}

const UserTypes = {
    SuperUser: 0,
    Buyer: 1,
    Supplier: 2,
    Store: 3
}

const PlanogramStoreStatus = {
    Unassigned: 0,
    Assigned: 1,
    Distrubuted: 2,
    ImplementationInProgress: 3,
    Implemented: 4,
    Variation: 5,
    OnHold: 6,
    Recalled: 7
}

export default StatusHandler;