class RouteItem {
    constructor(data) {
        let self = this;
        self.showChildren = false;
        self.id = data.id;
        self.group = data.group;
        self.parentID = data.parentID;
        self.title = data.title;
        self.route = data.route;
        self.allowedAccessLevels = data.allowedAccessLevels;
        self.routeType = data.routeType;
    }
}
export default RouteItem;