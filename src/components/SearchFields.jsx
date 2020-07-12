import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';

const AUTOCOMPLETE_URL = new URL(process.env.REACT_APP_AUTOCOMPLETE_URL);

const SearchField = ({ handleChange, url }) => {
  const [motsCles, setMotsCles] = useState();
  const [commune, setCommune] = useState();
  const [options, setOptions] = useState();

  useEffect(() => {
    const params = [];
    function fetchAutocomplete() {
      if (commune) {
        params.push(['commune', commune]);
        AUTOCOMPLETE_URL.search = new URLSearchParams(params).toString();
        fetch(AUTOCOMPLETE_URL)
          .then(res => res.json())
          .then(resdata => {
            setOptions(resdata);
          });
      }
    }
    fetchAutocomplete();
  }, [commune]);

  function fetchDataOnSubmit() {
    const params = [];
    if (motsCles) {
      params.push(['motsCles', motsCles]);
    }
    if (commune && commune.code) {
      params.push(['commune', commune.code]);
    }
    const newURL = new URL(url);
    newURL.search = new URLSearchParams(params).toString();
    handleChange(newURL);
  }

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
              label="Look for a job"
              margin="normal"
              onChange={e => setMotsCles(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Autocomplete
              id="combo-box-demo"
              options={options}
              getOptionLabel={option => option.libelle +' '+ option.codePostal}
              onChange={(event, value) => setCommune(value)}
              autoComplete
              autoSelect
              selectOnFocus
              includeInputInList
              disableOpenOnFocus
              filterOptions={x => x}
              renderInput={params => (
                <TextField
                  {...params}
                  style={{ width: 200 }}
                  label="Where?"
                  margin="normal"
                  fullWidth
                  onChange={e => setCommune(e.target.value)}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => fetchDataOnSubmit()}
            >
              <SearchIcon />
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SearchField;
