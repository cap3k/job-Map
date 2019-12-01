import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import * as d3 from 'd3';

const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';

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
  // const [elevationScale, setElevationScale] = useState(1);

  // const elevationScale = {min: 1, max: 50};

  function fetchData() {
    d3.csv(DATA_URL).then(function(dataRes) {
      const formattedData = dataRes.map(d => [Number(d.lng), Number(d.lat)]);
      setData(formattedData); // [{"Hello": "world"}, …]
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const mapStyle = 'mapbox://styles/mapbox/dark-v9';

  const layer = new HexagonLayer({
    id: 'heatmap',
    colorRange,
    coverage: 1,
    data,
    elevationRange: [0, 3000],
    elevationScale: data && data.length ? 50 : 0,
    extruded: true,
    getPosition: d => d,
    onHover: (info, event) => {},
    opacity: 1,
    pickable: true,
    radius: 1000,
    upperPercentile: 100,

    transitions: {
      elevationScale: 3000,
    },
  });

  return (
    <DeckGL layers={layer} initialViewState={INITIAL_VIEW_STATE} controller>
      <StaticMap
        mapStyle={mapStyle}
        reuseMaps
        preventStyleDiffing
        mapboxApiAccessToken={MAPBOX_TOKEN}
      />
    </DeckGL>
  );
};

export default App;
