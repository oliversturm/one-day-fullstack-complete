import React from 'react';
import { useSelector } from 'react-redux';
import CustomersView from '../views/CustomersView';
import OrdersView from '../views/OrdersView';
import CustomerView from '../views/CustomerView';
import OrderView from '../views/OrderView';
import AboutView from '../views/AboutView';

const RoutedPage = () => {
  const currentView = useSelector(state => state.navigation.currentView);

  return (
    <>
      {{
        customers: () => <CustomersView />,
        orders: () => <OrdersView />,
        customer: () => <CustomerView />,
        order: () => <OrderView />,
        about: () => <AboutView />
      }[currentView]()}
    </>
  );
};

export default React.memo(RoutedPage);
