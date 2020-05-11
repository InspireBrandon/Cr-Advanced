import TreeItem from './TreeItem'
import Axios from "axios";
import jwt from 'jsonwebtoken';

class SoftwareTreeItem {
    constructor(data) {
        let self = this;
        self.vueCtx = data.vueCtx;
    }

    build(treeItems) {
        let self = this;

        let appItem = new TreeItem({
            name: "Tools",
            icon: "build",
            click: function() {
                self.vueCtx.$router.push("/Home")
            }
        })

        let taskItem = new TreeItem({
            name: "Tasks",
            icon: "build",
            click: function() {
                self.vueCtx.$router.push("/Tasks")
            }
        })

        getUserTasks(tasks => {
            taskItem.children = tasks;
            taskItem.showChildrenCount = true;
        })

        let observationsItemItem = new TreeItem({
            name: "Observations & Insights",
            icon: "build",
            click: function() {
                self.vueCtx.$router.push("/ObservationsAndInsights")
            }
        })

        treeItems.push(appItem, taskItem, observationsItemItem);
    }
}

function getUserTasks(callback) {
    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    let encoded_details = jwt.decode(sessionStorage.accessToken);
    let systemUserID = encoded_details.USER_ID;

    Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`)
        .then(r => {
            console.log('user tasks', r.data);
            callback(r.data.projectTXList);
        })
        .catch(e => {
            return [];
        })
}

export default SoftwareTreeItem;