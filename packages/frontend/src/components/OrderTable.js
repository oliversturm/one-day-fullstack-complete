import React from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  CircularProgress,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles({
  progress: {
    margin: '20px auto',
    display: 'block'
  }
});

const CustomerTable = ({ data }) => {
  const classes = useStyles();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Text</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>USD Info</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data ? (
          data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.text}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.customerName}</TableCell>
              <TableCell>{JSON.stringify(row.usdInfo)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <CircularProgress className={classes.progress} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default React.memo(CustomerTable);
