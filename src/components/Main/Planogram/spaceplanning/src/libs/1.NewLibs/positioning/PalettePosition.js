class PalettePosition {
    constructor () {

    }

    PositionToBottom(stage, paletteItem) {
        let stageHeight = stage.getHeight();
        let paletteHeight = paletteItem.TotalHeight;

        return stageHeight - paletteHeight;
    }

    // PositionToX() {

    // }
}

export default PalettePosition;