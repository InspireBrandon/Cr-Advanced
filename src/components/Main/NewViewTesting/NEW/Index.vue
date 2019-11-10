<template>
    <div>
        <div>
            <recursive :items="treeItems"></recursive>
        </div>
    </div>
</template>

<script>
    import Axios from "axios";
    import Recursive from './Recursive'

    export default {
        components: {
            Recursive
        },
        data() {
            return {
                treeItems: [],
                departments: [],
                stores: [],
            }
        },
        mounted() {
            let self = this;
            self.getStores();
        },
        methods: {
            getStores() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Store?db=CR-HINTERLAND-LIVE")
                    .then(r => {
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
            buildTree() {
                let self = this;
                self.buildSoftwareButtons();
                self.buildRangePlanningTree();
                self.buildModelPlanogramTree();
                self.buildStorePlanogramTree();
                self.buildFloorPlanningTree();
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
                                // Handle tasks in progress
                                let inProgressTasks = tasks.filter(task => {
                                    return task.type == 2 && (task.status == 1 || task
                                        .status == 2);
                                })

                                inProgressTasks.forEach(task => {
                                    let taskItem = new treeItem({
                                        name: task.rangeFileName,
                                        icon: 'folder',
                                        children: []
                                    })

                                    taskItem.click = function () {
                                        self.$router.push(
                                            `/RangePlanningView/${task.rangeFileID}`
                                        );
                                    }

                                    taskInProgress.children.push(taskItem);
                                })

                                // Handle tasks in progress
                                let approvalInProgressTasks = tasks.filter(task => {
                                    return task.type == 2 && (task.status == 10 || task
                                        .status == 20);
                                })

                                approvalInProgressTasks.forEach(task => {
                                    let taskItem = new treeItem({
                                        name: task.rangeFileName,
                                        icon: 'folder',
                                        children: []
                                    })

                                    taskItem.click = function () {
                                        self.$router.push(
                                            `/RangePlanningView/${task.rangeFileID}`
                                        );
                                    }

                                    taskApprovalInProgress.children.push(taskItem);
                                })

                                // Handle approved tasks
                                let approvedTasks = tasks.filter(task => {
                                    return task.type == 2 && (task.status == 12);
                                })

                                approvedTasks.forEach(task => {
                                    let taskItem = new treeItem({
                                        name: task.rangeFileName,
                                        icon: 'folder',
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
                                // Handle tasks in progress
                                let inProgressTasks = tasks.filter(task => {
                                    return task.type == 3 && (task.status == 1 || task
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
                                })

                                // Handle tasks in progress
                                let approvalInProgressTasks = tasks.filter(task => {
                                    return task.type == 3 && (task.status == 10 || task
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

                                    taskApprovalInProgress.children.push(taskItem);
                                })

                                // Handle approved tasks
                                let approvedTasks = tasks.filter(task => {
                                    return task.type == 3 && (task.status == 12);
                                })

                                approvedTasks.forEach(task => {
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

                                    taskApproved.children.push(taskItem);
                                })

                                departmentTreeItem.loading = false;
                                departmentTreeItem.showChildren = true;
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

                self.stores.forEach(store => {
                    let storeFolder = new treeItem({
                        name: store.storeName,
                        icon: 'folder',
                        children: []
                    })

                    storeFolder.click = function () {
                        storeFolder.showChildren = !storeFolder.showChildren;
                        storeFolder.icon = storeFolder.showChildren ? 'folder_open' :
                            'folder';
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
                        // PENDING
                        // ////////////////////////////////////////////////////////////////////////////////////////////////////
                        let taskPending = new treeItem({
                            name: "Implementation Pending",
                            icon: 'folder',
                            children: []
                        })

                        taskPending.showChildrenCount = true;

                        taskPending.click = function () {
                            taskPending.showChildren = !taskPending.showChildren;
                            taskPending.icon = taskPending.showChildren ? 'folder_open' :
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
                            taskInProgress.icon = taskInProgress.showChildren ?
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
                            taskImplemented.showChildren = !taskImplemented.showChildren;
                            taskImplemented.icon = taskImplemented.showChildren ? 'folder_open' :
                                'folder';
                        }

                        // Add task folders to department folder
                        departmentTreeItem.children.push(taskPending, taskInProgress, taskImplemented);

                        // On click get all tasks by department and populate
                        departmentTreeItem.click = function () {
                            if (departmentTreeItem.showChildren) {
                                departmentTreeItem.showChildren = false;
                                departmentTreeItem.icon = "folder";
                            } else {
                                departmentTreeItem.loading = true;
                                taskPending.children = [];
                                taskInProgress.children = [];
                                taskImplemented.children = [];

                                // TODO: add get method for all store planogram stuff

                                self.getStorePlanograms(store.storeID, department.id,
                                    storePlanograms => {
                                        console.log(department);
                                        departmentTreeItem.loading = false;
                                        departmentTreeItem.showChildren = true;
                                    })

                                self.getStorePlanograms(store.storeID, department.id,
                                    storePlanograms => {
                                        // Handle tasks in progress
                                        let pendingTasks = storePlanograms.filter(
                                            storePlanogram => {
                                                return storePlanogram
                                                    .planogramStoreStatus == 2;
                                            })

                                        pendingTasks.forEach(task => {
                                            let taskItem = new treeItem({
                                                name: task.fileName,
                                                icon: 'insert_drive_file',
                                                children: []
                                            })

                                            taskItem.click = function () {
                                                self.$router.push(
                                                    `/PlanogramImplementationNew/${task.planogramID}/${task.systemFileID}/13`
                                                );
                                            }

                                            taskInProgress.children.push(taskItem);
                                        })

                                        // Handle tasks in progress
                                        let InProgressTasks = storePlanograms.filter(
                                            storePlanogram => {
                                                return storePlanogram
                                                    .planogramStoreStatus == 4;
                                            })

                                        InProgressTasks.forEach(task => {
                                            let taskItem = new treeItem({
                                                name: task.fileName,
                                                icon: 'folder',
                                                children: []
                                            })

                                            taskItem.click = function () {
                                                self.$router.push(
                                                    `/PlanogramImplementationNew/${task.planogramID}/${task.systemFileID}/24`
                                                );
                                            }

                                            taskApprovalInProgress.children.push(
                                                taskItem);
                                        })

                                        // Handle implemented tasks
                                        let implementedTasks = storePlanograms.filter(
                                            storePlanogram => {
                                                return storePlanogram
                                                    .planogramStoreStatus == 4;
                                            })

                                        implementedTasks.forEach(task => {
                                            let taskItem = new treeItem({
                                                name: task.fileName,
                                                icon: 'folder',
                                                children: []
                                            })

                                            taskItem.click = function () {
                                                self.$router.push(
                                                    `/PlanogramImplementationNew/${task.planogramID}/${task.systemFileID}/15`
                                                );
                                            }

                                            taskApproved.children.push(taskItem);
                                        })

                                        departmentTreeItem.loading = false;
                                        departmentTreeItem.showChildren = true;
                                    })
                            }
                        }

                        storeFolder.children.push(departmentTreeItem);
                    })

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
                    }

                    departmentModelFloorPlanTreeItem.children.push(departmentTreeItem)
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
            getTasksByProjectGroup(projectGroupID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `GetTasksByProjectGroup?projectGroupID=${projectGroupID}`)
                    .then(r => {
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
                        console.log(r.data.queryResult)
                        callback(r.data.queryResult);
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