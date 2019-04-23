class projectStatusHandler {
    constructor() {

    }

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
                color: "yellow"
            },
            {
                text: "Data Preparation",
                value: 1,
                color: "green"

            }, {
                text: "Ranging",
                value: 2,
                color: "red"

            },
            {
                text: "Planogram",
                value: 3,
                color: "blue"

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
}
export default projectStatusHandler