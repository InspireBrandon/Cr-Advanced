class RouteItem {
    constructor(data) {
        let self = this;
        self.id = data.id;
        self.parentID = data.parentID;
        self.title = data.title;
        self.route = data.route;
        self.allowedAccessLevels = data.allowedAccessLevels;
    }
}

export default RouteItem;