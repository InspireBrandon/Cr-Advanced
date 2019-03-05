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
                                    <v-text-field prepend-icon="person" name="login" label="Email Address" type="text"></v-text-field>
                                    <v-text-field :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'"
                                        id="password" prepend-icon="lock" name="password" label="Password"
                                        @click:append="showPassword = !showPassword"></v-text-field>
                                    <div style="text-align: right;">
                                        <v-btn class="pa-0 ma-0" small flat color="info">forgot password?</v-btn>
                                    </div>
                                    <div style="text-align: center;">
                                        <v-btn style="width: 100%;" color="primary">Login</v-btn>
                                        <v-btn style="width: 100%;" color="info">Register</v-btn>
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
    export default {
        data: () => ({
            drawer: null,
            showPassword: false
        }),
        props: {
            source: String
        }
    }
</script>