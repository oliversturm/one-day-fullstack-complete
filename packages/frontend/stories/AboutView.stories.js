import React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs } from '@storybook/addon-knobs';

import AboutView from '../src/views/AboutView';

storiesOf('AboutView', module)
  .addDecorator(muiTheme())
  .addDecorator(withKnobs)

  .add('default', () => {
    return <AboutView />;
  });
