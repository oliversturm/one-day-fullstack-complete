import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs, text } from '@storybook/addon-knobs';
import { withFormik } from 'formik';

import CustomerForm from '../src/components/CustomerForm';
import { action } from '@storybook/addon-actions';

storiesOf('CustomerForm', module)
  .addDecorator(muiTheme())
  .addDecorator(withKnobs)

  .add('default', () => {
    const name = text('name', 'Johnny Butgood');
    const onSubmitForm = action('onSubmitForm');
    const onCancel = action('onCancel');

    const FormikCustomerForm = withFormik({
      mapPropsToValues: ({ data }) => data,
      handleSubmit: (...args) => {
        onSubmitForm(...args);
      }
    })(CustomerForm);

    return <FormikCustomerForm onCancel={onCancel} data={{ name }} />;
  });
