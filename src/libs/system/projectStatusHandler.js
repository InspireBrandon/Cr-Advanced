class projectStatusHandler {
    constructor() {}
    getStatus(componentType) {
        var self = this
        let statusList = [{
                text: "Project Start",
                value: 0,
                friendly: "Project Start",
                color: "blue",
                type: [0, 1, 2, 3, 4]
            },
            {
                text: "In Progress",
                value: 1,
                color: "blue",
                friendly: "In Progress",
                type: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                text: "Complete",
                value: 2,
                color: "blue",
                friendly: "Complete",
                type: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                text: "Workshop",
                value: 3,
                color: "yellow",
                friendly: "Workshop",
                type: [0]
            }, {
                text: "Workshop Complete",
                value: 4,
                color: "yellow",
                friendly: "Workshop Complete",
                type: [0]
            },
            {
                text: "Meeting",
                value: 5,
                color: "yellow",
                friendly: "Meeting",
                type: [0]
            },
            {
                text: "Data Preparation Start",
                value: 6,
                color: "red",
                friendly: "Data Preparation Start",
                type: [1]
            },
            {
                text: "Ranging Start",
                value: 7,
                color: "red",
                friendly: "Ranging Start",
                type: [2]
            },
            {
                text: "Planogram Start",
                value: 8,
                color: "green",
                friendly: "Planogram Start",
                type: [3]
            },
            {
                text: "Meeting Supplier",
                value: 9,
                color: "green",
                friendly: "Meeting Supplier",
                type: [0]
            },
            {
                text: "Requesting Approval",
                value: 10,
                color: "green",
                friendly: "Requesting Approval",
                type: [2, 3]
            },
            {
                text: "Declined",
                value: 11,
                color: "green",
                friendly: "Declined",
                type: [2, 3]
            },
            {
                text: "Approved",
                value: 12,
                color: "green",
                friendly: "Approved",
                type: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                text: "Implementation Pending",
                value: 13,
                color: "blue",
                friendly: "Implementation Pending",
                type: [0]
            },
            {
                text: "Variation Requested",
                value: 14,
                color: "blue",
                friendly: 'Variation Requested',
                type: [2, 3]
            },
            {
                text: "Implemented",
                value: 15,
                color: "blue",
                friendly: "Implemented",
                type: [3]
            },
            {
                text: "On Hold",
                value: 16,
                color: "blue",
                friendly: "On Hold",
                type: [0]
            },
            {
                text: "Waiting Fixture Requirements",
                value: 17,
                color: "blue",
                friendly: "Waiting Fixture Requirements",
                type: [3]
            }, {
                text: "Waiting Supplier",
                value: 18,
                color: "blue",
                friendly: "Waiting Supplier",
                type: [0]
            }, {
                text: "Awaiting Distribution",
                value: 19,
                color: "blue",
                friendly: "Awaiting Distribution",
                type: [3]
            },
            {
                text: "Approval In Progress",
                value: 20,
                color: "blue",
                friendly: "Approval In Progress",
                type: [3]
            }, {
                text: "Distribution In Progress",
                value: 21,
                color: "blue",
                friendly: "Distribution In Progress",
                type: [3]
            }, {
                text: "Review Range",
                value: 22,
                color: "blue",
                friendly: "Review Range",
                type: [2]
            },
            {
                text: "Review Planogram",
                value: 23,
                color: "blue",
                friendly: "Review Planogram",
                type: [3]
            },
            {
                text: "Implementation In Progress",
                value: 24,
                color: "blue",
                friendly: "Implementation In Progress",
                type: [3]
            }, {
                text: "Like",
                value: 25,
                color: "blue",
                friendly: "Like",
                type: [3]
            }, {
                text: "Implementation Complete",
                value: 26,
                color: "blue",
                friendly: "Implementation Complete",
                type: [3]
            }, {
                text: "Distribution Complete",
                value: 27,
                color: "blue",
                friendly: "Distribution Complete",
                type: [3]
            }, {
                text: "Waiting Product Info",
                value: 28,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Product Info",
            }, {
                text: "Waiting Product Info in progress",
                value: 29,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Product Info in progress",
            }, {
                text: "Waiting Product Info Complete",
                value: 30,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Product Info Complete",
            },
            {
                text: "Waiting Planogram Input",
                value: 31,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Planogram Input",
            }, {
                text: "Waiting Planogram Input in progress",
                value: 32,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Planogram Input in progress",
            }, {
                text: "Waiting Planogram Input Complete",
                value: 33,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Planogram Input Complete",
            }, {
                text: "Waiting Fixture Input",
                value: 34,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Fixture Input"
            }, {
                text: "Waiting Fixture Input in progress",
                value: 35,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Fixture Input in progress"
            }, {
                text: "Waiting Fixture Input Complete",
                value: 36,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Fixture Input Complete"
            }, {
                text: "Waiting Check Planogram",
                value: 37,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Check Planogram"
            }, {
                color: "yellow",
                type: [3, 1],
                text: "Waiting Check Planogram in progress",
                value: 38,
                friendly: "Waiting Check Planogram in progress"
            }, {
                text: "Waiting Check Planogram Complete",
                value: 39,
                type: [3, 1],
                color: "yellow",
                friendly: "Waiting Check Planogram Complete"
            },
            {
                text: "New Process Assigned",
                value: 40,
                type: [1, 2, 3],
                color: "yellow",
                friendly: "New Process Assigned"
            }
        ]

        if (componentType == null) {
            return statusList
        } else {
            let retval = []
            statusList.forEach(statusobj => {
                statusobj.type.forEach(type => {

                    if (type == componentType) {

                        retval.push(statusobj)
                    }
                })
            })
            return retval
        }
    }
    getTypeList() {
        var types = [{
                text: "Event",
                value: 0,
                color: "warning"
            },
            {
                text: "Data Preparation",
                value: 1,
                color: "success"

            }, {
                text: "Ranging",
                value: 2,
                color: "error"

            },
            {
                text: "Planogram",
                value: 3,
                color: "primary"

            }, {
                text: "Promotion",
                value: 4,
                color: "purple"

            }, {
                color: "",
                text: "",
                value: 5
            }
        ]


        return types
    }

    static getColorByTypeAndStatus(type, status) {
        const colors = [
            "#34495e",
            "#1abc9c",
            "#2ecc71",
            "#3498db",
            "#9b59b6",
            "#f1c40f",
            "#e67e22",
            "#e74c3c",
            "#ecf0f1",
            "#95a5a6",
        ]

        return colors[type + returnAcumulator(status, type)]
    }

    static returnNextStep(type, status) {
        const retval = {
            endProcess: false,
            type: -1,
            status: -1
        }

        switch (type) {
            case 0:
                {

                }
                break;
            case 1:
                {
                    retval = handleDataPrep(status, retval);
                }
                break;
            case 2:
                {

                }
                break;
            case 3:
                {

                }
                break;
            case 4:
                {

                }
                break;
            case 5:
                {

                }
                break;
        }

        return retval;
    }
}

function handleDataPrep(status, retval) {
    switch(status) {
        case 1: {
            retval.status = 2;
        }break;
        case 2: {
            retval.endProcess = true;
        }break;
        case 6: {
            retval.status = 1;
        }break;
    }

    return retval;
}

function returnAcumulator(status, type) {
    let acumulator;

    switch (status) {
        case 0:
            {
                acumulator = 0;
            }
            break;
        case 1:
            {
                acumulator = 0;
            }
            break;
        case 2:
            {
                acumulator = 0;
            }
            break;
        case 3:
            {
                acumulator = 6;
            }
            break;
        case 4:
            {
                acumulator = 6;
            }
            break;
        case 5:
            {
                acumulator = 7;
            }
            break;
        case 6:
            {
                acumulator = 0;
            }
            break;
        case 7:
            {
                acumulator = 0;
            }
            break;
        case 8:
            {
                acumulator = 0;
            }
            break;
        case 9:
            {
                acumulator = 7;
            }
            break;
        case 10:
            {
                acumulator = 1;
            }
            break;
        case 11:
            {
                acumulator = 0;
            }
            break;
        case 12:
            {
                acumulator = 1;
            }
            break;
        case 13:
            {
                acumulator = 3;
            }
            break;
        case 14:
            {
                acumulator = 0;
            }
            break;
        case 15:
            {
                acumulator = 3;
            }
            break;
        case 16:
            {
                acumulator = 0;
            }
            break;
        case 17:
            {
                acumulator = 0;
            }
            break;
        case 18:
            {
                acumulator = 0;
            }
            break;
        case 19:
            {
                acumulator = 2;
            }
            break;
        case 20:
            {
                acumulator = 1;
            }
            break;
        case 21:
            {
                acumulator = 2;
            }
            break;
        case 22:
            {
                acumulator = 0;
            }
            break;
        case 23:
            {
                acumulator = 0;
            }
            break;
        case 24:
            {
                acumulator = 3;
            }
            break;
        case 25:
            {
                acumulator = 0;
            }
            break;
        case 26:
            {
                acumulator = 3;
            }
            break;
        case 27:
            {
                acumulator = 27;
            }
            break;
        case 28:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 29:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 30:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 31:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 32:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 33:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 34:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 35:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 36:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 37:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 38:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 39:
            {
                acumulator = (0 - type) + 9;
            }
            break;
        case 40:
            {
                acumulator = 0 - type;
            }
            break;
    }

    return acumulator;
}

export default projectStatusHandler