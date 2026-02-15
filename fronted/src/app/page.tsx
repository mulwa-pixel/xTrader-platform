'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { TrendingUp, Psychology, ShowChart } from '@mui/icons-material';

export default function TradingDashboard() {
  const [selectedMarket, setSelectedMarket] = useState('R_100');
  const [stakeAmount, setStakeAmount] = useState(1.00);
  const [balance, setBalance] = useState(10000);
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch AI signal
  const getSignal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/signals/${selectedMarket}`);
      const data = await response.json();
      setSignal(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Could not fetch signal. Check if backend is running.');
    }
    setLoading(false);
  };

  // Place trade
  const placeTrade = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedMarket,
          stake: stakeAmount,
          type: 'DIGIT_OVER'
        })
      });
      const data = await response.json();
      
      // Update balance
      setBalance(prev => prev + data.profit);
      
      alert(`${data.result}! Profit/Loss: $${data.profit.toFixed(2)}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Could not place trade. Check backend connection.');
    }
  };

  const markets = [
    { value: 'R_10', label: 'Volatility 10' },
    { value: 'R_25', label: 'Volatility 25' },
    { value: 'R_50', label: 'Volatility 50' },
    { value: 'R_75', label: 'Volatility 75' },
    { value: 'R_100', label: 'Volatility 100' },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f0f1e', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
          <ShowChart sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          xTrader Platform
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#888' }}>
          AI-Powered Trading Platform
        </Typography>
        <Card sx={{ bgcolor: '#1a1a2e', mt: 2, maxWidth: 300, mx: 'auto' }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: '#888' }}>Demo Balance</Typography>
            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              ${balance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3} maxWidth="lg" mx="auto">
        {/* Trading Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a2e', color: '#fff' }}>
            <Typography variant="h5" gutterBottom>
              Place Trade
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#888' }}>Market</InputLabel>
              <Select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
              >
                {markets.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Stake Amount ($)"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              inputProps={{ min: 0.35, step: 0.01 }}
              sx={{ mb: 2, input: { color: '#fff' } }}
            />

            <Typography variant="body2" color="#888" mb={2}>
              Potential Payout: ${(stakeAmount * 1.95).toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={placeTrade}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' }, mb: 1 }}
            >
              Place Trade
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={getSignal}
              disabled={loading}
              startIcon={<Psychology />}
              sx={{ borderColor: '#444', color: '#fff' }}
            >
              {loading ? 'Getting Signal...' : 'Get AI Signal'}
            </Button>
          </Paper>
        </Grid>

        {/* AI Signal Panel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a2e', color: '#fff', minHeight: 400 }}>
            <Typography variant="h5" gutterBottom>
              <Psychology sx={{ verticalAlign: 'middle', mr: 1 }} />
              AI Signal
            </Typography>

            {signal ? (
              <Box>
                <Chip 
                  label={`${(signal.confidence * 100).toFixed(0)}% Confidence`}
                  color="primary"
                  sx={{ mb: 2 }}
                />
                <Typography variant="h3" color="#4caf50" gutterBottom>
                  {signal.prediction}
                </Typography>
                <Typography variant="body1" color="#888" gutterBottom>
                  Recommendation: {signal.recommendation}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                  Analysis Factors:
                </Typography>
                {signal.factors.map((factor, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {factor.name}: {typeof factor.value === 'number' ? factor.value.toFixed(1) : factor.value}
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: 6, 
                      bgcolor: '#0f0f1e',
                      borderRadius: 1,
                      mt: 0.5
                    }}>
                      <Box sx={{ 
                        width: `${factor.weight * 100}%`,
                        height: '100%',
                        bgcolor: '#4caf50',
                        borderRadius: 1
                      }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300
              }}>
                <Psychology sx={{ fontSize: 80, color: '#444', mb: 2 }} />
                <Typography variant="h6" color="#888">
                  Click "Get AI Signal" to start
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Performance Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a2e', color: '#fff' }}>
            <Typography variant="h5" gutterBottom>
              Today's Performance
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#888">Trades</Typography>
                <Typography variant="h5">24</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#888">Win Rate</Typography>
                <Typography variant="h5" color="#4caf50">62.5%</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#888">Profit</Typography>
                <Typography variant="h5" color="#4caf50">+$247</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="#888">Best Trade</Typography>
                <Typography variant="h5">+$45</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center', color: '#666' }}>
        <Typography variant="caption">
          ⚠️ Demo Account - For Learning Only | Trading involves risk
        </Typography>
      </Box>
    </Box>
  );
}
