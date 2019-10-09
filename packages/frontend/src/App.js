import React from 'react';
import { MuiThemeProvider, createMuiTheme, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RoutedPage from './components/RoutedPage';
import AppFrame from './components/connected/AppFrame';

const theme = createMuiTheme({
  palette: {
    type: 'light'
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2)
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppFrame appTitle="Fullstack Demo App">
          <Paper className={classes.container}>
            <RoutedPage />
          </Paper>
        </AppFrame>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
