// src/pages/customer/OrdersPage.tsx
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Avatar } from '@mui/material';
import { getCustomerOrders } from '../../api/customerApi';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrders();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon color="success" />;
      case 'cancelled':
        return <CancelIcon color="error" />;
      case 'shipped':
        return <LocalShippingIcon color="info" />;
      default:
        return <HourglassEmptyIcon color="warning" />;
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <LocalShippingIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              You haven't placed any orders yet
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              Start shopping to see your orders here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {order.items.slice(0, 2).map((item) => (
                        <Box key={item.productId} sx={{ mr: 1 }}>
                          <Avatar
                            src={item.image}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        </Box>
                      ))}
                      {order.items.length > 2 && (
                        <Chip label={`+${order.items.length - 2}`} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getStatusIcon(order.status)}
                      <Typography sx={{ ml: 1 }}>{order.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};