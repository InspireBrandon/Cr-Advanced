<template>
    <div style="text-align: center; cursor: pointer;">
        <v-btn @click="openEdit" class="ma-0" small icon>
            <v-icon color="secondary">edit</v-icon>
        </v-btn>
        <v-btn @click="removeLine" class="ma-0" small icon>
            <v-icon color="red">delete</v-icon>
        </v-btn>
        <YesNoModal ref="yesNo"></YesNoModal>
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    import Axios from 'axios';

    export default {
        components: {
            YesNoModal
        },
        methods: {
            openEdit() {
                let item = this.params.data;
                this.params.context.componentParent.openEdit(item);
            },
            removeLine() {
                let self = this;

                self.$refs.yesNo.show('Delete this line?', goThrough => {
                    if (goThrough) {

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `Event_Sheet_Resource/?id=${self.params.data.id}`)
                            .then(result => {
                                delete Axios.defaults.headers.common["TenantID"];

                                self.params.api.updateRowData({
                                    remove: [self.params.data]
                                })

                                console.log("Result" + result);
                            })
                            .catch(error => {
                                alert("Failed to delete : " + item.Title + error);
                            })
                    }
                })
            },
        }
    }
</script>