<template>
    <div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="openModal" v-on="on" icon flat small class="ma-0">
                    <v-icon>settings</v-icon>
                </v-btn>
            </template>
            <span>Configure</span>
        </v-tooltip>
        {{params.data.modules}}
        <ModulesModal ref="modules_modal" />
    </div>
</template>
<script>
    import ModulesModal from './ModulesModal';

    export default {
        components: {
            ModulesModal
        },
        methods: {
            openModal() {
                let self = this;
                self.$refs.modules_modal.show(self.params.data, data => {
                    
                })
            }
        }
    }
</script>