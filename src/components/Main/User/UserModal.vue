<template>
    <v-dialog fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Profile Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close"> close
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg12 md12 sm12 xs12>
                        <v-avatar :tile="false" :size="150" color="grey lighten-4">
                            <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
                        </v-avatar>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="First Name" v-model="firstName"> </v-text-field>
                        <v-text-field label="Company" v-model="companyName"> </v-text-field>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="Last Name" v-model="lastName"> </v-text-field>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-select label="Country" :items="countries" v-model="countryCode"> </v-select>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="City" v-model="city"> </v-text-field>
                    </v-flex>
                    <v-flex lg12 md12 sm12 xs12>
                        <v-text-field label="Street Address" v-model="streetAddress"> </v-text-field>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="Email Address" v-model="emailAddress"> </v-text-field>
                    </v-flex>

                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="Phone Number" v-model="phoneNumber"> </v-text-field>
                    </v-flex>
                </v-layout>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit">save</v-btn>
                </v-card-actions>
            </v-container>



        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    //   import jwt from 'jsonwebtoken';
    export default {

        data() {
            return {
                countries: [],
                accountID: -1,
                accountProfileID: -1,
                accountProfileUID: '',
                city: '',
                companyName: '',
                countryCode: '',
                emailAddress: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                streetAddress: '',
                modalShow: false
            }

        },
        created() {
            this.getCountries();
        },
        methods: {

            submit() {
                let self = this
                self.modalShow = false
            },
            getAccountDetails() {
                let self = this;
                let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

                AAxios.get(process.env.ServerAddress + `AccountProfile?accountID=${accountID}`)
                    .then(r => {
                        console.log(r);
                        self.setAccountDetails(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            setAccountDetails(data) {
                let self = this;
                self.accountID = data.accountID;
                self.accountProfileID = data.accountProfileID;
                self.accountProfileUID = data.accountProfileUID;
                self.city = data.city;
                self.companyName = data.companyName;
                self.countryCode = data.countryCode;
                self.emailAddress = data.emailAddress;
                self.firstName = data.firstName;
                self.lastName = data.lastName;
                self.phoneNumber = data.phoneNumber;
                self.streetAddress = data.streetAddress;
            },
            saveAccountProfile() {
                let self = this;

                let request = {
                    AccountProfileID: self.accountProfileID,
                    AccountProfileUID: self.accountProfileUID,
                    FirstName: self.firstName,
                    LastName: self.lastName,
                    CompanyName: self.companyName,
                    CountryCode: self.countryCode,
                    City: self.city,
                    StreetAddress: self.streetAddress,
                    PhoneNumber: self.phoneNumber,
                    EmailAddress: self.emailAddress,
                    AccountID: self.accountID
                }

                AAxios.put(process.env.ServerAddress + "AccountProfile", request)
                    .then(r => {
                        alert("Success")
                    })
                    .catch(e => {
                        alert("Failed")
                    })
            },
            close() {
                let self = this
                self.modalShow = false
            },
            open() {
                let self = this
                self.modalShow = true
            },
            getCountries() {
                let self = this;

                Axios.get("https://restcountries.eu/rest/v2/all")
                    .then(r => {
                        let countries = r.data;

                        for (var i = 0; i < countries.length; i++) {
                            let country = countries[i];
                            let tmp = {
                                text: country.name,
                                value: country.alpha2Code
                            }
                            self.countries.push(tmp);
                        }

                        // self.getAccountDetails();
                    })
                    .catch(e => {
                        alert("Could not get country Information. Please try again later." + e.toString())
                    })
            },
        }
    }
</script>