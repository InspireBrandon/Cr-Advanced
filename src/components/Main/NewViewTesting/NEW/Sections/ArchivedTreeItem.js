import TreeItem from './TreeItem'
import Axios from "axios";

class ArchivedTreeItem {
    constructor(data) {
        let self = this;
        self.vueCtx = data.vueCtx;
    }

    build(treeItems) {
        let self = this;

        let archivedTreeItem = buildArchivedFolder();

        treeItems.push(archivedTreeItem);
    }
}

function buildArchivedFolder() {
    let archivedTreeItem = new TreeItem({
        name: 'Archived Planograms',
        icon: "folder"
    });

    archivedTreeItem.click = function() {
        getArchivedPlanograms(data => {
            archivedTreeItem.children =  buildArchivedItems(data)
            archivedTreeItem.showChildren = !archivedTreeItem.showChildren;
            archivedTreeItem.icon = archivedTreeItem.showChildren ? 'folder_open' : 'folder';
        });
    }

    return archivedTreeItem;
}

function buildArchivedItems(archivedItems) {
    let archivedTreeItems = [];

    archivedItems.forEach(archivedItem => {
        let ai = new TreeItem({
            name: archivedItem.name,
            icon: 'insert_drive_file',
            showIcon: true,
            value: archivedItem
        })

        ai.click = function() {
            alert("Clicked");
        }

        archivedTreeItems.push(ai);
    });

    return archivedTreeItems;
}

function getArchivedPlanograms(callback) {
    Axios.get(process.env.VUE_APP_API + 'SystemFile/Archived?db=CR-DEVINSPIRE')
        .then(r => {
            callback(r.data);
        })
        .catch(e => {
            return [];
        })
}

export default ArchivedTreeItem;