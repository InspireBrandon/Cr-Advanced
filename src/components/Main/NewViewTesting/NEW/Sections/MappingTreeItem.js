import TreeItem from './TreeItem'
import Axios from "axios";
import {
    EventBus
} from '@/libs/events/event-bus.js';

let event_data = {
    retailers: []
}

let mappingTreeItem = null;

class MappingTreeItem {
    constructor(data) {
        let self = this;
        self.vueCtx = data.vueCtx;
    }

    build(treeItems) {
        let self = this;

        mappingTreeItem = buildMappingFolder();

        let mapItems = buildLocationsFolder(self.vueCtx)

        mappingTreeItem.children.push(mapItems)

        treeItems.push(mappingTreeItem);

        EventBus.$on("MAPPING_LOADED", redrawMap(event_data));
    }
}

function buildMappingFolder() {
    let self = this;

    let mappingTreeItem = new TreeItem({
        name: "Spatial Mapping",
        icon: "folder"
    })

    mappingTreeItem.click = function () {
        mappingTreeItem.showChildren = !mappingTreeItem.showChildren;
        mappingTreeItem.icon = mappingTreeItem.showChildren ? 'folder_open' : 'folder';
    }

    return mappingTreeItem;
}

function buildLocationsFolder(vueCtx) {
    let self = this;

    let locationTreeItem = new TreeItem({
        name: "Locations",
        icon: "folder"
    })

    locationTreeItem.click = function () {
        if (locationTreeItem.showChildren) {
            locationTreeItem.showChildren = false;
            locationTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            locationTreeItem.children = [];
            locationTreeItem.loading = true;

            getLocationGroups(locationGroups => {
                locationTreeItem.children = buildLocationGroupFolders(locationGroups, vueCtx);
                locationTreeItem.icon = 'folder_open';
                locationTreeItem.loading = false;
                locationTreeItem.showChildren = true;
            })
        }
    }

    return locationTreeItem;
}

function buildLocationGroupFolders(locationGroups, vueCtx) {
    let locationGroupItems = [];

    locationGroups.forEach(locationGroup => {
        let locationGroupTreeItem = new TreeItem({
            name: locationGroup.name,
            icon: "folder",
            allowSelect: true
        })

        locationGroupTreeItem.click = function () {
            if (locationGroupTreeItem.showChildren) {
                locationGroupTreeItem.showChildren = false;
                locationGroupTreeItem.icon = 'folder';
            } else {
                // empty out parent array
                locationGroupTreeItem.children = [];
                locationGroupTreeItem.loading = true;

                getLocationsByGroupID(locationGroup.id, locations => {
                    locationGroupTreeItem.children = buildLocationFolders(locations, vueCtx);
                    locationGroupTreeItem.icon = 'folder_open';
                    locationGroupTreeItem.loading = false;
                    locationGroupTreeItem.showChildren = true;
                })
            }
        }

        locationGroupTreeItem.onSelect = function () {
            if (locationGroupTreeItem.showChildren) {
                locationGroupTreeItem.children.forEach(child => {
                    child.selected = locationGroupTreeItem.selected;
                })
            } else {
                // empty out parent array
                locationGroupTreeItem.children = [];
                locationGroupTreeItem.loading = true;

                getLocationsByGroupID(locationGroup.id, locations => {
                    locationGroupTreeItem.children = buildLocationFolders(locations, vueCtx);
                    locationGroupTreeItem.icon = 'folder_open';
                    locationGroupTreeItem.loading = false;
                    locationGroupTreeItem.showChildren = true;
                })
            }
        }

        locationGroupItems.push(locationGroupTreeItem);
    })

    return locationGroupItems;
}

function buildLocationFolders(locations, vueCtx) {
    let locationItems = [];

    locations.forEach(location => {
        let locationTreeItem = new TreeItem({
            name: location.name,
            icon: "flag",
            allowSelect: true,
            showImage: true,
            showIcon: false,
            imageSrc: retailerImage(location.id),
            value: location.id
        })

        locationTreeItem.click = function () {
            locationTreeItem.selected = !locationTreeItem.selected;

            let config = getMapConfig(vueCtx, () => {
                // Trigger event bus to redraw map
                checkMapping(vueCtx, {
                    retailers: []
                })
            });
        }

        locationTreeItem.onSelect = function () {
            // Trigger event bus to redraw map
        }

        locationItems.push(locationTreeItem);
    })

    return locationItems;
}

function retailerImage(retailerID) {
    return process.env.VUE_APP_API + `Retailer/Image?retailerID=${retailerID}`
}

function checkMapping(vueCtx, ) {
    if (vueCtx.$route.name == "map") {
        redrawMap()
    } else {
        vueCtx.$router.push("/map")
    }
}

function redrawMap() {
    EventBus.$emit('MAPPING_REDRAW', event_data);
}

function getMapConfig(vueCtx, callback) {
    vueCtx.$nextTick(() => {
        let locations = mappingTreeItem.children[0];
        let tmpRetailers = []

        let groups = locations.children;

        groups.forEach(group => {
            group.children.forEach(retailer => {
                if (retailer.selected) {
                    tmpRetailers.push(retailer.value)
                }
            })
        })

        event_data.retailers = tmpRetailers;

        callback();
    })
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// SERVICE CALLS
// ////////////////////////////////////////////////////////////////////////////////////////////////////
function getLocationGroups(callback) {
    let self = this;

    Axios.get(process.env.VUE_APP_API + "RetailerGroup")
        .then(r => {
            callback(r.data.retailerGroupList)
        })
}

function getLocationsByGroupID(retailerGroupID, callback) {
    let self = this;

    Axios.get(process.env.VUE_APP_API + `Retailer?retailerGroupID=${retailerGroupID}`)
        .then(r => {
            callback(r.data.retailerList)
        })
}

export default MappingTreeItem;