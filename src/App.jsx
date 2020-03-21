import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchField from './components/SearchFields';
import Tooltip from './components/Tooltip';

const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;
const DATA_URL = new URL(process.env.REACT_APP_DATA_URL);

const INITIAL_VIEW_STATE = {
  longitude: 2.7,
  latitude: 46.2276,
  zoom: 5.5,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -20.396674584323023,
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
  const [hoveredObject, setHoveredObject] = useState();
  const [pointerX, setPointerX] = useState();
  const [pointerY, setPointerY] = useState();
  const [data, setData] = useState();
  const [url, setURL] = useState(DATA_URL);
  const [loading, setLoading] = useState(DATA_URL);

  useEffect(() => {
    function fetchData() {
      setLoading(true);
      fetch(url)
        .then(res => res.json())
        .then(resdata => {
          setLoading(false);
          setData(resdata);
        });
    }
    fetchData();
  }, [url]);

  const mapStyle = 'mapbox://styles/mapbox/light-v10';

  const layer = new HexagonLayer({
    id: 'heatmap',
    colorRange,
    coverage: 1,
    data,
    elevationRange: [0, 3000],
    elevationScale: data && data.length ? 50 : 0,
    extruded: true,
    getPosition: d => d.COORDINATES,
    onClick: (info, event) => {
      setHoveredObject(info.object);
      setPointerX(info.x);
      setPointerY(info.y);
    },
    opacity: 1,
    pickable: true,
    radius: 1000,
    upperPercentile: 100,
    autoHighlight: true,
    transitions: {
      elevationScale: 3000,
    },
  });

  return (
    <>
      {hoveredObject && (
        <Tooltip
          hoveredObject={hoveredObject}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      )}
      {loading && (
        <CircularProgress
          size={40}
          style={{
            position: 'absolute',
            zIndex: 1,
            left: '50%',
            top: '40%',
          }}
        />
      )}
      <div onClick={() => setHoveredObject(null)}>
        <DeckGL layers={layer} initialViewState={INITIAL_VIEW_STATE} controller>
          <SearchField
            handleChange={updatedUrl => setURL(updatedUrl)}
            url={url}
          />

          <StaticMap
            mapStyle={mapStyle}
            reuseMaps
            preventStyleDiffing
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    </>
  );
};

export default App;
