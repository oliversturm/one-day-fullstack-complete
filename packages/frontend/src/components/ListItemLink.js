import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

const ListItemLink = ({ icon, primary, to, onClick }) => (
  <ListItem button onClick={onClick}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={primary} />
  </ListItem>
);

export default React.memo(ListItemLink);
