import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs } from '@storybook/addon-knobs';
import { withFormik } from 'formik';

import OrderForm from '../src/components/OrderForm';
import { action } from '@storybook/addon-actions';

storiesOf('OrderForm', module)
  .addDecorator(muiTheme())
  .addDecorator(withKnobs)

  .add('default', () => {
    const onSubmitForm = action('onSubmitForm');
    const onCancel = action('onCancel');

    const FormikOrderForm = withFormik({
      mapPropsToValues: ({ data }) => data,
      handleSubmit: (...args) => {
        onSubmitForm(...args);
      }
    })(OrderForm);

    return <FormikOrderForm onCancel={onCancel} data={{}} />;
  });
