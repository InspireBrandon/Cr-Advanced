<template>
    <v-app dark id="inspire">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-3">
                            <v-card-text>
                                <v-form>
                                    <div style="text-align: center;">
                                        <img style="max-height: 200px; max-width: 200px;" src="http://project1.devinspire.co.za/static/img/Chain-Research-Logo1.a3c73b4.png"
                                            alt="">
                                    </div>
                                    <h1 class="text-md-center">Register</h1>
                                    <v-text-field v-model="firstName" label="First Name" type="text"></v-text-field>
                                    <v-text-field v-model="lastName" label="Last Name" type="text"></v-text-field>
                                    <v-text-field v-model="emailAddress" label="Email Address" type="text"></v-text-field>
                                    <v-text-field v-model="username" label="Username" type="text"></v-text-field>
                                    <v-text-field v-model="password" :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                                        :type="showPassword ? 'text' : 'password'" label="Password" @click:append="showPassword = !showPassword"></v-text-field>
                                    <div>
                                        <v-btn @click="register" :loading="loading" style="width: 100%;" color="primary">Register</v-btn>
                                        <v-btn @click="$router.push('/Login')" style="width: 100%;" color="error">Cancel</v-btn>
                                    </div>
                                    <div style="text-align: center; color: red; font-weight: bold;">
                                        {{ errorText }}
                                    </div>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import Axios from 'axios';

    export default {
        data: () => ({
            drawer: null,
            firstName: "",
            lastName: "",
            emailAddress: "",
            username: "",
            password: "",
            loading: false,
            errorText: "",
            showPassword: false
        }),
        methods: {
            register() {
                let self = this;
                self.loading = true;

                self.errorText = "";

                Axios.post(process.env.VUE_APP_API + `RegisterSimple`, {
                        firstName: self.firstName,
                        lastName: self.lastName,
                        emailAddress: self.emailAddress,
                        username: self.username,
                        password: self.password,
                    })
                    .then(r => {
                        if (r.data.success) {
                            self.$router.push('/Login');
                        } else {
                            self.loading = false;
                            self.errorText = r.data.clientError;
                        }
                    })
                    .catch(e => {
                        self.errorText = 'Failed to register. Try again later';
                    })
            }
        }
    }
</script>