import TreeItem from '../TreeItem'
import ActionItem from '../ActionItem'
import Axios from "axios";

class FolderTreeItem {
    constructor(data) {
        let self = this;
        self.vueCtx = data.vueCtx;
    }

    build(treeItems) {
        let self = this;

        let mappingTreeItem = buildMappingFolder();

        treeItems.push(mappingTreeItem);
    }
}

function buildMappingFolder() {
    let mappingTreeItem = new TreeItem({
        name: "Spatial Mapping",
        icon: "folder"
    })

    mappingTreeItem.children = buildSecondLevelFolders();

    mappingTreeItem.click = function () {
        mappingTreeItem.showChildren = !mappingTreeItem.showChildren;
        mappingTreeItem.icon = mappingTreeItem.showChildren ? 'folder_open' : 'folder';
    }

    return mappingTreeItem;
}

function buildSecondLevelFolders() {
    let secondLevelFolders = [];

    let myFolderTreeItem = new TreeItem({
        name: "My Documents",
        icon: "folder"
    })

    let addFolder = new ActionItem({
        name: 'add folder',
        icon: 'create_new_folder'
    })

    let addFile = new ActionItem({
        name: 'add file',
        icon: 'insert_drive_file'
    })

    myFolderTreeItem.actions = [addFolder, addFile]

    myFolderTreeItem.click = function() {

    }

    let sharedFolderTreeItem = new TreeItem({
        name: "Shared Documents",
        icon: "folder"
    })

    sharedFolderTreeItem.click = function() {

    }

    secondLevelFolders.push(myFolderTreeItem, sharedFolderTreeItem)
    return secondLevelFolders;
}

export default FolderTreeItem;