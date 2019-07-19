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
    import Axios from 'axios';

    export default {
        components: {
            ModulesModal
        },
        methods: {
            openModal() {
                let self = this;
                self.$refs.modules_modal.show(self.params.data, (fixtureData, totalModules) => {
                    self.params.context.componentParent.saveStoreFixtureDetails(fixtureData, () => {
                        let request = self.params;
                        request.data.modules = totalModules;
                        self.params.context.componentParent.UpdateLine(request, () => {

                        })
                    })
                })
            }
        }
    }
</script>