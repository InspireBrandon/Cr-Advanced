class GondolaPosition {
    constructor () {

    }

    PositionToBottom(stage, gondolaItem) {
        let stageHeight = stage.getHeight();
        let gondolaHeight = gondolaItem.TotalHeight;

        return stageHeight - gondolaHeight;
    }

    // PositionToX() {

    // }
}

export default GondolaPosition;