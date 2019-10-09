import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs } from '@storybook/addon-knobs';

import CustomerTable from '../src/components/CustomerTable';
import { action } from '@storybook/addon-actions';

storiesOf('CustomerTable', module)
  .addDecorator(muiTheme())
  .addDecorator(withKnobs)

  .add('With Data', () => {
    const rowEdit = action('rowEdit');
    const onPlaceOrder = action('onPlaceOrder');

    return (
      <CustomerTable
        data={[
          { id: 1, name: 'Jim' },
          { id: 2, name: 'Bert' },
          { id: 3, name: 'Julie' }
        ]}
        rowEdit={rowEdit}
        onPlaceOrder={onPlaceOrder}
      />
    );
  })
  .add('Without Data', () => {
    return <CustomerTable />;
  });
