import Konva from 'konva';
class ProductRenderingBase {

    constructor(layer, fixture, productItem, yMargin, ratio) {
        this.fixture = fixture;
        this.Group = null;
        this.Layer = layer;
        this.productItem = productItem;
        this.ratio = ratio;
        this.margin = yMargin;
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
        console.log("[PRODUCT RENDERING] POS", currentGroupPos)
        let individualProductWidth = self.productItem.Orientation_Width * self.productItem.Facings_X;
        let individualProductHeight = self.productItem.Orientation_Height * self.productItem.Facings_Y;

        // self.x = (currentGroupPos.x + ((individualProductWidth - self.productItem.Orientation_Width) / 2));
        self.x = currentGroupPos.x;
        console.log("[PRODUCT RENDERING] CALCED", self.x)

        switch (self.fixture.Type.toUpperCase()) {
            case "SHELF": {
                if (self.margin != null && self.margin != undefined && self.margin > 0) {
                    self.y = (margin * self.ratio) * -1;
                } else {
                    self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
                }
            }
            break;
        case "BASE": {

        }
        break;
        case "BASKET": {

        }
        break;
        case "PEGBAR": {

        }
        break;
        }
    }

    BuildRendering() {
        let self = this;

        self.Group = new Konva.Group({
            x: self.x,
            y: self.y,
            width: self.width,
            height: self.height,
            draggable: false
        });

        self.fixture.Group.add(self.Group);
    }

    AddRendering() {
        let self = this;
        self.CalculatePosition();
        self.BuildRendering();
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

        self.Group.add(tmpRect);

        let image_rect = new Konva.Image({
            name: 'front-image-facing',
            listening: false
        })
        if (self.productItem.LastFace.toUpperCase() === "FRONT") {
            image_rect.rotation(0);
            image_rect.image(self.productItem.image_front);
            image_rect.setX(self.x + self.productItem.Orientation_Width / 2);
            image_rect.setY(self.y + self.productItem.Orientation_Height / 2);

            image_rect.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            image_rect.setWidth(self.productItem.image_orientation_width);
            image_rect.setHeight(self.productItem.image_orientation_height);

            image_rect.rotation(self.productItem.Rotation);
            self.Group.add(image_rect);

        } else if (self.productItem.LastFace.toUpperCase() === "LEFT") {
            image_rect.rotation(0);
            image_rect.image(self.productItem.image_side);
            image_rect.setX(self.x + self.productItem.Orientation_Width / 2);
            image_rect.setY(self.y + self.productItem.Orientation_Height / 2);

            image_rect.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            image_rect.setWidth(self.productItem.image_orientation_width);
            image_rect.setHeight(self.productItem.image_orientation_height);

            image_rect.rotation(self.productItem.Rotation);
            self.Group.add(image_rect);

        } else if (self.productItem.LastFace.toUpperCase() === "TOP") {
            image_rect.rotation(0);
            image_rect.image(self.productItem.image_top);
            image_rect.setX(self.x + self.productItem.Orientation_Width / 2);
            image_rect.setY(self.y + self.productItem.Orientation_Height / 2);

            image_rect.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            image_rect.setWidth(self.productItem.image_orientation_width);
            image_rect.setHeight(self.productItem.image_orientation_height);

            image_rect.rotation(self.productItem.Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);
        }
        image_rect.show();
        console.log("IMAGE", image_rect)
    }

    DestroyRendering() {
        self.Group.destroy();
        self.Layer.draw();
    }
}

export default ProductRenderingBase;