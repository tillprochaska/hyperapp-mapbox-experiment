export const ensureOptimalBoxPosition = (map, boxBounds) => {
    const mapBounds = map.getBounds();
    const se = map.project(mapBounds.getSouthEast()).round();
    const nw = map.project(mapBounds.getNorthWest()).round();

    const boxSe = map.project(boxBounds.getSouthEast()).round();
    const boxNw = map.project(boxBounds.getNorthWest()).round();

    const mapDimensions = se.sub(nw);
    const boxDimensions = boxSe.sub(boxNw);

    const reposition = (mapSize, boxSize, start, end) => {
        /*
         * If the box can be contained inside of the map
         * it’s centered so that the space to the map’s
         * boarders is qually large.
         *
         *    Before:                After:
         * +-----------+         +-----------+  
         * |  +-----+  |—— map ——|           |
         * |  | box |  |         |  +-----+  |
         * |  +-----+  |         |  | box |  |
         * |           |         |  +-----+  |
         * |           |         |           |
         * +-----------+         +-----------+
         */
        if(boxSize <= mapSize) {
            return start - 1/2 * (mapSize - boxSize);
        }

        /* 
         * If the box ends outside, but starts inside of the
         * map (i. e. it doesn’t use all the available space),
         * then the box is repositioned as little as possible
         * to make it end inside of the map.
         * 
         *    Before:                After:
         * +-----------+         +-----------+
         * |           |—— map ——|           |
         * |           |         |  +-----+  |
         * |           |         |  |     |  |
         * |  +-----+  |         |  | box |  |
         * +--|-----|--+         +--+-----+--+
         *    | box |
         *    +-----+
         */
        const endsOutsideOfMap = start > 0 && (end - mapSize) > 0;
        if(endsOutsideOfMap) {
            return Math.min(start, end - mapSize);
        }

        /*
         * If the box starts outside, but ends inside of the
         * map (i. e. it doesn’t use all the available space),
         * then the box is repositioned as little as possible
         * to make ti start inside of the map.
         *
         *    Before:                After:
         *    +-----+
         *    | box |
         * +--|-----|--+         +--+-----+--+
         * |  +-----+  |—— map ——|  | box |  |
         * |           |         |  |     |  |
         * |           |         |  +-----+  |
         * |           |         |           |
         * +-----------+         +-----------+
         */
        const startsOutSideOfMap = start < 0 && (end - mapSize) < 0;
        if(startsOutSideOfMap) {
            return Math.max(start, end - mapSize);
        }

        return 0;
    };

    map.panBy([
        reposition(mapDimensions.x, boxDimensions.x, boxNw.x, boxSe.x),
        reposition(mapDimensions.y, boxDimensions.y, boxNw.y, boxSe.y),
    ]);

};
