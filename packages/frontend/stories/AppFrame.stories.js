import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import AppFrame from '../src/components/AppFrame';

storiesOf('AppFrame', module)
  .addDecorator(muiTheme())
  .addDecorator(withKnobs)

  .add('default', () => {
    const appTitle = text('appTitle', 'Title of the app');
    const handlers = [
      'gotoCustomersView',
      'gotoOrdersView',
      'gotoAboutView'
    ].reduce((r, v) => ({ ...r, [v]: action(v) }), {});

    return (
      <AppFrame appTitle={appTitle} {...handlers}>
        <div>This is the page content</div>
      </AppFrame>
    );
  });
