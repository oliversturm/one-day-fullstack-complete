import React from 'react';
import { Card, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    marginTop: theme.spacing(3)
  }
}));

const AboutView = () => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          About This Demo
        </Typography>
        <Typography gutterBottom>
          This is the One Day Fullstack Demo Application
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.footer}
        >
          &copy; Oliver Sturm, License: MIT
        </Typography>
      </CardContent>
    </Card>
  );
};

export default React.memo(AboutView);
