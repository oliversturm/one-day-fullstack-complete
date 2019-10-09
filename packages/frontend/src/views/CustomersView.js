import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomerTable from '../components/CustomerTable';
import { useReadModel } from '../components/SystemContext';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Add as AddIcon } from '@material-ui/icons';
import uuid from 'uuid/v4';

const {
  customersViewDataLoaded
} = require('../reducers/customersView-reducer');

const { customerView, orderView } = require('../reducers/navigation-reducer');

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const CustomersView = () => {
  const dispatch = useDispatch();
  const dataLoaded = useCallback(
    data => {
      dispatch(customersViewDataLoaded(data));
    },
    [dispatch]
  );
  const onNewCustomer = useCallback(() => {
    dispatch(customerView(uuid()));
  }, [dispatch]);
  const rowEdit = useCallback(
    id => {
      dispatch(customerView(id));
    },
    [dispatch]
  );
  const onPlaceOrder = useCallback(
    (id, name) => {
      dispatch(orderView(id, name));
    },
    [dispatch]
  );

  const readModelSpec = useMemo(
    () => ({
      endpoint: 'customers',
      readModel: 'overview',
      resolver: 'all',
      params: {}
    }),
    []
  );
  useReadModel(readModelSpec, dataLoaded);

  const { data } = useSelector(({ customersView }) => customersView);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CustomerTable
        data={data}
        rowEdit={rowEdit}
        onPlaceOrder={onPlaceOrder}
      />
      <Fab
        color="primary"
        className={classes.fab}
        title="New Customer"
        onClick={onNewCustomer}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default React.memo(CustomersView);
