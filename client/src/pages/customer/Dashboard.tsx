// src/pages/customer/Dashboard.tsx
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  Button,
  Avatar,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getDashboardData } from '../../api/customerApi';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/Customer/LoadinSpinner';
import DashboardSidebar from '../../components/Customer/DashboardSidebar';

interface DashboardData {
  totalOrders: number;
  walletBalance: number;
  activeDeliveries: number;
  recentOrders: Array<{
    id: string;
    date: string;
    total: number;
    status: string;
  }>;
}

export const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        console.log('Dashboard Data:', response.data);
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Add handler to open sidebar (you can use this for mobile menu button)
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };


  if (loading) return (
    <>
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={handleCloseSidebar} 
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner />
      </Box>
    </>
  );
  if (error) return <Typography color="error">{error}</Typography>;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'shipped': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

 return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onClose={handleCloseSidebar} 
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 },
          ml: { xs: 0, md: '40px' }
        }}
      >
        {/* Add a mobile menu button if needed */}
        <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}>
          <Button onClick={handleOpenSidebar}>
            Open Menu
          </Button>
        </Box>

        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.success.main, 
              mr: 2,
              width: 48,
              height: 48
            }}>
              {/* <EcoIcon /> */}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary">
                Fresh Veggies Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your healthy lifestyle companion
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          },
          gap: 3,
          mb: 4
        }}>
          {/* Total Orders */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8]
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {dashboardData?.totalOrders || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Orders
                  </Typography>
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8]
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    ${dashboardData?.walletBalance?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Wallet Balance
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>

          {/* Active Deliveries */}
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8]
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {dashboardData?.activeDeliveries || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Active Deliveries
                  </Typography>
                </Box>
                <LocalShippingIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Quick Actions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<StorefrontIcon />}
                onClick={() => navigate('/customer/products')}
                sx={{
                  background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Browse Fresh Vegetables
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={() => navigate('/customer/orders')}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: theme.palette.success.main,
                  color: theme.palette.success.main,
                  '&:hover': {
                    borderColor: theme.palette.success.dark,
                    backgroundColor: theme.palette.success.light
                  }
                }}
              >
                View Order History
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Recent Orders
            </Typography>
            
            {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
              <Box>
                {dashboardData.recentOrders.map((order, index) => (
                  <Box key={order.id}>
                    <Box sx={{ 
                      py: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: theme.palette.success.light,
                          color: theme.palette.success.dark,
                          mr: 2,
                          width: 40,
                          height: 40
                        }}>
                          <ShoppingCartIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            Order #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="600" color="text.primary">
                          ${order.total.toFixed(2)}
                        </Typography>
                        <Chip 
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{ mt: 0.5, fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                    {index < dashboardData.recentOrders.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 6,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: 2
              }}>
                {/* <EcoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} /> */}
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No orders yet!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start your fresh vegetable journey today
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<StorefrontIcon />}
                  onClick={() => navigate('/customer/products')}
                  sx={{
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    py: 1,
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Shop Fresh Vegetables
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};