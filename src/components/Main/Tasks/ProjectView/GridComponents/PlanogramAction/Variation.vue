<template>
    <div style="display: flex;">
        <div @click="$router.push('/SpacePlanning')" class="btn_grid start">
            <div class="btn_text">Start</div>
        </div>
        <div @click="link(params.data)" class="btn_grid link">
            <div class="btn_text">Link</div>
        </div>
        <PlanogramDetailsSelector ref="planogramDetailSelector" />
    </div>
</template>

<script>
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector.vue'
    import Axios from 'axios'
    export default {
        props: ['params'],
        components: {
            PlanogramDetailsSelector
        },
        created() {},
        methods: {
            link(item) {

              
                let self = this;
                Axios.get(process.env.VUE_APP_API +`ProjectTXSingle?projectTXID=${item.txid}`).then(res=>{
                    console.log(res);
                    
                })
               console.log(item);

                // self.$refs.planogramDetailSelector.show(null, false, -1, data => {
                //     let self = this
                //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                //     Axios.post(process.env.VUE_APP_API +
                //         `Variation_Order?projectTXID=${item.txid}&systemFileID=${data.systemFileID}`).then(
                //         r => {

                //             delete Axios.defaults.headers.common["TenantID"];
                //         })
                // })
            }
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