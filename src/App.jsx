import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import { PhongMaterial } from '@luma.gl/core';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import * as d3 from 'd3';

const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
});

const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
});

const INITIAL_VIEW_STATE = {
  longitude: -1.4157267858730052,
  latitude: 52.232395363869415,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023,
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const App = () => {
  const [data, setData] = useState();

  function fetchData() {
    d3.csv(DATA_URL, (error, response) => {
      if (!error) {
        const resData = response.map(d => [Number(d.lng), Number(d.lat)]);
        setData(resData);
      }
    });
  }

  useEffect(() => {
    fetchData();
  });

  const layer = new HexagonLayer({
    id: 'heatmap',
    colorRange,
    coverage: 1,
    data,
    elevationRange: [0, 3000],
    elevationScale: data && data.length ? 50 : 0,
    extruded: true,
    getPosition: d => d,
    onHover: ({ object, x, y }) => {
      const tooltip = `${object.centroid.join(', ')}\nCount: ${
        object.points.length
      }`;
    },
    opacity: 1,
    pickable: true,
    radius: 1000,
    upperPercentile: 100,
    material,

    transitions: {
      elevationScale: 3000,
    },
  });

  return (
    <DeckGL
      layers={layer}
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller
    >
      <StaticMap
        reuseMaps
        preventStyleDiffing
        mapboxApiAccessToken={MAPBOX_TOKEN}
      />
    </DeckGL>
  );
};

export default App;
