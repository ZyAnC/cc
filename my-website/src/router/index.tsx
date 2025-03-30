import { createBrowserRouter } from 'react-router-dom';
import ProductManagement from '../components/ProductManagement';
import ProductDetail from '../components/ProductDetail';
import GarmentDetail from '../components/GarmentDetail';
import Employee from '../components/Employee';
import Layout from '../components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProductManagement />,
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
      },
      {
        path: 'new-order',
        element: <GarmentDetail />,
      },
      {
        path: 'employee',
        element: <Employee />,
      },
      {
        path: 'employee/:type',
        element: <Employee />,
      },
      {
        path: 'locations',
        element: <ProductManagement />,
      },
      {
        path: 'visits',
        element: <ProductManagement />,
      },
      {
        path: 'optimisation',
        element: <ProductManagement />,
      },
      {
        path: 'collection',
        element: <ProductManagement />,
      },
      {
        path: 'sustainability',
        element: <ProductManagement />,
      },
    ],
  },
]);

export default router; 