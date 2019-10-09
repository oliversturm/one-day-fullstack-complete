import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withFormik } from 'formik';

import CustomerForm from '../components/CustomerForm';
import { useReadModel, useCommands } from '../components/SystemContext';
import customerEditSchema from '../schemas/customerEditSchema';
import { CircularProgress, makeStyles, Typography } from '@material-ui/core';

const { customerViewDataLoaded } = require('../reducers/customerView-reducer');
const { customersView } = require('../reducers/navigation-reducer');

const FormikCustomerForm = withFormik({
  mapPropsToValues: ({ data }) => customerEditSchema.cast(data || {}),
  validationSchema: customerEditSchema,
  // This option is important if the data value passed from "outside"
  // can change after initial mount - otherwise Formik doesn't notice
  // that change.
  enableReinitialize: true,
  handleSubmit: (
    changedObject,
    {
      setSubmitting,
      props: { updateCustomer, createCustomer, data, customerId }
    }
  ) => {
    (data ? updateCustomer : createCustomer)(customerId, changedObject).then(
      () => {
        setSubmitting(false);
      }
    );
  }
})(CustomerForm);

const useStyles = makeStyles({
  progress: {
    margin: '20px auto',
    display: 'block'
  }
});

const CustomerView = () => {
  const dispatch = useDispatch();
  const dataLoaded = useCallback(
    data => {
      dispatch(customerViewDataLoaded(data));
    },
    [dispatch]
  );
  const onCancel = useCallback(() => {
    dispatch(customersView());
  }, [dispatch]);
  const { updateCustomer, createCustomer } = useCommands({
    chainHandler: onCancel
  });

  const { id: customerId } = useSelector(state => state.location.payload);
  const readModelSpec = useMemo(
    () => ({
      endpoint: 'customers',
      readModel: 'editing',
      resolver: 'byId',
      params: { id: customerId }
    }),
    [customerId]
  );
  useReadModel(readModelSpec, dataLoaded);

  const data = useSelector(({ customerView: { data } }) => data);
  const dataObject = (data && data.length && data[0]) || null;

  const classes = useStyles();

  return data ? (
    <>
      <Typography variant="h5">
        {`${dataObject ? 'Edit' : 'Create'} Customer`}
      </Typography>
      <FormikCustomerForm
        customerId={customerId}
        data={dataObject}
        onCancel={onCancel}
        updateCustomer={updateCustomer}
        createCustomer={createCustomer}
      />
    </>
  ) : (
    <CircularProgress className={classes.progress} />
  );
};

export default React.memo(CustomerView);
