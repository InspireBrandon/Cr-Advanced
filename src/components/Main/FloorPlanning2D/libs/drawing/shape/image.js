import Konva from 'konva'
import Shape from './shape'

const defaultImage = 'https://glowvarietyshow.com/wp-content/uploads/2017/03/placeholder-image.jpg'

class Image extends Shape {
    constructor(parent) {
        super(parent);

        let self = this;
        self.create();
    }

    create() {
        let self = this;

        self.shape = new Konva.Image({
            name: 'image',
            visible: 'inherit',
            x: 10,
            y: 10,
            draggable: true
        })

        self.parent.add(self.shape);
        self.parent.draw();
    }
}

export default Image;