<template>
    <div>
        <v-toolbar flat dense color="primary" class="subheading font-weight-regular font-italic" dark>Observations
            <v-spacer></v-spacer>
            <v-icon>work</v-icon>
        </v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.observation_1" label="Observation 1"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.observation_2" label="Observation 2"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.observation_3" label="Observation 3"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.observation_4" label="Observation 4"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.observation_5" label="Observation 5"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'store_observation',
        data() {
            return {
                valid: true,
                form: {
                    observation_1: '',
                    observation_2: '',
                    observation_3: '',
                    observation_4: '',
                    observation_5: '',
                }
            }
        },
        methods: {
            setForm(data) {
                let self = this;
                for (var prop in self.form) {
                    self.form[prop] = data[prop];
                }
            },
            validate() {
                let self = this;

                self.valid = self.$refs.form.validate();

                return self.valid;
            },
            getForm() {
                let self = this;
                return self.form;
            }
        }
    }
</script>