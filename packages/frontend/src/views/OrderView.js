import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withFormik } from 'formik';

import OrderForm from '../components/OrderForm';
import { useCommands, useReadModel } from '../components/SystemContext';
import orderEditSchema from '../schemas/orderEditSchema';
import { Typography } from '@material-ui/core';

const { customersView } = require('../reducers/navigation-reducer');

const FormikOrderForm = withFormik({
  mapPropsToValues: ({ data }) => orderEditSchema.cast(data || {}),
  validationSchema: orderEditSchema,
  handleSubmit: (
    changedObject,
    { setSubmitting, props: { createOrder, orderId } }
  ) => {
    createOrder(orderId, changedObject).then(() => {
      setSubmitting(false);
    });
  }
})(OrderForm);

const OrderView = () => {
  const dispatch = useDispatch();
  const onCancel = useCallback(() => {
    dispatch(customersView());
  }, [dispatch]);
  const { createOrder } = useCommands({
    chainHandler: onCancel
  });

  const [customerData, setCustomerData] = useState();
  const dataLoaded = useCallback(
    data => {
      const customer = data && data.length && data[0];
      setCustomerData(customer);
    },
    [setCustomerData]
  );

  const { id: orderId, customerId } = useSelector(
    state => state.location.payload
  );

  const readModelSpec = useMemo(
    () => ({
      endpoint: 'orders',
      readModel: 'overview',
      resolver: 'customerById',
      params: { id: customerId }
    }),
    [customerId]
  );
  useReadModel(readModelSpec, dataLoaded);

  return (
    <>
      <Typography variant="h5">
        Create Order {customerData && `for ${customerData.name}`}
      </Typography>
      <FormikOrderForm
        orderId={orderId}
        data={{ customerId }}
        onCancel={onCancel}
        createOrder={createOrder}
      />
    </>
  );
};

export default React.memo(OrderView);
