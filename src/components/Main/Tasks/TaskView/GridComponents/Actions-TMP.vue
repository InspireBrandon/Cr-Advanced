<template>
    <div v-if="systemUserID != undefined && systemUserID != null" style="display: flex;">
        <v-tooltip bottom v-if="button.button_1.show">
            <template v-slot:activator="{ on }">
                <v-btn @click="button.button_1.click(params.data)" flat icon small>
                    <v-icon :color="button.button_1.color" v-on="on">{{ button.button_1.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ button.button_1.tooltip }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="button.button_2.show">
            <template v-slot:activator="{ on }">
                <v-btn @click="button.button_2.click(params.data)" flat icon small>
                    <v-icon :color="button.button_2.color" v-on="on">{{ button.button_2.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ button.button_2.tooltip }}</span>
        </v-tooltip>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                systemUserID: null,
            }
        },
        mounted() {
            let self = this;
            self.systemUserID = self.params.context.componentParent.$parent.$parent.selectedUser;
        },
        computed: {
            button() {
                let self = this;
                let currentItem = self.params.data;
                let componentParent = self.params.context.componentParent;

                let retval = handle_button(currentItem, componentParent, self);

                return retval;
            }
        }
    }

    function handle_button(item, cp, self) {
        let button_1 = new buttonItem();
        let button_2 = new buttonItem();

        switch (item.status) {
            case 0: {
                button_1.set('secondary', 'assignment', cp.assign, "Assign")
            }
            break;
        case 1: {
            switch (item.type) {
                case 1: {
                    button_1.set('warning', 'visibility', cp.routeToView, "View")
                    button_2.set('error', 'check', cp.setComplete, "Complete")
                }
                break;
            case 2: {
                button_1.set('warning', 'visibility', cp.routeToView, "View")
                button_2.set('error', 'check', cp.setComplete, "Complete")
            }
            break;
            case 3: {
                button_1.set('warning', 'visibility', cp.routeToView, "View")
                button_2.set('error', 'check', cp.setPlanogramComplete, "Complete")
            }
            break;
            }
        }
        break;
        case 2: {
            switch (item.type) {
                case 1: {
                    if (item.actionedByUserID == self.systemUserID) {
                        button_1.set('error', 'close', cp.closeTask, "Close")
                    }

                    if (item.systemUserID == self.systemUserID) {
                        button_1.set('secondary', 'assignment', cp.assign, "Assign")
                        button_2.set('warning', 'visibility', cp.routeToView, "View")
                    }
                }
                break;
            case 2: {
                if (item.actionedByUserID == self.systemUserID) {
                    button_1.set('error', 'close', cp.closeTask, "Close")
                }

                if (item.systemUserID == self.systemUserID) {
                    button_1.set('secondary', 'assignment', cp.assign, "Assign")
                    button_2.set('warning', 'visibility', cp.routeToView, "View")
                }
            }
            break;
            case 3: {
                if (item.actionedByUserID == self.systemUserID) {
                    button_2.set('error', 'close', cp.closeTask, "Close")
                }

                if (item.systemUserID == self.systemUserID) {
                    button_1.set('primary', 'send', cp.submitForApproval, "Send")
                    button_2.set('warning', 'visibility', cp.routeToView, "View")
                }
            }
            break;
            }
        }
        break;
        case 3: {}
        break;
        case 4: {}
        break;
        case 5: {}
        break;
        case 6: {
            button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }
        break;
        case 7: {
            button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }
        case 8: {
            button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }
        break;
        case 10: {
            button_1.set('success', 'visibility', cp.setApprovalInProgress, "View")
        }
        break;
        case 12: {
            if (item.actionedByUserID == self.systemUserID) {
                button_1.set('error', 'close', cp.closeTask, "Close")
            }

            if (item.systemUserID == self.systemUserID) {
                button_1.set('primary', 'send', cp.submitForDistribution, "Send")
            }
        }
        break;
        case 13: {
            button_1.set('success', 'visibility', cp.setImplementationInProgress, "View")
        }
        break;
        case 14: {
            button_1.set('secondary', 'assign', cp.assign, "Assign")
        }
        break;
        case 16: {
            if (item.actionedByUserID == self.systemUserID) {
                button_1.set('error', 'close', cp.closeTask, "Close")
            }

            if (item.systemUserID == self.systemUserID) {
                button_1.set('error', 'close', cp.closeTask, "Close")
            }
        }
        break;
        case 19: {
            button_1.set('success', 'visibility', cp.setDistributionInProgress, "View")
        }
        break;
        case 20: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
        }
        break;
        case 21: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
        }
        break;
        case 24: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
        }
        break;
        case 26: {
            button_1.set('primary', 'visibility', cp.routeToView, "View")
        }
        break;
        case 28: {
            if (item.rollingUserID != item.systemUserID)
                button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 29: {
            if (item.rollingUserID != item.systemUserID)
                button_1.set('error', 'check', cp.completeSubtask, "Complete")
        }
        break;
        case 30: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 31: {
            if (item.rollingUserID != self.systemUserID)
                button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 32: {
            if (item.rollingUserID != self.systemUserID)
                button_1.set('error', 'check', cp.completeSubtask, "Complete")
        }
        break;
        case 33: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 34: {
            if (item.rollingUserID != self.systemUserID)
                button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 35: {
            if (item.rollingUserID != self.systemUserID)
                button_1.set('error', 'check', cp.completeSubtask, "Complete")
        }
        break;
        case 36: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 37: {
            if (item.rollingUserID != self.systemUserID)
                button_1.set('success', 'done', cp.setSubtaskInProgressAndView, "Received")
        }
        break;
        case 38: {
            if (item.rollingUserID != self.systemUserID) {
                button_1.set('warning', 'visibility', cp.goToSubtaskView, "View")
                button_2.set('error', 'check', cp.completeSubtask, "Complete")
            }
        }
        break;
        case 39: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 40: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 42: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 43: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        }

        let retval = {
            button_1,
            button_2
        }

        return retval;
    }

    function buttonItem() {
        let self = this;
        self.show = false;
        self.color = null;
        self.icon = null;
        self.click = null;
        self.tooltip = null;

        this.set = function (color, icon, click, tooltip) {
            self.show = true;
            self.color = color;
            self.icon = icon;
            self.click = click;
            self.tooltip = tooltip;
        }
    }
</script>