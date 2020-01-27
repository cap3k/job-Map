import React, { useState, useEffect } from 'react';
import { StaticMap } from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
  const [data, setData] = useState();
  const [hoveredObject, setHoveredObject] = useState();
  const [pointerX, setPointerX] = useState();
  const [pointerY, setPointerY] = useState();
  const [motsCles, setMotsCles] = useState();
  const [commune, setCommune] = useState();

  function fetchData() {
    fetch(DATA_URL)
      .then(res => res.json())
      .then(resdata => {
        setData(resdata);
      });
  }

  function fetchDataOnSubmit() {
    const params = [];
    if (motsCles) {
      params.push(['motsCles', motsCles]);
    }
    if (commune) {
      params.push(['commune', commune]);
    }
    DATA_URL.search = new URLSearchParams(params).toString();
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  const searchField = () => {
    return (
      <Paper
        style={{
          position: 'absolute',
          zIndex: 1,
          pointerEvents: 'auto',
          marginLeft: '25%',
          width: '50%',
          top: '5%',
        }}
      >
        <form noValidate autoComplete="off">
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <TextField
                label="Recherchez un emploi"
                margin="normal"
                onChange={e => setMotsCles(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Où?"
                margin="normal"
                onChange={e => setCommune(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => fetchDataOnSubmit()}
              >
                Primary
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  };

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
        {searchField}
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
