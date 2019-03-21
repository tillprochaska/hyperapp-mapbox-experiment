import { app, h } from 'hyperapp';
import { Mapbox } from './components/Mapbox.js';

const MAP_STYLE = '';
const CENTER_GERMANY = [10.502826979240012, 51.3031181328343];
const BOUNDS_PADDING = 0;
const BOUNDS_GERMANY = [
    5.98865807458 - BOUNDS_PADDING, // west
    47.3024876979 - BOUNDS_PADDING, // south
    15.0169958839 + BOUNDS_PADDING, // east
    54.983104153 + BOUNDS_PADDING,  // north
];

const state = {
    center: CENTER_GERMANY,
    zoom: 4,
    minZoom: 4,
    maxZoom: 15,
    maxBounds: BOUNDS_GERMANY,
};

const actions = {
    setZoom: value => ({ zoom: value }),
    setCenter: value => ({ center: value }),
};

const view = (state, actions) => (
    <Mapbox
        style={ MAP_STYLE }
        center={ state.center }
        zoom={ state.zoom }
        minZoom={ state.minZoom }
        maxZoom={ state.maxZoom }
        maxBounds={ state.maxBounds }
    />
);

app(state, actions, view, document.querySelector('#app'));