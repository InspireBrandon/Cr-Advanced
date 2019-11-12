<template>
    <div>
        <div>
            <recursive :accessType="accessType" :items="treeItems"></recursive>
        </div>
    </div>
</template>

<script>
    import Axios from "axios";
    import Recursive from './Recursive'

    export default {
        props: ['accessType', 'storeID'],
        components: {
            Recursive
        },
        data() {
            return {
                treeItems: [],
                departments: [],
                stores: [],
                baskets: [],

            }
        },
        mounted() {
            let self = this;
        },
        methods: {
            getStores() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Store_Planogram_Stores")
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.stores = r.data;
                        self.getProjectGroups();
                    })
                    .catch(e => {

                    })
            },
            getProjectGroups() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `ProjectGroup`)
                    .then(r => {
                        self.departments = r.data.projectGroupList.filter(e => {
                            return !e.deleted
                        })

                        self.departments.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        })

                        self.buildTree();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getFile(folder, file, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(r => {
                        self.getFileData(r.data.id, fileData => {
                            callback(fileData);
                        })
                    })
            },
            getFileData(id, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            buildTree() {
                let self = this;

                self.treeItems = [];

                if (self.accessType == 0) {
                    self.buildSoftwareButtons();
                    self.buildRangePlanningTree();
                    self.buildModelPlanogramTree();
                    self.buildStorePlanogramTree();
                    self.buildFloorPlanningTree();
                    self.buildClusteringTree();
                    self.buildPromotionalPlanningFolder();
                    self.buildSpatialMappingFolder();
                    self.buildUploadTreeItems();
                }

                if (self.accessType == 1) {
                    self.buildSoftwareButtons();
                    self.buildRangePlanningTree();
                    self.buildModelPlanogramTree();
                    self.buildStorePlanogramTree();
                    self.buildFloorPlanningTree();
                    self.buildClusteringTree();
                    self.buildPromotionalPlanningFolder();
                    self.buildSpatialMappingFolder();
                    self.buildUploadTreeItems();
                }

                if (self.accessType == 2) {
                    self.buildSoftwareButtons();
                    self.buildRangePlanningTree();
                    self.buildModelPlanogramTree();
                    self.buildStorePlanogramTree();
                    self.buildFloorPlanningTree();
                    self.buildClusteringTree();
                    self.buildPromotionalPlanningFolder();
                    self.buildSpatialMappingFolder();
                    self.buildUploadTreeItems();
                }

                if (self.accessType == 3) {
                    self.buildSoftwareButtons();
                    self.buildRangePlanningTree();
                    // self.buildModelPlanogramTree();
                    self.buildStorePlanogramTree();
                    self.buildFloorPlanningTree();
                    self.buildClusteringTree();
                    self.buildPromotionalPlanningFolder();
                    self.buildSpatialMappingFolder();
                    self.buildUploadTreeItems();
                }
            },
            buildSoftwareButtons() {
                let self = this;

                let appItem = new treeItem({
                    name: "Tools",
                    icon: 'build',
                    children: []
                })

                appItem.click = function () {
                    self.$router.push("/Home");
                }

                self.treeItems.push(appItem);

                let taskItem = new treeItem({
                    name: "Tasks",
                    icon: 'build',
                    children: []
                })

                taskItem.click = function () {
                    self.$router.push("/Tasks");
                }

                self.treeItems.push(taskItem);
            },
            buildRangePlanningTree() {
                let self = this;

                // build model planogram item
                let modelPlanogramTreeItem = new treeItem({
                    name: "Range Planning",
                    icon: 'folder',
                    children: []
                })

                modelPlanogramTreeItem.click = function () {
                    modelPlanogramTreeItem.showChildren = !modelPlanogramTreeItem.showChildren;
                    modelPlanogramTreeItem.icon = modelPlanogramTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                self.departments.forEach(department => {
                    let departmentTreeItem = new treeItem({
                        name: department.name,
                        icon: 'folder',
                        children: [],
                        type: "department",
                        value: department.id
                    })

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // IN PROGRESS
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let taskInProgress = new treeItem({
                        name: "In Progress",
                        icon: 'folder',
                        children: []
                    })

                    taskInProgress.showChildrenCount = true;

                    taskInProgress.click = function () {
                        taskInProgress.showChildren = !taskInProgress.showChildren;
                        taskInProgress.icon = taskInProgress.showChildren ? 'folder_open' : 'folder';
                    }
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // APPROVAL IN PROGRESS
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let taskApprovalInProgress = new treeItem({
                        name: "Approval In Progress",
                        icon: 'folder',
                        children: []
                    })

                    taskApprovalInProgress.showChildrenCount = true;

                    taskApprovalInProgress.click = function () {
                        taskApprovalInProgress.showChildren = !taskApprovalInProgress.showChildren;
                        taskApprovalInProgress.icon = taskApprovalInProgress.showChildren ? 'folder_open' :
                            'folder';
                    }
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // APPROVED
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let taskApproved = new treeItem({
                        name: "Approved",
                        icon: 'folder',
                        children: []
                    })

                    taskApproved.showChildrenCount = true;

                    taskApproved.click = function () {
                        taskApproved.showChildren = !taskApproved.showChildren;
                        taskApproved.icon = taskApproved.showChildren ? 'folder_open' :
                            'folder';
                    }

                    // Add task folders to department folder
                    departmentTreeItem.children.push(taskInProgress, taskApprovalInProgress, taskApproved);

                    // On click get all tasks by department and populate
                    departmentTreeItem.click = function () {
                        if (departmentTreeItem.showChildren) {
                            departmentTreeItem.showChildren = false;
                            departmentTreeItem.icon = "folder";
                        } else {
                            departmentTreeItem.loading = true;
                            taskInProgress.children = [];
                            taskApprovalInProgress.children = [];
                            taskApproved.children = [];

                            self.getTasksByProjectGroup(department.id, tasks => {
                                self.getRangeFileByProjectGroup(department.id, rangeFiles => {
                                    // Handle tasks in progress
                                    let inProgressTasks = tasks.filter(task => {
                                        return task.type == 2 && (task.status ==
                                            1 || task
                                            .status == 2);
                                    })

                                    inProgressTasks.forEach(task => {
                                        let taskItem = new treeItem({
                                            name: task.rangeFileName,
                                            icon: 'insert_drive_file',
                                            children: []
                                        })

                                        taskItem.click = function () {
                                            self.$router.push(
                                                `/RangePlanningView/${task.rangeFileID}`
                                            );
                                        }

                                        taskInProgress.children.push(taskItem);

                                        rangeFiles.forEach((rangeFile, idx) => {
                                            if (rangeFile.rangeFileID ==
                                                task.rangeFileID) {
                                                rangeFiles.splice(idx, 1);
                                            }
                                        })
                                    })

                                    // Handle tasks in progress
                                    let approvalInProgressTasks = tasks.filter(task => {
                                        return task.type == 2 && (task.status ==
                                            10 || task
                                            .status == 20);
                                    })

                                    approvalInProgressTasks.forEach(task => {
                                        let taskItem = new treeItem({
                                            name: task.rangeFileName,
                                            icon: 'insert_drive_file',
                                            children: []
                                        })

                                        taskItem.click = function () {
                                            self.$router.push(
                                                `/RangePlanningView/${task.rangeFileID}`
                                            );
                                        }

                                        taskApprovalInProgress.children.push(
                                            taskItem);

                                        rangeFiles.forEach((rangeFile, idx) => {
                                            if (rangeFile.rangeFileID ==
                                                task.rangeFileID) {
                                                rangeFiles.splice(idx, 1);
                                            }
                                        })
                                    })

                                    // Handle approved tasks
                                    let approvedTasks = tasks.filter(task => {
                                        return task.type == 2 && (task.status ==
                                            12);
                                    })

                                    rangeFiles.forEach(task => {
                                        let taskItem = new treeItem({
                                            name: task.rangeFileName,
                                            icon: 'insert_drive_file',
                                            children: []
                                        })

                                        taskItem.click = function () {
                                            self.$router.push(
                                                `/RangePlanningView/${task.rangeFileID}`
                                            );
                                        }

                                        taskApproved.children.push(taskItem);
                                    })

                                    departmentTreeItem.loading = false;
                                    departmentTreeItem.showChildren = true;
                                })
                            })
                        }
                    }

                    modelPlanogramTreeItem.children.push(departmentTreeItem);
                })

                self.treeItems.push(modelPlanogramTreeItem);
            },
            buildModelPlanogramTree() {
                let self = this;

                // build model planogram item
                let modelPlanogramTreeItem = new treeItem({
                    name: "Space Planning - Model",
                    icon: 'folder',
                    children: []
                })

                modelPlanogramTreeItem.click = function () {
                    modelPlanogramTreeItem.showChildren = !modelPlanogramTreeItem.showChildren;
                    modelPlanogramTreeItem.icon = modelPlanogramTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                // Get unique departments

                self.departments.forEach(department => {
                    let departmentTreeItem = new treeItem({
                        name: department.name,
                        icon: 'folder',
                        children: [],
                        type: "department",
                        value: department.id
                    })

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // IN PROGRESS
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let taskInProgress = new treeItem({
                        name: "In Progress",
                        icon: 'folder',
                        children: []
                    })

                    taskInProgress.showChildrenCount = true;

                    taskInProgress.click = function () {
                        taskInProgress.showChildren = !taskInProgress.showChildren;
                        taskInProgress.icon = taskInProgress.showChildren ? 'folder_open' : 'folder';
                    }
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // APPROVAL IN PROGRESS
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let taskApprovalInProgress = new treeItem({
                        name: "Approval In Progress",
                        icon: 'folder',
                        children: []
                    })

                    taskApprovalInProgress.showChildrenCount = true;

                    taskApprovalInProgress.click = function () {
                        taskApprovalInProgress.showChildren = !taskApprovalInProgress.showChildren;
                        taskApprovalInProgress.icon = taskApprovalInProgress.showChildren ? 'folder_open' :
                            'folder';
                    }
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // APPROVED
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let taskApproved = new treeItem({
                        name: "Approved",
                        icon: 'folder',
                        children: []
                    })

                    taskApproved.showChildrenCount = true;

                    taskApproved.click = function () {
                        taskApproved.showChildren = !taskApproved.showChildren;
                        taskApproved.icon = taskApproved.showChildren ? 'folder_open' :
                            'folder';
                    }

                    // Add task folders to department folder
                    departmentTreeItem.children.push(taskInProgress, taskApprovalInProgress, taskApproved);

                    // On click get all tasks by department and populate
                    departmentTreeItem.click = function () {
                        if (departmentTreeItem.showChildren) {
                            departmentTreeItem.showChildren = false;
                            departmentTreeItem.icon = "folder";
                        } else {
                            departmentTreeItem.loading = true;
                            taskInProgress.children = [];
                            taskApprovalInProgress.children = [];
                            taskApproved.children = [];

                            self.getTasksByProjectGroup(department.id, tasks => {
                                self.getPlanogramFileByProjectGroup(department.id,
                                    planogramFiles => {
                                        console.log(planogramFiles);

                                        // Handle tasks in progress
                                        let inProgressTasks = tasks.filter(task => {
                                            return task.type == 3 && (task.status ==
                                                1 || task
                                                .status == 2);
                                        })

                                        inProgressTasks.forEach(task => {
                                            let taskItem = new treeItem({
                                                name: task.systemFileName,
                                                icon: 'insert_drive_file',
                                                children: []
                                            })

                                            taskItem.click = function () {
                                                self.$router.push(
                                                    `/PlanogramImplementationNew/${task.planogram_ID}/${task.systemFileID}/20`
                                                );
                                            }

                                            taskInProgress.children.push(taskItem);

                                            planogramFiles.forEach((planogramFile,
                                                idx) => {
                                                if (planogramFile
                                                    .PlanogramFileID == task
                                                    .systemFileID) {
                                                    planogramFiles.splice(idx,
                                                        1);
                                                }
                                            })
                                        })

                                        // Handle tasks in progress
                                        let approvalInProgressTasks = tasks.filter(task => {
                                            return task.type == 3 && (task.status ==
                                                10 || task
                                                .status == 20);
                                        })

                                        approvalInProgressTasks.forEach(task => {
                                            let taskItem = new treeItem({
                                                name: task.systemFileName,
                                                icon: 'insert_drive_file',
                                                children: []
                                            })

                                            taskItem.click = function () {
                                                self.$router.push(
                                                    `/PlanogramImplementationNew/${task.planogram_ID}/${task.systemFileID}/20`
                                                );
                                            }

                                            taskApprovalInProgress.children.push(
                                                taskItem);

                                            planogramFiles.forEach((planogramFile,
                                                idx) => {
                                                if (planogramFile
                                                    .PlanogramFileID == task
                                                    .systemFileID) {
                                                    planogramFiles.splice(idx,
                                                        1);
                                                }
                                            })
                                        })

                                        // Handle approved tasks
                                        let approvedTasks = tasks.filter(task => {
                                            return task.type == 3 && (task.status ==
                                                12 || task
                                                .status == 21 || task.status ==
                                                27 || task
                                                .status == 44);
                                        })

                                        planogramFiles.forEach(task => {
                                            let taskItem = new treeItem({
                                                name: task.planogramFileName,
                                                icon: 'insert_drive_file',
                                                children: []
                                            })

                                            taskItem.click = function () {
                                                self.$router.push(
                                                    `/PlanogramImplementationNew/${task.planogram_ID}/${task.planogramFileID}/20`
                                                );
                                            }

                                            taskApproved.children.push(taskItem);
                                        })

                                        departmentTreeItem.loading = false;
                                        departmentTreeItem.showChildren = true;
                                    })
                            })
                        }
                    }

                    modelPlanogramTreeItem.children.push(departmentTreeItem);
                })

                self.treeItems.push(modelPlanogramTreeItem);
            },
            buildStorePlanogramTree() {
                let self = this;

                // build model planogram item
                let storePlanogramTreeItem = new treeItem({
                    name: "Space Planning - Store",
                    icon: 'folder',
                    children: []
                })

                storePlanogramTreeItem.click = function () {
                    storePlanogramTreeItem.showChildren = !storePlanogramTreeItem.showChildren;
                    storePlanogramTreeItem.icon = storePlanogramTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                if (self.storeID != null)
                    self.stores = self.stores.filter(e => {
                        return e.storeID == self.storeID;
                    })

                self.stores.forEach(store => {
                    let storeFolder = new treeItem({
                        name: store.storeName,
                        icon: 'folder',
                        children: []
                    })

                    storeFolder.click = function () {
                        if (storeFolder.showChildren) {
                            storeFolder.showChildren = false;
                            storeFolder.icon = 'folder';
                        } else {
                            storeFolder.loading = true;
                            storeFolder.children = [];

                            self.getDepartmentsByStore(store.storeID, departments => {
                                let uniqueDepartments = [];

                                // get unique departments
                                departments.forEach(department => {
                                    let canAdd = true;

                                    uniqueDepartments.forEach(ud => {
                                        if (department.projectGroup == ud
                                            .projectGroup)
                                            canAdd = false;
                                    })

                                    if (canAdd)
                                        uniqueDepartments.push(department);
                                })

                                // Create folders for unique departments
                                uniqueDepartments.forEach(ud => {
                                    let departmentItem = new treeItem({
                                        name: ud.projectGroup,
                                        icon: 'folder',
                                        children: [],
                                    })

                                    departmentItem.click = function () {
                                        departmentItem.showChildren = !departmentItem
                                            .showChildren;
                                        departmentItem.icon = departmentItem
                                            .showChildren ? 'folder_open' : 'folder';
                                    }

                                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // PENDING
                                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                                    let taskPending = new treeItem({
                                        name: "Implementation Pending",
                                        icon: 'folder',
                                        children: []
                                    })

                                    taskPending.showChildrenCount = true;

                                    taskPending.click = function () {
                                        taskPending.showChildren = !taskPending
                                            .showChildren;
                                        taskPending.icon = taskPending.showChildren ?
                                            'folder_open' :
                                            'folder';
                                    }
                                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // IN PROGRESS
                                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                                    let taskInProgress = new treeItem({
                                        name: "Implementation In Progress",
                                        icon: 'folder',
                                        children: []
                                    })

                                    taskInProgress.showChildrenCount = true;

                                    taskInProgress.click = function () {
                                        taskInProgress.showChildren = !taskInProgress
                                            .showChildren;
                                        taskInProgress.icon = taskInProgress
                                            .showChildren ?
                                            'folder_open' :
                                            'folder';
                                    }
                                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // IMPLEMENTED
                                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                                    let taskImplemented = new treeItem({
                                        name: "Implemented",
                                        icon: 'folder',
                                        children: []
                                    })

                                    taskImplemented.showChildrenCount = true;

                                    taskImplemented.click = function () {
                                        taskImplemented.showChildren = !taskImplemented
                                            .showChildren;
                                        taskImplemented.icon = taskImplemented
                                            .showChildren ? 'folder_open' :
                                            'folder';
                                    }

                                    departmentItem.children.push(taskPending,
                                        taskInProgress, taskImplemented);

                                    departments.forEach(department => {
                                        if (department.projectGroup == ud
                                            .projectGroup) {
                                            let taskItem = new treeItem({
                                                name: department.fileName,
                                                icon: 'insert_drive_file',
                                                children: [],
                                                click: function () {
                                                    self.$router.push(
                                                        `/PlanogramImplementationNew/${department.planogramID}/${department.systemFileID}/13`
                                                    );
                                                }
                                            })

                                            switch (department
                                                .planogramStoreStatus) {
                                                case 2: {
                                                    taskPending.children.push(
                                                        taskItem);
                                                }
                                                break;
                                            case 3: {
                                                taskInProgress.children.push(
                                                    taskItem);
                                            }
                                            break;
                                            case 4: {
                                                taskImplemented.children.push(
                                                    taskItem);
                                            }
                                            break;
                                            }
                                        }
                                    })

                                    storeFolder.children.push(departmentItem);
                                })

                                storeFolder.icon = "folder_open";
                                storeFolder.loading = false;
                                storeFolder.showChildren = true;
                            })
                        }
                    }

                    storePlanogramTreeItem.children.push(storeFolder);
                })

                self.treeItems.push(storePlanogramTreeItem);
            },
            buildFloorPlanningTree() {
                let self = this;

                let floorPlanningTreeItem = new treeItem({
                    name: "Floor Planning",
                    icon: "folder",
                    children: []
                })

                floorPlanningTreeItem.click = function () {
                    floorPlanningTreeItem.showChildren = !floorPlanningTreeItem.showChildren;
                    floorPlanningTreeItem.icon = floorPlanningTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                // ////////////////////////////////////////////////////////////////////////////////////////////////////
                // FLOOR PLANNING FOLDERS
                // ////////////////////////////////////////////////////////////////////////////////////////////////////

                // department clustering
                let departmentClusteringTreeItem = new treeItem({
                    name: "Department Clustering",
                    icon: "folder",
                    children: []
                })

                departmentClusteringTreeItem.click = function () {
                    departmentClusteringTreeItem.showChildren = !departmentClusteringTreeItem.showChildren;
                    departmentClusteringTreeItem.icon = departmentClusteringTreeItem.showChildren ? 'folder_open' :
                        'folder';
                }

                // department floor plans
                let departmentModelFloorPlanTreeItem = new treeItem({
                    name: "Department Model Floor Plans",
                    icon: "folder",
                    children: []
                })

                departmentModelFloorPlanTreeItem.click = function () {
                    departmentModelFloorPlanTreeItem.showChildren = !departmentModelFloorPlanTreeItem.showChildren;
                    departmentModelFloorPlanTreeItem.icon = departmentModelFloorPlanTreeItem.showChildren ?
                        'folder_open' : 'folder';
                }

                self.departments.forEach(department => {
                    let departmentTreeItem = new treeItem({
                        name: department.name,
                        icon: "folder",
                        children: []
                    })

                    departmentTreeItem.showChildrenCount = true;

                    departmentTreeItem.click = function () {
                        departmentTreeItem.showChildren = !departmentTreeItem
                            .showChildren;
                        departmentTreeItem.icon = departmentTreeItem
                            .showChildren ?
                            'folder_open' : 'folder';
                    }

                    if (department.name == "Garden, Pool and Patio") {
                        let departmentViewerTreeItem = new treeItem({
                            name: "Garden – LTM2 – Merchandise Flow Diagram",
                            icon: "insert_drive_file",
                            children: [],
                            click: function () {
                                self.$router.push(
                                    "/FloorPlanningViewer/Garden - LTM2 - Merchandise Flow Diagram.jpg"
                                )
                            }
                        })

                        departmentTreeItem.children.push(departmentViewerTreeItem);

                        departmentModelFloorPlanTreeItem.children.push(departmentTreeItem)
                    }
                })

                // store floor plans
                let storeFloorPlanTreeItem = new treeItem({
                    name: "Store Floor Plans",
                    icon: "folder",
                    children: [
                        new treeItem({
                            name: "Delmas",
                            icon: "insert_drive_file",
                            children: [],
                            click: function () {
                                self.$router.push("/FloorPlanningViewer/Delmas - Floorplan.jpg")
                            }
                        }),
                        new treeItem({
                            name: "Klerksdorp",
                            icon: "insert_drive_file",
                            children: [],
                            click: function () {
                                self.$router.push("/FloorPlanningViewer/Klerksdorp Floorplan.jpg")
                            }
                        }),
                    ]
                })

                storeFloorPlanTreeItem.click = function () {
                    storeFloorPlanTreeItem.showChildren = !storeFloorPlanTreeItem.showChildren;
                    storeFloorPlanTreeItem.icon = storeFloorPlanTreeItem.showChildren ?
                        'folder_open' : 'folder';
                }

                floorPlanningTreeItem.children.push(departmentClusteringTreeItem, departmentModelFloorPlanTreeItem,
                    storeFloorPlanTreeItem);
                self.treeItems.push(floorPlanningTreeItem);
            },
            buildClusteringTree() {
                let self = this;

                let clusteringTreeItem = new treeItem({
                    name: "Clustering",
                    icon: "folder",
                    children: []
                })

                clusteringTreeItem.click = function () {
                    clusteringTreeItem.showChildren = !clusteringTreeItem.showChildren;
                    clusteringTreeItem.icon = clusteringTreeItem.showChildren ? 'folder_open' :
                        'folder';
                }

                self.getFile("CLUSTER REPORT", "REPORT", fileData => {
                    self.baskets = [];

                    for (var basket in fileData.basket) {
                        self.baskets.push(basket);
                    }

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // STORE
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let storeTreeItem = new treeItem({
                        name: "Store Clustering",
                        icon: "folder",
                        children: []
                    })

                    storeTreeItem.click = function () {
                        storeTreeItem.showChildren = !storeTreeItem.showChildren;
                        storeTreeItem.icon = storeTreeItem.showChildren ? 'folder_open' : 'folder';
                    }

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // CUSTOM
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let customTreeItem = new treeItem({
                        name: "Custom Clustering",
                        icon: "folder",
                        children: []
                    })

                    customTreeItem.click = function () {
                        customTreeItem.showChildren = !customTreeItem.showChildren;
                        customTreeItem.icon = customTreeItem.showChildren ? 'folder_open' : 'folder';
                    }

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // BASKET
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let basketTreeItem = new treeItem({
                        name: "Basket Clustering",
                        icon: "folder",
                        children: []
                    })

                    basketTreeItem.click = function () {
                        basketTreeItem.showChildren = !basketTreeItem.showChildren;
                        basketTreeItem.icon = basketTreeItem.showChildren ? 'folder_open' : 'folder';
                    }

                    self.baskets.forEach(basket => {
                        console.log(basket);

                        let taskItem = new treeItem({
                            name: basket,
                            icon: "insert_drive_file",
                            children: [],
                            click: function () {
                                alert("Going")
                            }
                        })

                        basketTreeItem.children.push(taskItem);
                    })

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // LISTING
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let listingTreeItem = new treeItem({
                        name: "Listing Clustering",
                        icon: "folder",
                        children: []
                    })

                    listingTreeItem.click = function () {
                        listingTreeItem.showChildren = !listingTreeItem.showChildren;
                        listingTreeItem.icon = listingTreeItem.showChildren ? 'folder_open' : 'folder';
                    }

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // CATEGORY
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let categoryTreeItem = new treeItem({
                        name: "Category Clustering",
                        icon: "folder",
                        children: []
                    })

                    categoryTreeItem.click = function () {
                        categoryTreeItem.showChildren = !categoryTreeItem.showChildren;
                        categoryTreeItem.icon = categoryTreeItem.showChildren ? 'folder_open' : 'folder';
                    }

                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // DEPARTMENT
                    // ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let departmentTreeItem = new treeItem({
                        name: "Department Clustering",
                        icon: "folder",
                        children: []
                    })

                    departmentTreeItem.click = function () {
                        departmentTreeItem.showChildren = !departmentTreeItem.showChildren;
                        departmentTreeItem.icon = departmentTreeItem.showChildren ? 'folder_open' :
                            'folder';
                    }

                    clusteringTreeItem.children.push(storeTreeItem, customTreeItem, basketTreeItem,
                        listingTreeItem,
                        categoryTreeItem, departmentTreeItem);
                });

                self.treeItems.push(clusteringTreeItem);
            },
            buildSpatialMappingFolder() {
                let self = this;

                let spacialMappingTreeItem = new treeItem({
                    name: "Spatial Mapping",
                    icon: "folder",
                    children: []
                })

                spacialMappingTreeItem.click = function () {
                    spacialMappingTreeItem.showChildren = !spacialMappingTreeItem.showChildren;
                    spacialMappingTreeItem.icon = spacialMappingTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                let marketShareTreeItem = new treeItem({
                    name: "Market Share",
                    icon: "insert_drive_file",
                    children: [],
                    click: function () {
                        self.$router.push(
                            "/Map"
                        )
                    }
                })

                let heatMapsTreeItem = new treeItem({
                    name: "Heat Map",
                    icon: "insert_drive_file",
                    children: [],
                    click: function () {
                        self.$router.push(
                            "/Bi"
                        )
                    }
                })

                spacialMappingTreeItem.children.push(marketShareTreeItem, heatMapsTreeItem);
                self.treeItems.push(spacialMappingTreeItem);
            },
            buildPromotionalPlanningFolder() {
                let self = this;

                let promotionalTreeItem = new treeItem({
                    name: "Promotional Planning",
                    icon: "folder",
                    children: []
                })

                promotionalTreeItem.click = function () {
                    promotionalTreeItem.showChildren = !promotionalTreeItem.showChildren;
                    promotionalTreeItem.icon = promotionalTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                self.treeItems.push(promotionalTreeItem);
            },
            buildUploadTreeItems() {
                let self = this;

                let uploadTreeItem = new treeItem({
                    name: "My Folders",
                    icon: "folder",
                    children: []
                })

                uploadTreeItem.click = function () {
                    uploadTreeItem.showChildren = !uploadTreeItem.showChildren;
                    uploadTreeItem.icon = uploadTreeItem.showChildren ? 'folder_open' : 'folder';
                }

                self.treeItems.push(uploadTreeItem);
            },
            getTasksByProjectGroup(projectGroupID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `GetTasksByProjectGroup?projectGroupID=${projectGroupID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data.projectTXList);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getStorePlanograms(storeID, projectGroupID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `Store_Planogram/StoreAndDepartment?storeID=${storeID}&projectGroupID=${projectGroupID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data.queryResult);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getDepartmentsByStore(storeID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Store_Planogram_Store_Departments?storeID=${storeID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getRangeFileByProjectGroup(projectGroupID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `GetRangeFileByProjectGroup?projectGroupID=${projectGroupID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getPlanogramFileByProjectGroup(projectGroupID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `GetPlanogramFileByProjectGroup?projectGroupID=${projectGroupID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
    }

    function treeItem(data) {
        let self = this;
        self.name = data.name;
        self.icon = data.icon;
        self.click = data.click;
        self.children = data.children;
        self.showChildren = false;
        self.showChildrenCount = false;
        self.type = data.type;
        self.value = data.value;
        self.loading = false;
    }
</script>