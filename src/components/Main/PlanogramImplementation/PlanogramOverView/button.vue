<template>
    <div style=" cursor: pointer; display:flex;">
        <div v-for="(button, idx) in buttons" :key="idx"
            v-if="button.availableStatuses.includes(params.data.planogramStoreStatus) && button.allowedUsers.includes(params.context.componentParent.userAccess)">
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
        <!-- <div
            v-if="params.data.systemFileID != undefined && params.data.systemFileID != null && params.data.systemFileID != 0">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"
                        @click="params.context.componentParent.$parent.$parent.viewPlanogram(params.data)" class="ma-0">
                        <v-icon color="orange">
                            visibility
                        </v-icon>
                    </v-btn>
                </template>
                <span>View Planogram</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.planogramStoreStatus != 6">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="params.context.componentParent.$parent.$parent.showStore(params.data)"
                        class="ma-0">
                        <v-icon>
                            store
                        </v-icon>
                    </v-btn>
                </template>
                <span>Store overview</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.requiredInStore==true">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="success" class="ma-0"
                        @click="params.context.componentParent.removeFromStore(params ,false,0)">
                        <v-icon>add</v-icon>
                    </v-btn>
                </template>
                <span>Add Category to store</span>
            </v-tooltip>
        </div>
        <div
            v-if="params.data.planogramStoreStatus==0||params.data.planogramStoreStatus==5||params.data.planogramStoreStatus==7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on"
                        @click="params.context.componentParent.$parent.$parent.assignPlanogramToStore(params)" icon flat
                        small color="primary" class="ma-0">
                        <v-icon>assignment</v-icon>
                    </v-btn>
                </template>
                <span>Assign planogram</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.planogramStoreStatus==1">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.$parent.$parent.Distribute(params)" icon
                        flat small color="success" class="ma-0">
                        <v-icon>send</v-icon>
                    </v-btn>
                </template>
                <span>Distribute</span>
            </v-tooltip>
        </div>
        <div
            v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=4&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=5&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,1,'Model Variation')" icon
                        flat small color="warning" class="ma-0">
                        M
                    </v-btn>
                </template>
                <span>request model variation</span>
            </v-tooltip>
        </div>
        <div
            v-if="params.data.planogramStoreStatus!=0&&params.data.planogramStoreStatus!=4&&params.data.planogramStoreStatus!=6&&params.data.planogramStoreStatus!=5&&params.data.planogramStoreStatus!=7">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="params.context.componentParent.openOrder(params,0,'Store Variation')" icon
                        flat small color="warning" class="ma-0">
                        S
                    </v-btn>
                </template>
                <span>request store variation</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.planogramStoreStatus != 6">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="params.context.componentParent.removeFromStore(params ,true,0)"
                        class="ma-0">
                        <v-icon>
                            time_to_leave
                        </v-icon>
                    </v-btn>
                </template>
                <span>Park</span>
            </v-tooltip>
        </div>
        <div v-if="params.data.planogramStoreStatus == 6">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="params.context.componentParent.removeFromStore(params ,false, 0)"
                        class="ma-0">
                        <v-icon>
                            play_arrow
                        </v-icon>
                    </v-btn>
                </template>
                <span>Continue</span>
            </v-tooltip>
        </div>
        <div
            v-if="params.data.planogramStoreStatus == 2 || params.data.planogramStoreStatus == 3 || params.data.planogramStoreStatus == 4">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon flat small color="error" class="ma-0"
                        @click="params.context.componentParent.removePlanogramFromStore(params)">
                        <v-icon>remove_circle_outline</v-icon>
                    </v-btn>
                </template>
                <span>Remove planogram from store</span>
            </v-tooltip>
        </div> -->
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
                case 'store_overview': {
                    self.params.context.componentParent.$parent.$parent.showStore(self.params.data);
                }
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