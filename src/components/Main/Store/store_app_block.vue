<template>
    <div>
        <span class="app_name">{{ appConfigDetail.detail.name }}</span>
        <v-card class="elevation-0">
            <v-img :src="appConfigDetail.detail.imgSrc" height="200px">
                <v-container fill-height fluid pa-2>
                    <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                            <span></span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-img>

            <v-card-actions>
                <v-btn flat>
                    Install
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon small>
                    <v-icon color="info">info</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: 'app_block',
        props: ['appConfigDetail'],
        methods: {
            openApp(routeItem) {
                let self = this;

                if (routeItem.openInNewWindow) {
                    let routeData = this.$router.resolve({
                        name: routeItem.routeName
                    });

                    window.open(routeData.href, '_blank');
                } else {
                    self.$router.push(routeItem.route)
                }
            }
        }
    }
</script>

<style scoped>
    .app_name {
        cursor: pointer;
    }

    .app_name:hover {
        font-weight: 500;
    }

    .app_version {
        text-align: center;
    }
</style>