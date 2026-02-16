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
  Chip,
  Avatar,
  Tab,
  Tabs,
  LinearProgress,
  IconButton,
  Badge,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  ShowChart,
  People,
  Store,
  Leaderboard,
  Notifications,
  Settings,
  LocalFireDepartment,
  EmojiEvents,
  Star,
  VerifiedUser
} from '@mui/icons-material';

export default function EnhancedDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState('R_100');
  const [stakeAmount, setStakeAmount] = useState(1.00);
  const [balance, setBalance] = useState(10000);
  const [signal, setSignal] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topTraders, setTopTraders] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch enhanced signal
  const getAdvancedSignal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v2/signals/${selectedMarket}/advanced`);
      const data = await response.json();
      setSignal(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Fetch live price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/markets/live`);
        const data = await response.json();
        setLivePrice(data.prices[selectedMarket]);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 2000);
    return () => clearInterval(interval);
  }, [selectedMarket]);

  // Fetch top traders
  useEffect(() => {
    const fetchTopTraders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/copy-trading/traders`);
        const data = await response.json();
        setTopTraders(data.traders);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchTopTraders();
  }, []);

  // Fetch marketplace strategies
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/marketplace/strategies`);
        const data = await response.json();
        setStrategies(data.strategies);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchStrategies();
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/community/leaderboard`);
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  const markets = [
    { value: 'R_10', label: 'Volatility 10', color: '#00ff88' },
    { value: 'R_25', label: 'Volatility 25', color: '#00d4ff' },
    { value: 'R_50', label: 'Volatility 50', color: '#ff00ff' },
    { value: 'R_75', label: 'Volatility 75', color: '#ffaa00' },
    { value: 'R_100', label: 'Volatility 100', color: '#ff0055' },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0e27', minHeight: '100vh' }}>
      {/* Premium Header */}
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShowChart sx={{ fontSize: 30, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  xTrader Pro
                </Typography>
                <Typography variant="caption" sx={{ color: '#ddd' }}>
                  AI-Powered Trading Platform
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ py: 1, px: 2 }}>
                  <Typography variant="caption" sx={{ color: '#ddd' }}>Balance</Typography>
                  <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                    ${balance.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
              <IconButton sx={{ color: '#fff' }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton sx={{ color: '#fff' }}>
                <Settings />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Tabs 
          value={selectedTab} 
          onChange={(e, v) => setSelectedTab(v)}
          sx={{ mt: 2 }}
          textColor="inherit"
          TabIndicatorProps={{ style: { background: '#00ff88' } }}
        >
          <Tab label="Trading" sx={{ color: '#fff' }} />
          <Tab label="Copy Trading" sx={{ color: '#fff' }} icon={<People />} iconPosition="start" />
          <Tab label="Marketplace" sx={{ color: '#fff' }} icon={<Store />} iconPosition="start" />
          <Tab label="Leaderboard" sx={{ color: '#fff' }} icon={<EmojiEvents />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
        {/* TAB 0: TRADING */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {/* Live Price Ticker */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#1a1f3a', display: 'flex', gap: 3, overflow: 'auto' }}>
                {markets.map(m => (
                  <Box key={m.value} sx={{ minWidth: 150 }}>
                    <Typography variant="caption" color="#888">{m.label}</Typography>
                    <Typography variant="h6" sx={{ color: m.color, fontWeight: 'bold' }}>
                      {livePrice || '10,000.00'}
                    </Typography>
                    <Chip 
                      label={Math.random() > 0.5 ? '+0.5%' : '-0.3%'} 
                      size="small"
                      color={Math.random() > 0.5 ? 'success' : 'error'}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Trading Panel */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalFireDepartment sx={{ color: '#ff6b00' }} />
                  Quick Trade
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#888' }}>Market</InputLabel>
                  <Select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    sx={{ 
                      color: '#fff',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' }
                    }}
                  >
                    {markets.map(m => (
                      <MenuItem key={m.value} value={m.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.color }} />
                          {m.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Stake Amount ($)"
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#888' } }}
                />

                <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 255, 136, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="#00ff88">
                    💰 Potential Payout: ${(stakeAmount * 1.95).toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="#888">
                    Risk/Reward: 1:0.95
                  </Typography>
                </Box>

                <Grid container spacing={1} mb={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        bgcolor: '#00ff88',
                        color: '#000',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#00dd77' }
                      }}
                    >
                      CALL ↗
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        bgcolor: '#ff0055',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#dd0044' }
                      }}
                    >
                      PUT ↘
                    </Button>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Psychology />}
                  onClick={getAdvancedSignal}
                  disabled={loading}
                  sx={{ borderColor: '#667eea', color: '#667eea' }}
                >
                  {loading ? 'Analyzing...' : 'Get AI Signal'}
                </Button>
              </Paper>
            </Grid>

            {/* Advanced AI Signal */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3, minHeight: 450 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology sx={{ color: '#667eea' }} />
                  AI Analysis
                </Typography>

                {signal ? (
                  <Box>
                    {/* Ensemble Prediction */}
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <Chip 
                        label={`${(signal.ensemble.confidence * 100).toFixed(0)}% Confidence`}
                        sx={{ 
                          bgcolor: 'rgba(102, 126, 234, 0.2)',
                          color: '#667eea',
                          fontWeight: 'bold',
                          mb: 2
                        }}
                      />
                      <Typography variant="h2" sx={{ 
                        color: signal.ensemble.prediction === 'CALL' ? '#00ff88' : '#ff0055',
                        fontWeight: 'bold',
                        mb: 1
                      }}>
                        {signal.ensemble.prediction}
                      </Typography>
                      <Chip 
                        label={signal.ensemble.strength}
                        color={signal.ensemble.strength === 'STRONG' ? 'success' : 'warning'}
                      />
                    </Box>

                    {/* ML Models */}
                    <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                      AI Models Consensus:
                    </Typography>
                    {Object.entries(signal.models).map(([name, model]) => (
                      <Box key={name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="#fff">
                            {name.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: model.prediction === 'CALL' ? '#00ff88' : '#ff0055'
                          }}>
                            {model.prediction} ({(model.confidence * 100).toFixed(0)}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={model.confidence * 100}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: model.prediction === 'CALL' ? '#00ff88' : '#ff0055'
                            }
                          }}
                        />
                      </Box>
                    ))}

                    {/* Technical Analysis */}
                    <Divider sx={{ my: 2, bgcolor: '#333' }} />
                    <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                      Technical Indicators:
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="#888">RSI</Typography>
                        <Typography variant="body2" color="#fff">{signal.technical_analysis.rsi}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="#888">MACD</Typography>
                        <Typography variant="body2" color={signal.technical_analysis.macd === 'bullish' ? '#00ff88' : '#ff0055'}>
                          {signal.technical_analysis.macd}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 350
                  }}>
                    <Psychology sx={{ fontSize: 80, color: '#444', mb: 2 }} />
                    <Typography variant="h6" color="#888">
                      Click "Get AI Signal" to analyze
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: COPY TRADING */}
        {selectedTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>
                Top Traders to Copy
              </Typography>
            </Grid>
            {topTraders.map(trader => (
              <Grid item xs={12} md={6} key={trader.id}>
                <Card sx={{ bgcolor: '#1a1f3a', borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={trader.avatar} sx={{ width: 60, height: 60 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" color="#fff">{trader.username}</Typography>
                          {trader.verified && <VerifiedUser sx={{ fontSize: 20, color: '#00ff88' }} />}
                          {trader.premium && <Star sx={{ fontSize: 20, color: '#ffaa00' }} />}
                        </Box>
                        <Typography variant="caption" color="#888">
                          {trader.followers.toLocaleString()} followers
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: '#667eea' }}
                      >
                        Follow
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="#888">30-Day Profit</Typography>
                        <Typography variant="h6" color="#00ff88">
                          +${trader.profit_30d.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="#888">Win Rate</Typography>
                        <Typography variant="h6" color="#fff">
                          {(trader.win_rate * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="#888">ROI</Typography>
                        <Typography variant="h6" color="#00ff88">
                          +{trader.roi}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="#888">Risk Score</Typography>
                        <Chip 
                          label={trader.risk_score + '/10'}
                          size="small"
                          color={trader.risk_score < 5 ? 'success' : trader.risk_score < 7 ? 'warning' : 'error'}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* TAB 2: MARKETPLACE */}
        {selectedTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>
                Strategy Marketplace
              </Typography>
            </Grid>
            {strategies.map(strategy => (
              <Grid item xs={12} md={4} key={strategy.id}>
                <Card sx={{ 
                  bgcolor: '#1a1f3a',
                  borderRadius: 3,
                  border: strategy.verified ? '2px solid #00ff88' : 'none'
                }}>
                  <CardContent>
                    {strategy.verified && (
                      <Chip 
                        label="VERIFIED"
                        size="small"
                        icon={<VerifiedUser />}
                        sx={{ bgcolor: '#00ff88', color: '#000', mb: 2 }}
                      />
                    )}
                    <Typography variant="h6" color="#fff" gutterBottom>
                      {strategy.name}
                    </Typography>
                    <Typography variant="body2" color="#888" paragraph>
                      by {strategy.creator}
                    </Typography>
                    <Typography variant="body2" color="#ddd" paragraph>
                      {strategy.description}
                    </Typography>

                    <Grid container spacing={1} mb={2}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="#888">Win Rate</Typography>
                        <Typography variant="body1" color="#00ff88">
                          {(strategy.win_rate * 100).toFixed(0)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="#888">Profit</Typography>
                        <Typography variant="body1" color="#00ff88">
                          ${strategy.profit}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="#888">Rating</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ fontSize: 16, color: '#ffaa00' }} />
                          <Typography variant="body1" color="#fff">
                            {strategy.rating}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" color="#667eea" fontWeight="bold">
                        ${strategy.price}
                      </Typography>
                      <Button 
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: '#667eea' }}
                      >
                        Buy Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* TAB 3: LEADERBOARD */}
        {selectedTab === 3 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>
              Community Leaderboard
            </Typography>
            <Paper sx={{ bgcolor: '#1a1f3a', borderRadius: 3, overflow: 'hidden' }}>
              {leaderboard.map((user, idx) => (
                <Box 
                  key={user.rank}
                  sx={{ 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    borderBottom: idx < leaderboard.length - 1 ? '1px solid #333' : 'none',
                    bgcolor: idx < 3 ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                  }}
                >
                  <Box sx={{ 
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: idx === 0 ? '#ffaa00' : idx === 1 ? '#aaa' : idx === 2 ? '#cd7f32' : '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" fontWeight="bold" color="#fff">
                      {user.rank}
                    </Typography>
                  </Box>
                  <Avatar sx={{ width: 50, height: 50 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" color="#fff">{user.username}</Typography>
                    <Typography variant="caption" color="#888">
                      {user.trades} trades • {(user.win_rate * 100).toFixed(1)}% win rate
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="#00ff88" fontWeight="bold">
                    +${user.profit.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
