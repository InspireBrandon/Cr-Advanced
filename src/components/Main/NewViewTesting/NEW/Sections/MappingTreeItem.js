import TreeItem from './TreeItem'
import moment from 'moment'
import Axios from "axios";
import {
    EventBus
} from '@/libs/events/event-bus.js';
import jwt from "jsonwebtoken";


let event_data = {
    retailers: [],
    mapImages: [],
    MarketShare: [],
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
        // locations
        let mapItems = buildLocationsFolder(self.vueCtx)
        mappingTreeItem.children.push(mapItems)

        // Map Images
        let ImageItems = buildImageFolder(self.vueCtx)
        mappingTreeItem.children.push(ImageItems)
        // Market share 
        let marketShareItems = buildMarketShareFolder(self.vueCtx)
        mappingTreeItem.children.push(marketShareItems)




        treeItems.push(mappingTreeItem);

        EventBus.$on("MAPPING_LOADED", redrawMap(event_data));
    }
}

function buildMarketShareFolder(vueCtx) {
    let self = this;

    let MarketShareTreeItem = new TreeItem({
        name: "Market Share",
        icon: "folder",
        allowComparison: true,
    })

    MarketShareTreeItem.click = function () {
        if (MarketShareTreeItem.showChildren) {
            MarketShareTreeItem.showChildren = false;
            MarketShareTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            MarketShareTreeItem.children = [];
            MarketShareTreeItem.loading = true;

            GetMarketSharePeriodHeaders(locationGroups => {
                MarketShareTreeItem.children = buildMarkeetShareSubFolders(locationGroups, vueCtx);
                MarketShareTreeItem.icon = 'folder_open';
                MarketShareTreeItem.loading = false;
                MarketShareTreeItem.showChildren = true;
            })
        }
    }
    MarketShareTreeItem.onComparisonSelect = function () {
        // todo : set children as comparison = true
    }

    return MarketShareTreeItem;
}

function buildMarkeetShareSubFolders(locationGroups, vueCtx) {
    let locationGroupItems = [];
    // let todayTreeItem = new TreeItem({
    //     name: "recent",
    //     icon: "folder"
    // })
    let todayTreeItem = new TreeItem({
        name: moment(locationGroups[0].period_To_Date).format('YYYY-MM'),
        icon: "folder",
        allowSelect: false
    })

    todayTreeItem.click = function () {
        if (todayTreeItem.showChildren) {
            todayTreeItem.showChildren = false;
            todayTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            todayTreeItem.children = [];
            todayTreeItem.loading = true;

            GetMarketShareInnerHeaders(locationGroups[0].periodTo, locations => {
                todayTreeItem.children = buildMarketShareItems([locations[0]], vueCtx);
                todayTreeItem.icon = 'folder_open';
                todayTreeItem.loading = false;
                todayTreeItem.showChildren = true;
            })
        }
    }

    todayTreeItem.onSelect = function () {
        if (todayTreeItem.showChildren) {
            todayTreeItem.children.forEach(child => {
                child.selected = todayTreeItem.selected;
            })
        } else {
            // empty out parent array
            todayTreeItem.children = [];
            todayTreeItem.loading = true;

            GetMarketShareInnerHeaders(locationGroups[0].periodTo, locations => {
                todayTreeItem.children = buildMarketShareItems([locations[0]], vueCtx);
                todayTreeItem.icon = 'folder_open';
                todayTreeItem.loading = false;
                todayTreeItem.showChildren = true;
            })
        }
    }


    let oldertreeItem = new TreeItem({
        name: "Older",
        icon: "folder"
    })

    oldertreeItem.click = function () {
        if (oldertreeItem.showChildren) {
            oldertreeItem.showChildren = false;
            oldertreeItem.icon = 'folder';
        } else {
            // empty out parent array
            oldertreeItem.children = [];
            oldertreeItem.loading = true;

            GetMarketSharePeriodHeaders(locationGroups => {
                oldertreeItem.children = buildMarketShareGroupFolders(locationGroups, vueCtx);
                oldertreeItem.icon = 'folder_open';
                oldertreeItem.loading = false;
                oldertreeItem.showChildren = true;
            })
        }
    }
    locationGroupItems.push(todayTreeItem)
    locationGroupItems.push(oldertreeItem)
    return locationGroupItems

}

function buildMarketShareGroupFolders(MarketShareGroups, vueCtx) {
    let locationGroupItems = [];

    MarketShareGroups.forEach((MarketShareGroup, idx) => {
        if (idx > 0) {
            let MarketShareGroupTreeItem = new TreeItem({
                name: moment(MarketShareGroup.period_To_Date).format('YYYY-MM'),
                icon: "folder",
                allowSelect: false
            })

            MarketShareGroupTreeItem.click = function () {
                if (MarketShareGroupTreeItem.showChildren) {
                    MarketShareGroupTreeItem.showChildren = false;
                    MarketShareGroupTreeItem.icon = 'folder';
                } else {
                    // empty out parent array
                    MarketShareGroupTreeItem.children = [];
                    MarketShareGroupTreeItem.loading = true;

                    GetMarketShareInnerHeaders(MarketShareGroup.periodTo, locations => {
                        MarketShareGroupTreeItem.children = buildMarketShareItems(locations, vueCtx);
                        MarketShareGroupTreeItem.icon = 'folder_open';
                        MarketShareGroupTreeItem.loading = false;
                        MarketShareGroupTreeItem.showChildren = true;
                    })
                }
            }

            MarketShareGroupTreeItem.onSelect = function () {
                if (MarketShareGroupTreeItem.showChildren) {
                    MarketShareGroupTreeItem.children.forEach(child => {
                        child.selected = MarketShareGroupTreeItem.selected;
                    })
                } else {
                    // empty out parent array
                    MarketShareGroupTreeItem.children = [];
                    MarketShareGroupTreeItem.loading = true;

                    GetMarketShareInnerHeaders(MarketShareGroup.periodTo, locations => {
                        MarketShareGroupTreeItem.children = buildMarketShareItems(locations, vueCtx);
                        MarketShareGroupTreeItem.icon = 'folder_open';
                        MarketShareGroupTreeItem.loading = false;
                        MarketShareGroupTreeItem.showChildren = true;
                    })
                }
            }

            locationGroupItems.push(MarketShareGroupTreeItem);
        }

    })

    return locationGroupItems;
}

function buildMarketShareItems(locations, vueCtx) {
    let headers = ["Store", "Department", "Category", "Brand"]
    let locationItems = [];

    locations.forEach(MarketShareGroup => {

        let MarketShareGroupTreeItem = new TreeItem({
            name: headers[MarketShareGroup.import_Level],
            icon: "folder",
            allowSelect: false,
            showImage: false,
            showIcon: true,
            value: MarketShareGroup.import_Level
        })
        MarketShareGroupTreeItem.click = function () {
            if (MarketShareGroupTreeItem.showChildren) {
                MarketShareGroupTreeItem.showChildren = false;
                MarketShareGroupTreeItem.icon = 'folder';
            } else {
                // empty out parent array
                MarketShareGroupTreeItem.children = [];
                MarketShareGroupTreeItem.loading = true;

                GetMarketShareTXHeaders(MarketShareGroup.periodTo, MarketShareGroup.import_Level, locations => {
                    MarketShareGroupTreeItem.children = buildMarketShareFinalItems(locations, vueCtx);
                    MarketShareGroupTreeItem.icon = 'folder_open';
                    MarketShareGroupTreeItem.loading = false;
                    MarketShareGroupTreeItem.showChildren = true;
                })
            }
        }
        // locationTreeItem.click = function () {
        //     locationTreeItem.selected = !locationTreeItem.selected;

        //     let config = getMapConfig(vueCtx, () => {
        //         // Trigger event bus to redraw map
        //         checkMapping(vueCtx, {
        //             retailers: [],
        //             mapImages: [],
        //         })
        //     });
        // }

        // locationTreeItem.onSelect = function () {
        //     // Trigger event bus to redraw map
        // }

        locationItems.push(MarketShareGroupTreeItem);
    })

    return locationItems;
}

function buildMarketShareFinalItems(locations, vueCtx) {
    let ImageItems = [];

    locations.forEach(location => {
        let imageItem = new TreeItem({
            name: location.name,
            icon: "flag",
            allowSelect: true,
            showIcon: true,
            value: location
        })

        imageItem.click = function () {
            imageItem.selected = !imageItem.selected;

            let config = getMapConfig(vueCtx, () => {
                // Trigger event bus to redraw map
                checkMapping(vueCtx, {
                    retailers: [],
                    mapImages: [],
                    marketShareItems: [],
                })
            });
        }

        imageItem.onSelect = function () {
            // Trigger event bus to redraw map

        }

        ImageItems.push(imageItem);
    })

    return ImageItems;
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

function buildImageFolders(locations, vueCtx) {
    let ImageItems = [];

    locations.forEach(location => {
        let imageItem = new TreeItem({
            name: location.name,
            icon: "flag",
            allowSelect: true,
            showImage: true,
            showIcon: false,
            imageSrc: MapImage(location.id),
            value: location.id
        })

        imageItem.click = function () {
            imageItem.selected = !imageItem.selected;

            vueCtx.$nextTick(() => {
                let config = getMapConfig(vueCtx, () => {
                    // Trigger event bus to redraw map
                    checkMapping(vueCtx, {
                        retailers: [],
                        mapImages: [],
                        marketShareItems: [],

                    })
                });
            })
        }

        imageItem.onSelect = function () {
            // Trigger event bus to redraw map

        }

        ImageItems.push(imageItem);
    })

    return ImageItems;
}

function buildImageFolder(vueCtx) {
    let self = this;

    let imageTreeItem = new TreeItem({
        name: "Images",
        icon: "folder"
    })

    imageTreeItem.click = function () {
        if (imageTreeItem.showChildren) {
            imageTreeItem.showChildren = false;
            imageTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            imageTreeItem.children = [];
            imageTreeItem.loading = true;

            getMaps(Maps => {
                imageTreeItem.children = buildImageFolders(Maps, vueCtx);
                imageTreeItem.icon = 'folder_open';
                imageTreeItem.loading = false;
                imageTreeItem.showChildren = true;
            })
        }
    }

    return imageTreeItem;
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
                    retailers: [],
                    mapImages: [],
                    marketShareItems: [],

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

function MapImage(MapID) {
    return process.env.VUE_APP_API +
        `MapImage?mapImageID=${MapID}&type=map`
}

function checkMapping(vueCtx, ) {
    if (vueCtx.$route.name == "map") {
        redrawMap()
    } else {
        vueCtx.$router.push("/map/:params")
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

        let images = mappingTreeItem.children[1];
        let tmpimages = []

        let tmpimagesgroups = images.children;


        tmpimagesgroups.forEach(image => {

            if (image.selected) {

                tmpimages.push(image.value)
            }
        })

        event_data.mapImages = tmpimages
        let marketShareItems = mappingTreeItem.children[2];

        let tmpMarketShareITems = []

        let tmpShares = marketShareItems.children;


        tmpShares.forEach((item, idx) => {
            item.children.forEach((categoryFolders) => {

                categoryFolders.children.forEach((child) => {
                    if (idx == 0) {
                        if (child.selected) {
                            child.value.Comparison = marketShareItems.Comparison
                            tmpMarketShareITems.push(child.value)
                        }
                    } else {
                        child.children.forEach(olderItem => {

                            if (olderItem.selected) {
                                olderItem.value.Comparison = marketShareItems.Comparison
                                tmpMarketShareITems.push(olderItem.value)
                            }
                        })
                    }
                })
            })
        })


        event_data.MarketShare = tmpMarketShareITems
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

function getMaps(callback) {
    let self = this

    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
        callback(r.data)
    })
}

function GetMarketSharePeriodHeaders(callback) {
    let self = this

    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
    let encoded_details = jwt.decode(sessionStorage.accessToken);
    let systemUserID = encoded_details.USER_ID;
    Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/PeriodHeaders?userID=` + systemUserID).then(r => {

        callback(r.data)
    })
}

function GetMarketShareInnerHeaders(periodTo, callback) {
    let self = this
    // todo build calls for brand/department etc
    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
    let encoded_details = jwt.decode(sessionStorage.accessToken);
    let systemUserID = encoded_details.USER_ID;
    Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/Levels?userID=${systemUserID}&periodTo=${periodTo}`).then(r => {

        callback(r.data)
    })
}

function GetMarketShareTXHeaders(periodTo, importlevel, callback) {
    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
    let encoded_details = jwt.decode(sessionStorage.accessToken);
    let systemUserID = encoded_details.USER_ID;
    Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/type?userID=${systemUserID}&periodTo=${periodTo}&importlevel=${importlevel}`).then(r => {
        console.log("GetMarketShareTXHeaders", r.data);

        callback(r.data)
    })
}


export default MappingTreeItem;