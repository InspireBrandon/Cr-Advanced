import TreeItem from './TreeItem'
import Axios from "axios";
import jwt from 'jsonwebtoken';

class CheckPlanogramTreeItem {
    constructor(data) {
        let self = this;
        self.vueCtx = data.vueCtx;
    }

    build(treeItems) {
        let self = this;

        let checkPlanogramTreeItem = new TreeItem({
            name: 'Planograms to check',
            icon: "folder"
        });

        checkPlanogramTreeItem.click = function () {
            checkPlanogramTreeItem.showChildren = !checkPlanogramTreeItem.showChildren;
            checkPlanogramTreeItem.icon = checkPlanogramTreeItem.showChildren ? 'folder_open' : 'folder';
        }
        
        buildCheckPlanogramFolder(self.vueCtx.$router, children => {
            checkPlanogramTreeItem.children = children;
            checkPlanogramTreeItem.showChildrenCount = true;
        });

        treeItems.push(checkPlanogramTreeItem);
    }
}

function buildCheckPlanogramFolder(router, callback) {
    let checkPlanogramTreeItem = new TreeItem({
        name: 'Planograms to check',
        icon: "folder"
    });

    getUserTasks(data => {
        callback(buildCheckPlanogramItems(data, router));
    });
}

function buildCheckPlanogramItems(checkItems, router) {
    let checkPlanogramTreeItems = [];

    checkItems.forEach(checkItem => {
        var tmpName = checkItem.systemFileName.replace('- XXX ', '').replace('- 6MMA ', '').split('Module')[0];
        tmpName = tmpName.substring(0, tmpName.length - 4);

        let ai = new TreeItem({
            name: tmpName,
            icon: 'insert_drive_file',
            showIcon: true,
            value: checkItem
        })

        ai.click = function () {
            router.push(`/PlanogramImplementationNew/${checkItem.project_ID}/${checkItem.systemFileID}/20`);
        }

        checkPlanogramTreeItems.push(ai);
    });

    return checkPlanogramTreeItems;
}

function getUserTasks(callback) {
    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    let encoded_details = jwt.decode(sessionStorage.accessToken);
    let systemUserID = encoded_details.USER_ID;

    Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`)
        .then(r => {
            let filtered = r.data.projectTXList.filter(e => {
                return (e.status == 37 || e.status == 38) && e.systemUserID == systemUserID;
            })
            callback(filtered);
        })
        .catch(e => {
            return [];
        })
}

export default CheckPlanogramTreeItem;