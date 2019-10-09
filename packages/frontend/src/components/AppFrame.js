import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  makeStyles
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  ShoppingCart as OrderIcon,
  Info as AboutIcon
} from '@material-ui/icons';
import ListItemLink from './ListItemLink';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  drawerList: {
    width: '250px'
  },
  drawerTitle: {
    margin: theme.spacing(2)
  }
}));

const AppFrame = ({
  children,
  appTitle,
  gotoCustomersView,
  gotoOrdersView,
  gotoAboutView
}) => {
  const [showingDrawer, setShowingDrawer] = useState(false);
  const showDrawer = () => setShowingDrawer(true);
  const hideDrawer = () => setShowingDrawer(false);

  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={showDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {appTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={showingDrawer} onClose={hideDrawer}>
        <Typography variant="h6" className={classes.drawerTitle}>
          {appTitle}
        </Typography>

        <List
          component="nav"
          className={classes.drawerList}
          onClick={hideDrawer}
        >
          <ListItemLink
            onClick={gotoCustomersView}
            primary="Customers"
            icon={<PeopleIcon />}
          />
          <ListItemLink
            onClick={gotoOrdersView}
            primary="Orders"
            icon={<OrderIcon />}
          />
          <ListItemLink
            onClick={gotoAboutView}
            primary="About"
            icon={<AboutIcon />}
          />
        </List>
      </Drawer>

      {children}
    </>
  );
};

export default React.memo(AppFrame);
