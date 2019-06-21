<template>
    <div style="text-align: center; cursor: pointer;" class="pa-0 ma-0">
        <!-- <v-btn @click="duplicateLine" class="ma-0" small icon>
            <v-icon color="secondary">file_copy</v-icon>
        </v-btn>
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn> -->
        <v-tooltip bottom class="ma-0">
            <template v-slot:activator="{ on }">
                <v-checkbox hide-details v-on="on"  v-model="selectedDelete"
                    :value="params.data" class="ma-0"></v-checkbox>
            </template>
            <span>select for group assign</span>
        </v-tooltip>


    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    export default {
          components: {
            YesNoModal
        },
        data() {
            return {
                selectedDelete: null,
            }
        },
        methods: {
            addRemove(data) {
                let self = this
                 self.params.context.componentParent.assignToGroup(data)
                
                // if (self.selected == false) {
                   
                // } else {
                //     self.params.context.componentParent.componentParentremoveFromGroup(data)
                // }
            }
        },
        created() {
            let self = this;
            // self.selectedUser = self.params.context.componentParent.selectedUser;
        }
    }
</script>