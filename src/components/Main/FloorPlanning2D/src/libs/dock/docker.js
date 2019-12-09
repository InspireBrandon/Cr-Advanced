import GoldenLayout from 'golden-layout'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'

const config = {
    settings: {
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false
    },
    labels: {
    },
    content: [{
        type: 'row',
        content: [{
            type: 'column',
            content: [{
                type: 'component',
                componentName: 'settings',
                isClosable: false
            }, {
                type: 'component',
                componentName: 'layers',
                isClosable: false
            }]
        }, {
            type: 'stack',
            width: 90,
            content: [{
                type: 'component',
                componentName: 'document',
                title: 'document',
                isClosable: false
            }]
        }]
    }]
};

class Docker {
    constructor(config) {
        let self = this;
        self.layout = null;
        self.config = config;
    }

    init() {
        let self = this;
        self.layout = new GoldenLayout(config);
        self.layout.container = "#docker"

        self.layout.registerComponent('settings', function (container, state) {
            container.getElement().html(`<floor-planning-settings></floor-planning-settings>`);
        });
        self.layout.registerComponent('layers', function (container, state) {});
        self.layout.registerComponent('document', function (container, state) {});

        self.layout.init();
    }
}

export default Docker;