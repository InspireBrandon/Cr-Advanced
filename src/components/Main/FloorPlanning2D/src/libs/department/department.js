import Konva from 'konva';
import ItemBase from '../ItemBase/ItemBase.js'

class Department extends ItemBase {
    constructor(base) {
        super(base);
        let self = this;

        self.group = null;
        self.department = null;
    }

    Initialise() {
        let self = this;
        self.Build();
    }

    Build() {
        let self = this;
        self.AddDepartment();
    }

    AddDepartment() {
        let self = this;

        self.group = new Konva.group({
            x: 5,
            y: 5,
            draggable: true
        })

        self.department = new Konva.Rect({
            x: 0,
            y: 0,
            name: "department",
            height: self.Height,
            width: self.Width,
            fill: 'black'
        })

        self.group.add(self.department);
        self.MasterGroup.add(self.Group);
        self.layer.draw();
    }
}

export default Department;