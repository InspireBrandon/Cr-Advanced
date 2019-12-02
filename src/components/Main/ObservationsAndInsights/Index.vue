<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Observations & Insights</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dense dark color="grey darken-4">
            <v-toolbar-items>
                <v-select @change="optionChange" v-if="options" v-model="selectedOption" :items="options"
                    style="width: 300px;" label="Observation Type">
                </v-select>
                <v-autocomplete @change="onCategoryChange" v-if="selectedOption == 0" item-text="name" item-value="id"
                    class="ml-2" v-model="selectedTopLineTopic" return-object :items="topLineTopics"
                    style="width: 300px;" label="Observation Topic">
                </v-autocomplete>
                <v-autocomplete @change="onCategoryChange" v-if="selectedOption == 1" item-text="name" item-value="id"
                    class="ml-2" v-model="selectedProject" return-object :items="projects" style="width: 300px;"
                    label="Category">
                </v-autocomplete>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-btn @click="addNote" color="primary">Add New</v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
            <PlanogramNoteViewer ref="PlanogramNoteViewer" />
        </v-card-text>
        <PlanogramNoteModal ref="PlanogramNoteModal" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import PlanogramNoteModal from '@/components/Common/PlanogramNoteModal';
    import PlanogramNoteViewer from '@/components/Common/PlanogramNoteViewer';

    export default {
        components: {
            PlanogramNoteViewer,
            PlanogramNoteModal
        },
        data() {
            return {
                options: [{
                        text: "Top Line",
                        value: 0,
                    },
                    {
                        text: "Category",
                        value: 1,
                    }
                ],
                selectedOption: 0,
                projects: [],
                selectedProject: null,
                topLineTopics: [],
                selectedTopLineTopic: null
            }
        },
        mounted() {
            let self = this;
            self.getProjects();
            self.getObservationTopics();
        },
        methods: {
            getProjects() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Project")
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.projects = r.data.projectList;
                    })
            },
            getObservationTopics() {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "TopLineType")
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.topLineTopics = r.data;
                    })
            },
            addNote() {
                let self = this;

                self.$refs.PlanogramNoteModal.show(data => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + "PlanogramNoteTX", data)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.onCategoryChange();
                        })
                })
            },
            onCategoryChange() {
                let self = this;

                self.$nextTick(() => {
                    if (self.selectedOption == 0) {
                        self.$refs.PlanogramNoteViewer.getTransactions(self.selectedOption, self
                            .selectedTopLineTopic.id);
                    } else {
                        self.$refs.PlanogramNoteViewer.getTransactions(self.selectedOption, self.selectedProject
                            .planogram_ID);
                    }
                })
            },
            optionChange() {
                let self = this;
                self.onCategoryChange();
            }
        }
    }
</script>