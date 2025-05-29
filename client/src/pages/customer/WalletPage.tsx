// src/pages/customer/WalletPage.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { getWalletDetails, getWalletTransactions } from '../../api/customerApi';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

export const WalletPage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [balanceRes, transactionsRes] = await Promise.all([
          getWalletDetails(),
          getWalletTransactions()
        ]);
        setBalance(balanceRes.data.balance);
        setTransactions(transactionsRes.data);
      } catch (err) {
        setError('Failed to fetch wallet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Wallet
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Wallet Balance</Typography>
                <AccountBalanceWalletIcon color="primary" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                ${balance.toFixed(2)}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Money
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Quick Actions</Typography>
                <PaymentIcon color="primary" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ height: '100%', py: 2 }}
                  >
                    Send Money
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ height: '100%', py: 2 }}
                  >
                    Pay Bills
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ height: '100%', py: 2 }}
                  >
                    Request Money
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ height: '100%', py: 2 }}
                  >
                    View Cards
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Transactions</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {transactions.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No transactions yet
                </Typography>
              ) : (
                <List>
                  {transactions.map((transaction) => (
                    <ListItem key={transaction.id} divider>
                      <ListItemIcon>
                        {transaction.type === 'credit' ? (
                          <PaymentIcon color="success" />
                        ) : (
                          <PaymentIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.description}
                        secondary={transaction.date}
                      />
                      <Typography
                        color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                        variant="body1"
                      >
                        {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};