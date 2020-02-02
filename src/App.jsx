import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import SearchField from './components/SearchFields';

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

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then(res => res.json())
        .then(resdata => {
          setData(resdata);
        });
    }
    fetchData();
  }, [url]);

  const renderTooltip = () => {
    return (
      hoveredObject && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: pointerX,
            top: pointerY,
          }}
        >
          <Card variant="outlined">
            <CardContent>
              {hoveredObject.points.map((offre, index) => {
                return (
                  <>
                    <Typography variant="body2" component="p">
                      <Link href={offre.url}>
                        <li>{offre.intitule}</li>
                      </Link>
                    </Typography>
                  </>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )
    );
  };

  const mapStyle = 'mapbox://styles/mapbox/dark-v9';

  const layer = new HexagonLayer({
    id: 'heatmap',
    colorRange,
    coverage: 1,
    data,
    elevationRange: [0, 3000],
    elevationScale: data && data.length ? 50 : 0,
    extruded: true,
    getPosition: d => d.COORDINATES,
    onHover: (info, event) => {
      setHoveredObject(info.object);
      setPointerX(info.x);
      setPointerY(info.y);
    },
    opacity: 1,
    pickable: true,
    radius: 1000,
    upperPercentile: 100,

    transitions: {
      elevationScale: 3000,
    },
  });

  return (
    <>
      <DeckGL layers={layer} initialViewState={INITIAL_VIEW_STATE} controller>
        {renderTooltip}
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
    </>
  );
};

export default App;
