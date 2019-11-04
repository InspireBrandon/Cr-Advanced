class RouteItem {
    constructor(data) {
        let self = this;
        self.showChildren = data.showChildren;
        self.showChildrenCount = false;
        self.id = data.id;
        self.parentID = data.parentID;
        self.title = data.title;
        self.route = data.route;
        self.allowedAccessLevels = data.allowedAccessLevels;
        self.routeType = data.routeType;
    }
}
export default RouteItem;