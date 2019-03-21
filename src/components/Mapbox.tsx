import { h } from 'hyperapp';
import mapboxgl from 'mapbox-gl';
import { ensureOptimalBoxPosition } from '../helpers/ensureBounds.ts';
import ni from '../../data/federal-states/ni.json';

const defaults = {
    width: '100%',
    height: '100%',
    zoom: null,
    center: null,
    minZoom: null,
    maxZoom: null,
    maxBounds: null,
};

export const Mapbox = props => {

    const options = {
        ...defaults,
        ...props,
    };

    const oncreate = element => {

        // Initialize a map instance inside of the wrapper div
        const map = new mapboxgl.Map({
            ...options,
            container: element,
        });

        // Convert bounds to a proper `LngLatBounds` object,
        // then reset the `maxBounds` property, as we’re handling
        // that ourselves.
        const maxBounds = map.getMaxBounds();
        map.setMaxBounds();

        if(maxBounds) {
            map.fitBounds(maxBounds, { linear: true });

            ['dragend', 'zoomend', 'resize'].forEach(event => {
                map.on(event, () => {
                    ensureOptimalBoxPosition(map, maxBounds);
                });
            });
        }

        // Save a reference to the map instance on the DOM node
        element.__map = map;

        map.on('load', () => {
            [ni].forEach(state => {
                map.addLayer({
                    'id': state.id,
                    'type': 'line',
                    'layout': {},
                    'paint': {
                        'line-color': 'rgba(0, 0, 0, .25)',
                        'line-width': 0.5,
                    },
                    'source': {
                        'type': 'geojson',
                        'data': state,
                    },
                });
            });
        });

    };

    // Enable delcaratively setting zoom level and
    // center positions
    const onupdate = element => {
        const { zoom, center } = options;
        element.__map.easeTo({ zoom, center });
    };

    // Clean up DOM nodes, event bindings etc. after
    // the map has been destroyed
    const ondestroy = element => {
        element.__map.remove();
    };

    return (
        <div
            class="mapbox"
            style={{
                width: options.width,
                height: options.height
            }}
            oncreate={ oncreate }
        />
    );

};