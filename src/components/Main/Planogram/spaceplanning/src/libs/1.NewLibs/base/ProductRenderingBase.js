import Konva from 'konva';
class ProductRenderingBase {

    constructor(layer, fixture, productItem, yMargin, ratio) {
        this.fixture = fixture;
        this.Layer = layer;
        this.productItem = productItem;
        this.ratio = ratio;
        this.margin = parseInt(yMargin);
        this.Image = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    CalculatePosition() {
        let self = this;

        if (self.productItem == null) {
            return;
        }
        let currentGroupPos = self.productItem.Group.position();
        let individualProductWidth = self.productItem.Orientation_Width * self.productItem.Facings_X;
        let individualProductHeight = self.productItem.Orientation_Height * self.productItem.Facings_Y;

        self.x = (currentGroupPos.x + ((individualProductWidth - self.productItem.Orientation_Width) / 2));
        // self.x = currentGroupPos.x;

        switch (self.fixture.Type.toUpperCase()) {
            case "SHELF": {
                if (self.margin != null && self.margin != undefined && self.margin > 0) {
                    self.y = (self.margin * self.ratio) * -1;
                } else {
                    self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
                }
            }
            break;
        case "BASE": {
            if (self.margin != null && self.margin != undefined && self.margin > 0) {
                self.y = (self.margin * self.ratio) * -1;
            } else {
                self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
            }
        }
        break;
        case "BASKET": {
            if (self.margin != null && self.margin != undefined && self.margin > 0) {
                self.y = (self.margin * self.ratio) * -1;
            } else {
                self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
            }
        }
        break;
        }
    }

    AddRendering() {
        let self = this;
        self.CalculatePosition();
        self.AddProductImage();
    }

    AddProductImage() {
        let self = this;
        let tmpRect = new Konva.Rect({
            x: self.x,
            y: self.y,
            width: self.productItem.Orientation_Width,
            height: self.productItem.Orientation_Height,
            fill: 'red'
        })

        self.fixture.Group.add(tmpRect); //ADD WHEN YOU WANT TO TEST

        self.Image = new Konva.Image({
            x: self.x,
            y: self.y,
            name: 'front-image-rendering-facing',
            listening: false
        })

        if (self.productItem.LastFace.toUpperCase() === "FRONT") {
            self.Image.rotation(0);
            self.Image.image(self.productItem.image_front);
            self.Image.setX(self.x + self.productItem.Orientation_Width / 2);
            self.Image.setY(self.y + self.productItem.Orientation_Height / 2);

            self.Image.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            self.Image.setWidth(self.productItem.image_orientation_width);
            self.Image.setHeight(self.productItem.image_orientation_height);

            self.Image.rotation(self.productItem.Rotation);

        } else if (self.productItem.LastFace.toUpperCase() === "LEFT") {
            self.Image.rotation(0);
            self.Image.image(self.productItem.image_side);
            self.Image.setX(self.x + self.productItem.Orientation_Width / 2);
            self.Image.setY(self.y + self.productItem.Orientation_Height / 2);

            self.Image.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            self.Image.setWidth(self.productItem.image_orientation_width);
            self.Image.setHeight(self.productItem.image_orientation_height);

            self.Image.rotation(self.productItem.Rotation);

        } else if (self.productItem.LastFace.toUpperCase() === "TOP") {
            self.Image.rotation(0);
            self.Image.image(self.productItem.image_top);
            self.Image.setX(self.x + self.productItem.Orientation_Width / 2);
            self.Image.setY(self.y + self.productItem.Orientation_Height / 2);

            self.Image.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            self.Image.setWidth(self.productItem.image_orientation_width);
            self.Image.setHeight(self.productItem.image_orientation_height);

            self.Image.rotation(self.productItem.Rotation);
        }
        self.Image.show();

        self.fixture.Group.add(self.Image);

        self.Layer.draw();
    }

    DestroyRendering() {
        let self = this;
        self.Image.destroy();
    }
}

export default ProductRenderingBase;