<template>
    <div style="display: flex;">
        <div @click="$router.push('/SpacePlanning')" class="btn_grid start">
            <div class="btn_text">Start</div>
        </div>
        <div @click="setVariationComplete(params.data)" class="btn_grid link">
            <div class="btn_text">Link</div>
        </div>
        <PlanogramDetailsSelector ref="planogramDetailSelector" />
        <SpacePlanSelector ref="SpacePlanSelector"></SpacePlanSelector>
        <RangeSelectorModal ref="RangeSelectorModal"></RangeSelectorModal>
    </div>

</template>

<script>
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector.vue'
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector.vue'
    import RangeSelectorModal from '@/components/Common/RangeSelectorModal.vue'

    import Axios from 'axios'
    import jwt from 'jsonwebtoken';

    export default {
        props: ['params'],
        components: {
            PlanogramDetailsSelector,
            SpacePlanSelector,
            RangeSelectorModal
        },
        created() {},
        methods: {
            checkTaskTakeover(request, callback) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                if (request.systemUserID != systemUserID) {
                    request.systemUserID = systemUserID;
                    request.actionedByUserID = null;
                    request.status = 42;
                    request.closed = true;

                    self.createProjectTransaction(request, () => {
                        callback();
                    })
                } else {
                    callback();
                }
            },
            createProjectTransaction(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTX)
                })
            },
            setVariationComplete(item) {
                let self = this;

                self.$refs.SpacePlanSelector.show(spacePlanID => {
                    self.$refs.RangeSelectorModal.show(rangePlanID => {

                        Axios.get(process.env.VUE_APP_API + `ProjectTXSingle?projectTXID=${item.txid}`)
                            .then(res => {
                                let request = JSON.parse(JSON.stringify(res.data.projectTX))

                                request.status = 47;
                                request.systemFileID = spacePlanID;
                                request.rangeFileID = rangePlanID;
                                self.createProjectTransaction(request, newItem => {})

                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })
                })
            },

        }
    }
</script>

<style scoped>
    .start {
        background: #ff7200;
        border: 1px solid grey;
        color: white;
    }

    .link {
        background: #fff;
        border: 1px solid blue;
        color: blue;
    }

    .btn_grid {
        height: 20px;
        border-radius: 3px;
        margin-top: 5px;
        text-align: center;
        font-size: 18px;
        width: 55px;
        font-weight: 600;
        margin: 8px 3px;
    }

    .start:hover {
        background: #c75a00;
        cursor: pointer;
    }

    .link:hover {
        background: rgb(235, 235, 235);
        cursor: pointer;
    }

    .btn_text {
        margin-top: -5px;
    }
</style>