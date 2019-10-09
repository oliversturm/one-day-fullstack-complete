import React from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  CircularProgress,
  makeStyles,
  Button
} from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';

const useStyles = makeStyles({
  progress: {
    margin: '20px auto',
    display: 'block'
  }
});

const CustomerTable = ({ data, rowEdit, onPlaceOrder }) => {
  const classes = useStyles();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Id</TableCell>
          <TableCell>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data ? (
          data.map(row => (
            <TableRow key={row.id}>
              <TableCell>
                <Button variant="text" onClick={() => rowEdit(row.id)}>
                  <EditIcon />
                </Button>
                <Button
                  variant="text"
                  onClick={() => onPlaceOrder(row.id, row.name)}
                >
                  Place Order
                </Button>
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3}>
              <CircularProgress className={classes.progress} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default React.memo(CustomerTable);
