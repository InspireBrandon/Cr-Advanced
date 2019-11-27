import TreeItem from './TreeItem'

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

export default SoftwareTreeItem;