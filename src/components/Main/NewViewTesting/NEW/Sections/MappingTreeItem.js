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
let retailerGroup_state = []
let state_data = {
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

        mappingTreeItem = buildMappingFolder(self.vueCtx);

        // locations
        let mapItems = buildLocationsFolder(self.vueCtx)
        mappingTreeItem.children.push(mapItems)

        // Map Images
        let ImageItems = buildImageFolder(self.vueCtx)
        mappingTreeItem.children.push(ImageItems)
        // Market share 
        let marketShareItems = buildMarketShareFolder(self.vueCtx)
        mappingTreeItem.children.push(marketShareItems)



        let BiItems = buildBIFolder(self.vueCtx)
        mappingTreeItem.children.push(BiItems)



        treeItems.push(mappingTreeItem);

        EventBus.$on("MAPPING_LOADED", redrawMap(event_data));
    }
}

function buildBIFolder(vueCtx) {
    let self = this;

    let MarketShareTreeItem = new TreeItem({
        name: "Heatmaps",
        icon: "folder",
    })

    MarketShareTreeItem.click = function () {
        if (MarketShareTreeItem.showChildren) {
            MarketShareTreeItem.showChildren = false;
            MarketShareTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            MarketShareTreeItem.children = [];
            MarketShareTreeItem.loading = true;

            MarketShareTreeItem.icon = 'folder_open';
            MarketShareTreeItem.loading = false;
            MarketShareTreeItem.showChildren = true;
            MarketShareTreeItem.children = [new TreeItem({
                name: "Store Sales HinterLand",
                icon: "insert_drive_file",
                click: function () {
                    vueCtx.$router.push("/bi")
                }
            }), new TreeItem({
                name: "Brand Sales Marltons",
                icon: "insert_drive_file",
                click: function () {
                    vueCtx.$router.push("/bi")
                }
            })]


        }
    }
    return MarketShareTreeItem
}

function buildMarketShareFolder(vueCtx) {
    let self = this;

    let MarketShareTreeItem = new TreeItem({
        name: "Market Share",
        icon: "folder",
        // allowComparison: true,
    })

    MarketShareTreeItem.click = function () {
        if (MarketShareTreeItem.showChildren) {
            MarketShareTreeItem.showChildren = false;
            MarketShareTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            MarketShareTreeItem.children = [];
            MarketShareTreeItem.loading = true;

            let supplierItem = new TreeItem({
                name: "Brand Sales Marltons",
                icon: "folder",
                click: function () {
                    if (supplierItem.showChildren) {
                        supplierItem.showChildren = false;
                        supplierItem.icon = 'folder';
                    } else {
                        // empty out parent array
                        supplierItem.children = [];
                        supplierItem.loading = true;
                       
                        GetMarketSharePeriodHeaders(locationGroups => {
                            console.log("[STARTS BUILD MARLTONS BRAND SALES]",locationGroups);
                            GetMarketShareInnerHeaders(locationGroups[0].periodTo, locations => {
                                supplierItem.children = buildMarketShareItems(locations, vueCtx);
                                supplierItem.icon = 'folder_open';
                                supplierItem.loading = false;
                                supplierItem.showChildren = true;
                            })
                            
                        })
                    }
                }
            })
            let retailerItem = new TreeItem({
                name: "Store Sales HinterLand",
                icon: "folder",
                loading: false,
                // to do insert children + clickevents
                click: function () {

                    if (retailerItem.showChildren) {
                        retailerItem.showChildren = false;
                        retailerItem.icon = 'folder';
                    } else {
                        // empty out parent array
                        retailerItem.children = [];
                        retailerItem.loading = true;
                        
                        GetMarketSharePeriodHeaders(locationGroups => {
                            console.log("GetMarketSharePeriodHeaders [AFTER CALLBACK]" );
                            
                            retailerItem.children = buildRetailerFolders(locationGroups, vueCtx);
                            retailerItem.icon = 'folder_open';
                            retailerItem.loading = false;
                            retailerItem.showChildren = true;
                        })
                    }
                }
            })

            MarketShareTreeItem.children = [
                retailerItem, supplierItem
            ];
            MarketShareTreeItem.icon = 'folder_open';
            MarketShareTreeItem.loading = false;
            MarketShareTreeItem.showChildren = true;

        }
    }


    return MarketShareTreeItem;
}

function buildRetailerFolders(PeriodHeaders, vueCtx) {
    console.log("buildRetailerFolders", PeriodHeaders);

    let retailerGroupItems = []
    let retailerTreeItem = new TreeItem({
        name: moment(PeriodHeaders[0].period_To_Date).format('YYYY-MM'),
        icon: "folder"
    })

    retailerTreeItem.click = function () {
        if (retailerTreeItem.showChildren) {
            retailerTreeItem.showChildren = false;
            retailerTreeItem.icon = 'folder';
        } else {
            // empty out parent array
            retailerTreeItem.children = [];
            retailerTreeItem.loading = true;

            // GetMarketSharePeriodHeaders(locationGroups => {
            //     retailerTreeItem.children = buildMarketShareGroupFolders(locationGroups, vueCtx);
            //     retailerTreeItem.icon = 'folder_open';
            //     retailerTreeItem.loading = false;
            //     retailerTreeItem.showChildren = true;
            // })
        }
    }
    retailerGroupItems.push(retailerTreeItem)
    console.log(retailerGroupItems);

    return retailerGroupItems

}

function buildMarkeetShareSubFolders(locationGroups, vueCtx) {
    let locationGroupItems = [];
    GetMarketShareInnerHeaders(locationGroups[0].periodTo, locations => {
        // var todayTreeItem = buildMarketShareItems([locations[0]], vueCtx);
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
        // locationGroupItems.push(todayTreeItem)
        locationGroupItems.push(oldertreeItem)
        return locationGroupItems

    })
}

function buildMarketShareGroupFolders(MarketShareGroups, vueCtx) {
    let locationGroupItems = [];
    console.log("MarketShareGroups", MarketShareGroups);

    MarketShareGroups.forEach((MarketShareGroup, idx) => {
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
            if(imageItem.selected){
                state_data.MarketShare.push(imageItem.value)
            }else{
                state_data.MarketShare.forEach((state,idx)=>{
                    if(state.id==imageItem.value.id){
                        state_data.MarketShare.splice(idx,1)
                    }
                })
            }


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

function buildMappingFolder(vueCtx) {
    let self = this;

    let mappingTreeItem = new TreeItem({
        name: "Spatial Mapping",
        icon: "folder"
    })

    mappingTreeItem.click = function () {
        mappingTreeItem.showChildren = !mappingTreeItem.showChildren;
        mappingTreeItem.icon = mappingTreeItem.showChildren ? 'folder_open' : 'folder';
        if (mappingTreeItem.showChildren)
            checkMapping(vueCtx)
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
        state_data.mapImages.forEach(state => {
            if (state == imageItem.value) {
                imageItem.selected = true
            }
        })
        imageItem.click = function () {
            imageItem.selected = !imageItem.selected;
            if (imageItem.selected) {
                state_data.mapImages = [imageItem.value]
            } else {
                state_data.mapImages.forEach((state, idx) => {
                    if (state == imageItem.value) {
                        state_data.mapImages.splice(idx, 1)
                    }
                })
            }
            let images = mappingTreeItem.children[1];
            let tmpimages = []
            let tmpimagesgroups = images.children;
            tmpimagesgroups.forEach(item => {

                if (item.value != imageItem.value) {

                    item.selected = false
                }
            })
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
            if (imageItem.selected) {
                state_data.mapImages = [imageItem.value]
                // state_data.mapImages.push(imageItem.value)
            } else {
                state_data.mapImages.forEach((state, idx) => {
                    if (state == imageItem.value) {
                        state_data.mapImages.splice(idx, 1)
                    }
                })
            }
            let images = mappingTreeItem.children[1];
            let tmpimages = []
            let tmpimagesgroups = images.children;
            tmpimagesgroups.forEach(item => {

                if (item.value != imageItem.value) {

                    item.selected = false
                }
            })
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

        ImageItems.push(imageItem);
    })

    return ImageItems;
}

function buildImageFolder(vueCtx) {
    let self = this;

    let imageTreeItem = new TreeItem({
        name: "Maps",
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
    console.log("buildLocationGroupFolders", retailerGroup_state);


    locationGroups.forEach(locationGroup => {
        let locationGroupTreeItem = new TreeItem({
            name: locationGroup.name,
            icon: "folder",
            allowSelect: true,
            disabled: false,
            value: locationGroup.id
        })
        retailerGroup_state.forEach(groupstate => {
            if (groupstate == locationGroupTreeItem.value) {
                locationGroupTreeItem.selected = true
            }
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
            if (locationGroupTreeItem.selected) {
                retailerGroup_state.push(locationGroupTreeItem.value)
            } else {
                retailerGroup_state.forEach((groupstate, idx) => {
                    if (groupstate == locationGroupTreeItem.value) {
                        retailerGroup_state.splice(idx, 1)
                    }
                })
            }
            locationGroupTreeItem.disabled = true
            if (locationGroupTreeItem.showChildren) {
                locationGroupTreeItem.children.forEach(child => {
                    child.selected = locationGroupTreeItem.selected;
                    if (locationGroupTreeItem.selected) {

                        state_data.retailers.push(child.value)
                    } else {

                        state_data.retailers.forEach((state, idx) => {
                            if (child.value == state) {
                                state_data.retailers.splice(idx, 1)
                            }
                        })
                    }

                })
                let config = getMapConfig(vueCtx, () => {
                    // Trigger event bus to redraw map
                    checkMapping(vueCtx, {
                        retailers: [],
                        mapImages: [],
                        marketShareItems: [],

                    })
                });
            } else {
                // empty out parent array
                locationGroupTreeItem.children = [];
                locationGroupTreeItem.loading = true;

                getLocationsByGroupID(locationGroup.id, locations => {

                    locationGroupTreeItem.children = buildLocationFolders(locations, vueCtx);
                    locationGroupTreeItem.icon = 'folder_open';
                    locationGroupTreeItem.loading = false;
                    locationGroupTreeItem.showChildren = true;
                    if (locationGroupTreeItem.selected) {
                        locationGroupTreeItem.children.forEach(item => {
                            item.selected = true
                            state_data.retailers.push(item.value)
                        })
                        let config = getMapConfig(vueCtx, () => {
                            // Trigger event bus to redraw map
                            checkMapping(vueCtx, {
                                retailers: [],
                                mapImages: [],
                                marketShareItems: [],

                            })
                        });
                    } else {
                        locationGroupTreeItem.children.forEach(item => {
                            item.selected = false
                            state_data.retailers.forEach((state, idx) => {
                                if (state == item.value) {
                                    state_data.retailers.splice(idx, 1)
                                }
                            })


                        })

                    }

                })

            }
            locationGroupTreeItem.disabled = false
        }

        locationGroupItems.push(locationGroupTreeItem);
    })

    return locationGroupItems;
}

function buildLocationFolders(locations, vueCtx) {
    let locationItems = [];
    console.log("buildLocationFolders", locations);

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

        state_data.retailers.forEach(state => {

            if (locationTreeItem.value == state) {
                locationTreeItem.selected = true
            }
        })
        locationTreeItem.click = function () {
            locationTreeItem.disabled = true
            locationTreeItem.selected = !locationTreeItem.selected;
            if (locationTreeItem.selected) {
                state_data.retailers.push(locationTreeItem.value)
            } else {
                state_data.retailers.forEach((location, idx) => {
                    if (location == locationTreeItem.value) {
                        state_data.retailers.splice(idx, 1)
                    }
                })
            }

            let config = getMapConfig(vueCtx, () => {
                // Trigger event bus to redraw map
                checkMapping(vueCtx, {
                    retailers: [],
                    mapImages: [],
                    marketShareItems: [],

                })
            });
            locationTreeItem.disabled = false
        }

        locationTreeItem.onSelect = function () {
            locationTreeItem.disabled = true
            if (locationTreeItem.selected) {
                state_data.retailers.push(locationTreeItem.value)
            } else {
                state_data.retailers.forEach((location, idx) => {
                    if (location == locationTreeItem.value) {
                        state_data.retailers.splice(idx, 1)
                    }
                })
            }

            let config = getMapConfig(vueCtx, () => {
                // Trigger event bus to redraw map
                checkMapping(vueCtx, {
                    retailers: [],
                    mapImages: [],
                    marketShareItems: [],

                })
            });
            locationTreeItem.disabled = false
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
    console.log(vueCtx.$route.name);

    if (vueCtx.$route.name == "/map/:params") {
        redrawMap()
    } else {
        vueCtx.$router.push("/map/:params")
    }
}

function redrawMap() {
    console.log('MAPPING_REDRAW');

    EventBus.$emit('MAPPING_REDRAW', event_data);
}

function getMapConfig(vueCtx, callback) {
    vueCtx.$nextTick(() => {

        event_data = state_data
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
    console.log("GetMarketSharePeriodHeaders [STARTS]");

    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
    let encoded_details = jwt.decode(sessionStorage.accessToken);
    let systemUserID = encoded_details.USER_ID;
    Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/PeriodHeaders?userID=` + systemUserID).then(r => {
        console.log("GetMarketSharePeriodHeaders", r.data);
       
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
        console.log("GetMarketShareInnerHeaders", r.data);

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