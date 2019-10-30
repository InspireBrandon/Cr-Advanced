<template>
    <div style=" cursor: pointer; display:flex;">
        <div v-for="(button, idx) in buttons" :key="idx"
            v-if="button.availableStatuses.includes(params.data.planogramStoreStatus) && (button.allowedUsers.includes(params.context.componentParent.userAccess) || (button.allowRupert && params.context.componentParent.isRupert))">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="handleClick(button)" class="ma-0" :color="button.buttonColor"
                        v-if="button.icon == 'M' || button.icon == 'S'">
                        <span style="color: orange">{{ button.icon }}</span>
                    </v-btn>
                    <v-btn icon v-on="on" @click="handleClick(button)" class="ma-0" :color="button.buttonColor" v-else>
                        <v-icon :color="button.iconColor">
                            {{ button.icon }}
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ button.tooltip }}</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
    import StatusHandler from '../../Tasks/ProjectView/StatusHandler'
    let sh = new StatusHandler();

    export default {
        data() {
            return {
                buttons: sh.getButtons()
            }
        },
        methods: {
            handleClick(button) {
                let self = this;

                switch (button.id) {
                    case 'view': {
                        self.params.context.componentParent.$parent.$parent.viewPlanogram(self.params.data);
                    }
                    break;
                // case 'store_overview': {
                //     self.params.context.componentParent.$parent.$parent.showStore(self.params.data);
                // }
                break;
                case 'assign': {
                    self.params.context.componentParent.$parent.$parent.assignPlanogramToStore(self.params);
                }
                break;
                case 'replace_planogram': {
                    self.params.context.componentParent.$parent.$parent.replacePlanogram(self.params);
                }break;
                case 'distribute': {
                    self.params.context.componentParent.$parent.$parent.Distribute(self.params);
                }
                break;
                case 'set_implemented': {
                    self.params.context.componentParent.$parent.$parent.setImplemented(self.params);
                }
                break;
                case 'model_variation': {
                    self.params.context.componentParent.openOrder(self.params, 1, 'Model Variation');
                }
                break;
                case 'store_variation': {
                    self.params.context.componentParent.openOrder(self.params, 0, 'Store Variation');
                }
                break;
                case 'park': {
                    self.params.context.componentParent.removeFromStore(self.params, true, 0);
                }
                break;
                case 'continue': {
                    self.params.context.componentParent.removeFromStore(self.params, false, 0);
                }
                break;
                case 'remove_planogram_from_store': {
                    self.params.context.componentParent.removePlanogramFromStore(self.params);
                }
                break;
                }
            }
        }
    }
</script>