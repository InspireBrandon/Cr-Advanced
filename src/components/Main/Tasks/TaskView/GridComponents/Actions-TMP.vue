<template>
    <div v-if="systemUserID != undefined && systemUserID != null" style="display: flex;">
        <v-tooltip bottom v-if="button.button_1.show">
            <template v-slot:activator="{ on }">
                <v-btn :disabled="button.button_1.disabled" @click="button.button_1.click(params.data),button.button_1.disabled=true" flat icon small>
                    <v-icon :color="button.button_1.color" v-on="on">{{ button.button_1.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ button.button_1.tooltip }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="button.button_2.show">
            <template v-slot:activator="{ on }">
                <v-btn :disabled="button.button_2.disabled" @click="button.button_2.click(params.data),button.button_2.disabled=true" flat icon small>
                    <v-icon :color="button.button_2.color" v-on="on">{{ button.button_2.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ button.button_2.tooltip }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="button.button_3.show">
            <template v-slot:activator="{ on }">
                <v-btn :disabled="button.button_3.disabled" @click="button.button_3.click(params.data),button.button_3.disabled=true" flat icon small>
                    <v-icon :color="button.button_3.color" v-on="on">{{ button.button_3.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ button.button_3.tooltip }}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="button.button_4.show">
            <template v-slot:activator="{ on }">
                <v-btn :disabled="button.button_4.disabled" @click="button.button_4.click(params.data),button.button_4.disabled=true" flat icon small>
                    <v-icon :color="button.button_4.color" v-on="on">{{ button.button_4.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ button.button_4.tooltip }}</span>
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
        let button_3 = new buttonItem();
        let button_4 = new buttonItem();


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
        // case 3: {

        // }
        // break;
        // case 4: {

        // }
        // break;
        // case 5: {

        // }
        // break;
        case 6: {
            button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }
        break;
        case 7: {
            button_1.set('success', 'visibility', cp.setInProgressAndView, "View")
        }break;
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
            button_1.set('success', 'visibility', cp.setVariationInProgressandView, "View")
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
        // distribution
        case 19: {
            button_1.set('success', 'visibility', cp.setDistributionViewed, "View")
            button_2.set('error', 'local_parking', cp.setParked, "Park")
        }
        break;
        case 20: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
        }
        break;
        case 21: {
            button_1.set('warning', 'visibility', cp.routeToImplementation, "View")
            button_2.set('primary', 'send', cp.routeToView, "Distribute")
            button_3.set('success', 'settings_backup_restore', cp.recall, "Recall")
            button_4.set('error', 'local_parking', cp.setParked, "Park")
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
        case 44: {
            button_1.set('success', 'visibility', cp.routeToView, "View") //implementation
            button_2.set('primary', 'send', cp.setDistributionInProgress, "Distribute")
            button_3.set('error', 'local_parking', cp.setParked, "Park")
        }
        break;
        case 45: {
            button_1.set('success', 'visibility', cp.setDistributionViewed, "View")
        }

        break;
        case 46: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
            button_2.set('success', 'check', cp.setVariationComplete, "Complete")
        }
        break;
        case 47: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
            button_2.set('primary', 'send', cp.sendVariation, "Send Variation")
        }
        break;
        case 48: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        break;
        case 49: {
            button_1.set('success', 'visibility', cp.setRecallInProgressandView, "View")
        }
        break;
        case 50: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
            button_2.set('success', 'check', cp.setRecalledComplete, "Complete")
        }break;
        case 51: {
            button_1.set('warning', 'visibility', cp.routeToView, "View")
            button_2.set('primary', 'send', cp.sendRecall, "Send")
        }
        break;
        case 52: {
            button_1.set('error', 'close', cp.closeTask, "Close")
        }
        }

        let retval = {
            button_1,
            button_2,
            button_3,
            button_4
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
        self.disabled = false;

        this.set = function (color, icon, click, tooltip) {
            self.show = true;
            self.color = color;
            self.icon = icon;
            self.click = click;
            self.tooltip = tooltip;
        }
    }
</script>