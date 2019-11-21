class TreeItem {
    constructor(data) {
        let self = this;
        self.name = data.name;
        self.icon = data.icon;
        self.click = data.click;
        self.children = (data.children == undefined || data.children == null) ? [] : data.children;
        self.showChildren = false;
        self.showChildrenCount = false;
        self.loading = false;
        self.allowSelect = (data.allowSelect == undefined || data.allowSelect == null) ? false : data.allowSelect;        
        self.onSelect = (data.onSelect == undefined || data.onSelect == null) ? false : data.onSelect;    
        self.onSelectIncludesChildren = (data.onSelectIncludesChildren == undefined || data.onSelectIncludesChildren == null) ? false : data.onSelectIncludesChildren;
        self.selected = (data.selected == undefined || data.selected == null) ? false : data.selected;    
        self.showIcon = (data.showIcon == undefined || data.showIcon == null) ? true : data.showIcon;        
        self.showImage = (data.showImage == undefined || data.showImage == null) ? false : data.showImage;        
        self.imageSrc = (data.imageSrc == undefined || data.imageSrc == null) ? "" : data.imageSrc;        
        self.value = data.value;
    }
} 

export default TreeItem;