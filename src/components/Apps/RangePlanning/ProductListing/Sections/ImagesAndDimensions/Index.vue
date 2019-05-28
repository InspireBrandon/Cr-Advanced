<template>
    <div>
        <v-toolbar dark dense>
            <v-btn color="primary" @click="currentView == 4? currentView = 0 : currentView++">{{ currentViewName() }}</v-btn>
        </v-toolbar>
        <General :items="items" v-show="currentView == 0" ref="General"></General>
        <Tray :items="items" v-show="currentView == 1" ref="Tray"></Tray>
        <Case :items="items" v-show="currentView == 2" ref="Case"></Case>
        <Shrink :items="items" v-show="currentView == 3" ref="Shrink"></Shrink>
        <Pallet :items="items" v-show="currentView == 4" ref="Pallet"></Pallet>
    </div>
</template>

<script>
    import General from '@/components/Apps/RangePlanning/ProductListing/Sections/ImagesAndDimensions/Sections/General'
    import Tray from '@/components/Apps/RangePlanning/ProductListing/Sections/ImagesAndDimensions/Sections/Tray'
    import Case from '@/components/Apps/RangePlanning/ProductListing/Sections/ImagesAndDimensions/Sections/Case'
    import Shrink from '@/components/Apps/RangePlanning/ProductListing/Sections/ImagesAndDimensions/Sections/Shrink'
    import Pallet from '@/components/Apps/RangePlanning/ProductListing/Sections/ImagesAndDimensions/Sections/Pallet'

    export default {
        name: 'hierachy',
        props: ['items', 'duplicate', 'remove', 'copy', 'canPaste', 'paste'],
        components: { 
            General,
            Tray,
            Case,
            Shrink,
            Pallet
        },
        data() {
            return {
                currentView: 0
            }
        },
        methods: {
            duplicateLine(item) {
                let self = this;
                self.duplicate(item);
            },
            removeLine(item) {
                let self = this;
                self.remove(item);
            },
            currentViewName() {
                let self = this;
                let currentName = "";
                
                switch(self.currentView) {
                    case 0: {
                        currentName = "General";
                    }break;
                    case 1: {
                        currentName = "Tray";
                    }break;
                    case 2: {
                        currentName = "Case";
                    }break;
                    case 3: {
                        currentName = "Shrink";
                    }break;
                    case 4: {
                        currentName = "Pallet";
                    }break;
                }

                return currentName;
            }
        }
    }
</script>

<style>
    .no-hover {
        background: white !important;
    }
</style>