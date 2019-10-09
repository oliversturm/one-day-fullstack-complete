import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs } from '@storybook/addon-knobs';

import OrderTable from '../src/components/OrderTable';
import { action } from '@storybook/addon-actions';

storiesOf('OrderTable', module)
  .addDecorator(muiTheme())
  .addDecorator(withKnobs)

  .add('With Data', () => {
    const rowEdit = action('rowEdit');

    return (
      <OrderTable
        data={[
          {
            id: 1,
            text: 'First order',
            value: 10.0,
            customerName: 'Bert',
            usdInfo: { content: 'irrelevant' }
          },
          {
            id: 2,
            text: 'Second order',
            value: 13.99,
            customerName: 'Jane',
            usdInfo: { content: 'irrelevant' }
          }
        ]}
        rowEdit={rowEdit}
      />
    );
  })
  .add('Without Data', () => {
    return <OrderTable />;
  });
