import React from 'react';

import { Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { Grid, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '500px',
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  button: {
    marginLeft: theme.spacing(2)
  },
  buttonDiv: {
    textAlign: 'right',
    width: '100%',
    paddingTop: theme.spacing(4)
  },
  field: {
    width: '100%'
  }
}));

const OrderForm = ({ onCancel }) => {
  const classes = useStyles();

  return (
    <Form className={classes.root}>
      <div style={{ padding: 6 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Field
              type="text"
              label="Text"
              name="text"
              className={classes.field}
              component={TextField}
              autoFocus
            />
          </Grid>
          <Grid item md={12}>
            <Field
              type="text"
              label="Value"
              name="value"
              className={classes.field}
              component={TextField}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.buttonDiv}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Grid>
      </div>
    </Form>
  );
};

export default React.memo(OrderForm);
