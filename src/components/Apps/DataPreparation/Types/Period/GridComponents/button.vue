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
           openEdit(item) {
                let self = this;
                self.isAdd = false
                self.dialog = true
                self.form.id = item.id
                self.form.period_Name = item.period_Name
                self.form.period_To_Date = moment(item.period_To_Date).format('YYYY-MM-DD')
                self.form.period_From_Date = moment(item.period_From_Date).format('YYYY-MM-DD')
            },
            removeLine() {
                let self = this;

                self.$refs.yesNo.show('Delete this line?', goThrough => {
                    if (goThrough) {

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API +
                                `Retailer/${self.params.context.componentParent.name}?id=${self.params.data.id}`
                                )
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