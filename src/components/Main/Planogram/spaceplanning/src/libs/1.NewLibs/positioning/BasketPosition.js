import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
class BasketPosition {
    constructor () {

    }

    /**
     * Purpose is to determine the new position of the basket with other elements on the shelf
     * @param {*} VueStore - required
     * @param {*} currentBasket - required
     * @param {*} parentObject - Optional
     */
    PositionToParent(VueStore, currentBasket, parentObject = null) {
        let self = this;
        let ctrl_store = new StoreHelper();
        let parent = parentObject;

        // get the parent
        if (parent == null) {
            parent = ctrl_store.getPlanogramItemById(VueStore, currentBasket.ParentID);
        }

        if (parent == null) {
            console.error("[BASKET POSITIONING] Failed to find basket's parent");
            return;
        }

        // get all items within this parent
        let allParentItems = ctrl_store.getAllPlanogramItems(VueStore, currentBasket.ParentID);
        // sort them by x/y
        let sortedArr = allParentItems.sort((a, b) => a.Group.getX() - b.Group.getX());
        
        let x = 0;
        let y = (currentBasket.TotalHeight) * -1;
        console.log("[BASKET POSITONING]" , "NEW Y:", y, "PARENT", parent, "PARENT Y:",parent.Group.getY() , "Current Total H:", currentBasket.TotalHeight);
        sortedArr.forEach(item => {
            item.Group.setX(x);
            x += item.TotalWidth + 1;
        });
        currentBasket.Group.setY(y);
    }
}

export default BasketPosition;