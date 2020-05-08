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

        let checkPlanogramTreeItem = buildCheckPlanogramFolder(self.vueCtx.$router);

        treeItems.push(checkPlanogramTreeItem);
    }
}

function buildCheckPlanogramFolder(router) {
    let checkPlanogramTreeItem = new TreeItem({
        name: 'Planograms to check',
        icon: "folder"
    });

    checkPlanogramTreeItem.click = function () {
        getUserTasks(data => {
            checkPlanogramTreeItem.children = buildCheckPlanogramItems(data, router)
            checkPlanogramTreeItem.showChildren = !checkPlanogramTreeItem.showChildren;
            checkPlanogramTreeItem.icon = checkPlanogramTreeItem.showChildren ? 'folder_open' : 'folder';
        });
    }

    return checkPlanogramTreeItem;
}

function buildCheckPlanogramItems(checkItems, router) {
    let checkPlanogramTreeItems = [];

    checkItems.forEach(checkItem => {
        let ai = new TreeItem({
            name: checkItem.systemFileName,
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
                return e.status == 37 || e.status == 38;
            })
            console.log(filtered);
            callback(filtered);
        })
        .catch(e => {
            return [];
        })
}

export default CheckPlanogramTreeItem;