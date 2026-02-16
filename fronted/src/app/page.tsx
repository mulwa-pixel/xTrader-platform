'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Chip, Tab, Tabs, LinearProgress, IconButton, Badge, Alert, Snackbar, Table, TableBody, TableRow, TableCell, TableHead, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { TrendingUp, Psychology, ShowChart, Notifications, LocalFireDepartment, TrendingDown, BarChart, GridOn, AutoAwesome, PlayArrow, Warning, Stop, ViewModule, ViewQuilt, ViewDay, People, Store, EmojiEvents, Whatshot, AcUnit } from '@mui/icons-material';

export default function RostovaDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState('R_100');
  const [stakeAmount, setStakeAmount] = useState(1.00);
  const [balance, setBalance] = useState(10000);
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [digitAnalytics, setDigitAnalytics] = useState(null);
  const [activeContracts, setActiveContracts] = useState([]);
  const [bots, setBots] = useState([]);
  const [showBotDialog, setShowBotDialog] = useState(false);
  const [capitalProtector, setCapitalProtector] = useState({ active: false });
  const [riskMeter, setRiskMeter] = useState({ percentage: 0 });
  const [chartLayout, setChartLayout] = useState('1');
  const [subscribedSymbols, setSubscribedSymbols] = useState(['R_100']);
  const [topTraders, setTopTraders] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const markets = [
    { value: 'R_10', label: 'Volatility 10', color: '#00ff88' },
    { value: 'R_25', label: 'Volatility 25', color: '#00d4ff' },
    { value: 'R_50', label: 'Volatility 50', color: '#ff00ff' },
    { value: 'R_75', label: 'Volatility 75', color: '#ffaa00' },
    { value: 'R_100', label: 'Volatility 100', color: '#ff0055' },
    { value: 'BOOM500', label: 'Boom 500', color: '#ff6b00' },
    { value: 'CRASH500', label: 'Crash 500', color: '#9c27b0' }
  ];
  
  const authenticateDeriv = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/auth/deriv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: apiToken, user_id: 'rostova_user' })
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        showNotification('🚀 Connected to ROSTOVA!', 'success');
        fetchAccountInfo();
        subscribeMultiCharts();
      } else {
        showNotification('❌ Authentication failed', 'error');
      }
    } catch (error) {
      showNotification('Connection error', 'error');
    }
  };
  
  const fetchAccountInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/account/rostova_user`);
      const data = await response.json();
      if (data.balance !== undefined) setBalance(data.balance);
    } catch (error) {
      console.error('Error');
    }
  };
  
  const subscribeMultiCharts = async () => {
    try {
      await fetch(`${API_URL}/api/v3/charts/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'rostova_user', symbols: subscribedSymbols })
      });
    } catch (error) {
      console.error('Subscribe error');
    }
  };
  
  const fetchDigitAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/analytics/${selectedMarket}/digits`);
      const data = await response.json();
      setDigitAnalytics(data);
    } catch (error) {
      console.error('Analytics error');
    }
  };
  
  const fetchActiveContracts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/trade/active/rostova_user`);
      const data = await response.json();
      setActiveContracts(data.contracts || []);
    } catch (error) {
      console.error('Contracts error');
    }
  };
  
  const getSmartSignal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v3/signals/${selectedMarket}/smart`);
      const data = await response.json();
      setSignal(data);
      showNotification(`🎯 ${data.signal} (${(data.confidence * 100).toFixed(0)}%)`, data.confidence > 0.7 ? 'success' : 'info');
    } catch (error) {
      setSignal({ signal: 'WAIT', confidence: 0.5, reason: 'Error' });
    }
    setLoading(false);
  };
  
  const executeTrade = async (type) => {
    try {
      const response = await fetch(`${API_URL}/api/v3/trade/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'rostova_user', symbol: selectedMarket, contract_type: type, stake: stakeAmount })
      });
      const data = await response.json();
      if (data.success) {
        showNotification('✅ Trade executed!', 'success');
        fetchActiveContracts();
        fetchAccountInfo();
      }
    } catch (error) {
      showNotification('Trade error', 'error');
    }
  };
  
  const sellContract = async (contractId) => {
    try {
      const response = await fetch(`${API_URL}/api/v3/trade/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'rostova_user', contract_id: contractId })
      });
      if (response.ok) {
        showNotification('✅ Contract closed', 'success');
        fetchActiveContracts();
        fetchAccountInfo();
      }
    } catch (error) {
      showNotification('Sell error', 'error');
    }
  };
  
  const checkCapitalProtector = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/risk/capital-protector/rostova_user`);
      const data = await response.json();
      setCapitalProtector(data);
      if (data.active) showNotification(`⚠️ Capital Protector: ${data.reason}`, 'warning');
    } catch (error) {
      console.error('Risk check error');
    }
  };
  
  const calculateRiskMeter = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v3/risk/meter/rostova_user?stake=${stakeAmount}`);
      const data = await response.json();
      setRiskMeter(data);
    } catch (error) {
      console.error('Risk meter error');
    }
  };
  
  const fetchCommunityData = async () => {
    try {
      const [tradersRes, strategiesRes, leaderboardRes] = await Promise.all([
        fetch(`${API_URL}/api/v3/copy-trading/traders`),
        fetch(`${API_URL}/api/v3/marketplace/strategies`),
        fetch(`${API_URL}/api/v3/leaderboard`)
      ]);
      const traders = await tradersRes.json();
      const strats = await strategiesRes.json();
      const leader = await leaderboardRes.json();
      setTopTraders(traders.traders || []);
      setStrategies(strats.strategies || strats.featured || []);
      setLeaderboard(leader.leaderboard || []);
    } catch (error) {
      console.error('Community data error');
    }
  };
  
  const showNotification = (message, severity) => {
    setNotification({ message, severity, open: true });
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchAccountInfo();
        fetchActiveContracts();
        checkCapitalProtector();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchDigitAnalytics();
      fetchCommunityData();
    }
    const interval = setInterval(() => {
      if (isAuthenticated) fetchDigitAnalytics();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedMarket, isAuthenticated]);
  
  useEffect(() => {
    calculateRiskMeter();
  }, [stakeAmount, balance]);
  
  const DigitHeatmap = () => {
    if (!digitAnalytics) return null;
    const max = Math.max(...Object.values(digitAnalytics.digit_frequency));
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="#888" mb={1}>Digit Heatmap (Last 100 ticks)</Typography>
        <Grid container spacing={1}>
          {Object.entries(digitAnalytics.digit_frequency).map(([digit, count]) => {
            const intensity = max > 0 ? count / max : 0;
            const isHot = digitAnalytics.hot_digits?.includes(parseInt(digit));
            const isCold = digitAnalytics.cold_digits?.includes(parseInt(digit));
            return (
              <Grid item xs={2.4} key={digit}>
                <Card sx={{ bgcolor: `rgba(0, 255, 136, ${intensity * 0.7})`, border: isHot ? '2px solid #ff6b00' : isCold ? '2px solid #00bfff' : 'none', textAlign: 'center', p: 1.5 }}>
                  {isHot && <Whatshot sx={{ fontSize: 16, color: '#ff6b00', mb: 0.5 }} />}
                  {isCold && <AcUnit sx={{ fontSize: 16, color: '#00bfff', mb: 0.5 }} />}
                  <Typography variant="h5" color="#fff" fontWeight="bold">{digit}</Typography>
                  <Typography variant="caption" color="#fff">{count}</Typography>
                  <Typography variant="caption" display="block" color="#fff">{max > 0 ? ((count / max) * 100).toFixed(0) : 0}%</Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        {digitAnalytics.hot_digits && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Box><Chip icon={<Whatshot />} label={`Hot: ${digitAnalytics.hot_digits.join(', ')}`} sx={{ bgcolor: '#ff6b00', color: '#fff' }} /></Box>
            <Box><Chip icon={<AcUnit />} label={`Cold: ${digitAnalytics.cold_digits.join(', ')}`} sx={{ bgcolor: '#00bfff', color: '#fff' }} /></Box>
          </Box>
        )}
      </Box>
    );
  };
  
  const MultiChartView = () => {
    const chartCount = parseInt(chartLayout);
    return (
      <Grid container spacing={2}>
        {[...Array(chartCount)].map((_, idx) => (
          <Grid item xs={chartCount === 1 ? 12 : chartCount === 2 ? 6 : 6} key={idx}>
            <Paper sx={{ p: 2, bgcolor: '#1a1f3a', height: 300 }}>
              <Typography variant="caption" color="#888">Chart {idx + 1} - {subscribedSymbols[idx] || 'R_100'}</Typography>
              <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="#666">Live Chart Here</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  if (!isAuthenticated) {
    return (
      <Box sx={{ bgcolor: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 3 }}>
        <Card sx={{ maxWidth: 500, width: '100%', bgcolor: '#1a1f3a', p: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ShowChart sx={{ fontSize: 70, color: '#667eea', mb: 2 }} />
              <Typography variant="h3" color="#fff" mb={1} fontWeight="bold">ROSTOVA 3.0</Typography>
              <Typography variant="h6" color="#00ff88" mb={2}>The Ultimate Deriv Platform</Typography>
              <Typography variant="body2" color="#888">Better than dollarprinter.com in EVERY way!</Typography>
            </Box>
            <TextField fullWidth label="Deriv API Token" value={apiToken} onChange={(e) => setApiToken(e.target.value)} sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#888' } }} placeholder="Enter your API token" />
            <Button fullWidth variant="contained" size="large" onClick={authenticateDeriv} disabled={!apiToken} sx={{ bgcolor: '#667eea', py: 1.5, fontSize: '1.1rem' }}>🚀 Connect to ROSTOVA</Button>
            <Typography variant="caption" color="#666" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>Get your API token from app.deriv.com</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
  
  return (
    <Box sx={{ bgcolor: '#0a0e27', minHeight: '100vh' }}>
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 55, height: 55, borderRadius: '50%', background: 'linear-gradient(135deg, #00ff88 0%, #00aa55 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShowChart sx={{ fontSize: 35, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>ROSTOVA 3.0</Typography>
                <Typography variant="caption" sx={{ color: '#ddd' }}>Ultimate Deriv Trading Platform</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ py: 1, px: 2 }}>
                  <Typography variant="caption" sx={{ color: '#ddd' }}>Balance</Typography>
                  <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 'bold' }}>${balance.toFixed(2)}</Typography>
                </CardContent>
              </Card>
              {capitalProtector.active && <Chip icon={<Warning />} label="Capital Protector" color="error" size="small" />}
              <IconButton sx={{ color: '#fff' }}><Badge badgeContent={3} color="error"><Notifications /></Badge></IconButton>
            </Box>
          </Grid>
        </Grid>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mt: 2 }} textColor="inherit" TabIndicatorProps={{ style: { background: '#00ff88' } }}>
          <Tab label="Trading" sx={{ color: '#fff' }} icon={<ShowChart />} iconPosition="start" />
          <Tab label="Analytics" sx={{ color: '#fff' }} icon={<BarChart />} iconPosition="start" />
          <Tab label="Bots" sx={{ color: '#fff' }} icon={<AutoAwesome />} iconPosition="start" />
          <Tab label="Copy Trading" sx={{ color: '#fff' }} icon={<People />} iconPosition="start" />
          <Tab label="Marketplace" sx={{ color: '#fff' }} icon={<Store />} iconPosition="start" />
          <Tab label="Leaderboard" sx={{ color: '#fff' }} icon={<EmojiEvents />} iconPosition="start" />
        </Tabs>
      </Box>
      
      <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color="#fff">Multi-Chart View</Typography>
                <ToggleButtonGroup value={chartLayout} exclusive onChange={(e, val) => val && setChartLayout(val)} sx={{ bgcolor: '#1a1f3a' }}>
                  <ToggleButton value="1" sx={{ color: '#fff' }}><ViewDay /></ToggleButton>
                  <ToggleButton value="2" sx={{ color: '#fff' }}><ViewModule /></ToggleButton>
                  <ToggleButton value="4" sx={{ color: '#fff' }}><ViewQuilt /></ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <MultiChartView />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#1a1f3a', display: 'flex', gap: 3, overflow: 'auto' }}>
                {markets.map(m => (
                  <Box key={m.value} sx={{ minWidth: 150, cursor: 'pointer', p: 1, borderRadius: 2, bgcolor: selectedMarket === m.value ? 'rgba(102, 126, 234, 0.2)' : 'transparent' }} onClick={() => setSelectedMarket(m.value)}>
                    <Typography variant="caption" color="#888">{m.label}</Typography>
                    <Typography variant="h6" sx={{ color: m.color, fontWeight: 'bold' }}>{Math.floor(Math.random() * 1000 + 10000)}.{Math.floor(Math.random() * 100)}</Typography>
                    <Chip label={Math.random() > 0.5 ? '+0.5%' : '-0.3%'} size="small" color={Math.random() > 0.5 ? 'success' : 'error'} sx={{ mt: 0.5 }} />
                  </Box>
                ))}
              </Paper>
            </Grid>
            {riskMeter.percentage > 0 && (
              <Grid item xs={12}>
                <Alert severity={riskMeter.risk_level === 'high' ? 'error' : riskMeter.risk_level === 'medium' ? 'warning' : 'info'}>
                  <strong>Risk Meter:</strong> {riskMeter.percentage.toFixed(1)}% of account ({riskMeter.risk_level} risk)
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}><LocalFireDepartment sx={{ color: '#ff6b00', mr: 1 }} />Quick Trade</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#888' }}>Market</InputLabel>
                  <Select value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)} sx={{ color: '#fff' }}>
                    {markets.map(m => (<MenuItem key={m.value} value={m.value}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.color }} />{m.label}</Box></MenuItem>))}
                  </Select>
                </FormControl>
                <TextField fullWidth label="Stake ($)" type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))} sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#888' } }} />
                <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 255, 136, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="#00ff88">💰 Payout: ${(stakeAmount * 1.95).toFixed(2)}</Typography>
                </Box>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={6}><Button fullWidth variant="contained" onClick={() => executeTrade('CALL')} sx={{ bgcolor: '#00ff88', color: '#000', fontWeight: 'bold', py: 2 }}><TrendingUp sx={{ mr: 1 }} />CALL</Button></Grid>
                  <Grid item xs={6}><Button fullWidth variant="contained" onClick={() => executeTrade('PUT')} sx={{ bgcolor: '#ff0055', color: '#fff', fontWeight: 'bold', py: 2 }}><TrendingDown sx={{ mr: 1 }} />PUT</Button></Grid>
                </Grid>
                <Button fullWidth variant="outlined" startIcon={<Psychology />} onClick={getSmartSignal} disabled={loading} sx={{ borderColor: '#667eea', color: '#667eea', py: 1.5 }}>{loading ? 'Analyzing...' : 'Get AI Signal'}</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="#fff"><Psychology sx={{ mr: 1 }} />AI Signal</Typography>
                {signal ? (
                  <Box>
                    <Chip label={`${(signal.confidence * 100).toFixed(0)}% Confidence`} sx={{ bgcolor: 'rgba(102, 126, 234, 0.2)', color: '#667eea', mb: 2 }} />
                    <Typography variant="h3" sx={{ color: signal.signal.includes('OVER') || signal.signal.includes('ODD') ? '#00ff88' : '#ff0055', fontWeight: 'bold', mb: 1 }}>{signal.signal}</Typography>
                    <Typography variant="body2" color="#888">{signal.reason}</Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Psychology sx={{ fontSize: 80, color: '#444', mb: 2 }} />
                    <Typography color="#888">Click "Get AI Signal"</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {selectedTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h4" color="#fff" mb={3}>📊 Advanced Analytics</Typography></Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="#fff">Digit Heatmap & Hot/Cold Analysis</Typography>
                {digitAnalytics ? (<><DigitHeatmap /><Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Card sx={{ flex: 1, bgcolor: 'rgba(0,255,136,0.1)', p: 2 }}>
                    <Typography variant="caption" color="#888">Even</Typography>
                    <Typography variant="h4" color="#00ff88">{digitAnalytics.even_odd_ratio?.even || 0}</Typography>
                  </Card>
                  <Card sx={{ flex: 1, bgcolor: 'rgba(255,0,85,0.1)', p: 2 }}>
                    <Typography variant="caption" color="#888">Odd</Typography>
                    <Typography variant="h4" color="#ff0055">{digitAnalytics.even_odd_ratio?.odd || 0}</Typography>
                  </Card>
                  <Card sx={{ flex: 1, bgcolor: 'rgba(0,212,255,0.1)', p: 2 }}>
                    <Typography variant="caption" color="#888">Streak</Typography>
                    <Typography variant="h4" color="#00d4ff">{digitAnalytics.streak_data?.current || 0}</Typography>
                  </Card>
                </Box></>) : (<Typography color="#666">Loading...</Typography>)}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom color="#fff">Pattern Detection</Typography>
                {digitAnalytics && digitAnalytics.patterns?.length > 0 ? (
                  <List>
                    {digitAnalytics.patterns.map((pattern, idx) => (
                      <ListItem key={idx} sx={{ borderBottom: '1px solid #333' }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="#fff">{pattern.type.toUpperCase()}</Typography>
                            <Chip label={`${(pattern.confidence * 100).toFixed(0)}%`} size="small" color="success" />
                          </Box>
                          <Typography variant="caption" color="#888">Signal: {pattern.signal}</Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (<Box sx={{ textAlign: 'center', py: 4 }}><Typography color="#666">No patterns detected</Typography></Box>)}
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {selectedTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}><Typography variant="h4" color="#fff">🤖 Trading Bots</Typography><Button variant="contained" startIcon={<PlayArrow />} onClick={() => setShowBotDialog(true)} sx={{ bgcolor: '#667eea' }}>Create Bot</Button></Box></Grid>
            {bots.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 8, bgcolor: '#1a1f3a', textAlign: 'center' }}>
                  <AutoAwesome sx={{ fontSize: 80, color: '#444', mb: 2 }} />
                  <Typography variant="h6" color="#666" mb={2}>No bots yet</Typography>
                  <Button variant="contained" onClick={() => setShowBotDialog(true)} sx={{ bgcolor: '#667eea' }}>Create Your First Bot</Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
        
        {selectedTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h4" color="#fff" mb={3}>👥 Copy Trading</Typography></Grid>
            {topTraders.map(trader => (
              <Grid item xs={12} md={6} key={trader.id}>
                <Card sx={{ bgcolor: '#1a1f3a', borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h6" color="#fff">{trader.username}</Typography>
                      {trader.verified && <VerifiedUser sx={{ fontSize: 20, color: '#00ff88' }} />}
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}><Typography variant="caption" color="#888">Profit</Typography><Typography variant="h6" color="#00ff88">+${trader.profit_30d?.toFixed(2)}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="#888">Win Rate</Typography><Typography variant="h6" color="#fff">{(trader.win_rate * 100).toFixed(1)}%</Typography></Grid>
                    </Grid>
                    <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#667eea' }}>Follow Trader</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {selectedTab === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h4" color="#fff" mb={3}>🛒 Strategy Marketplace</Typography></Grid>
            {strategies.map(strategy => (
              <Grid item xs={12} md={4} key={strategy.id}>
                <Card sx={{ bgcolor: '#1a1f3a', borderRadius: 3, border: strategy.verified ? '2px solid #00ff88' : 'none' }}>
                  <CardContent>
                    {strategy.verified && <Chip label="VERIFIED" size="small" sx={{ bgcolor: '#00ff88', color: '#000', mb: 2 }} />}
                    <Typography variant="h6" color="#fff" gutterBottom>{strategy.name}</Typography>
                    <Typography variant="body2" color="#ddd" paragraph>{strategy.description}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" color="#667eea" fontWeight="bold">${strategy.price}</Typography>
                      <Button variant="contained" size="small" sx={{ bgcolor: '#667eea' }}>Buy</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {selectedTab === 5 && (
          <Box>
            <Typography variant="h4" color="#fff" mb={3}>🏆 Leaderboard</Typography>
            <Paper sx={{ bgcolor: '#1a1f3a', borderRadius: 3, overflow: 'hidden' }}>
              {leaderboard.map((user, idx) => (
                <Box key={user.rank} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 3, borderBottom: idx < leaderboard.length - 1 ? '1px solid #333' : 'none', bgcolor: idx < 3 ? 'rgba(102, 126, 234, 0.1)' : 'transparent' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: idx === 0 ? '#ffaa00' : idx === 1 ? '#aaa' : idx === 2 ? '#cd7f32' : '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="#fff">{user.rank}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" color="#fff">{user.username}</Typography>
                    <Typography variant="caption" color="#888">{user.trades} trades</Typography>
                  </Box>
                  <Typography variant="h5" color="#00ff88" fontWeight="bold">+${user.profit?.toFixed(2)}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}
      </Box>
      
      <Dialog open={showBotDialog} onClose={() => setShowBotDialog(false)} PaperProps={{ sx: { bgcolor: '#1a1f3a', borderRadius: 3, minWidth: 400 } }}>
        <DialogTitle sx={{ color: '#fff' }}>Create Trading Bot</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Bot Name" sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#888' } }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#888' }}>Strategy</InputLabel>
            <Select sx={{ color: '#fff' }}>
              <MenuItem value="martingale">Martingale</MenuItem>
              <MenuItem value="anti_martingale">Anti-Martingale</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBotDialog(false)} sx={{ color: '#fff' }}>Cancel</Button>
          <Button onClick={() => setShowBotDialog(false)} variant="contained" sx={{ bgcolor: '#667eea' }}>Create</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={notification?.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={notification?.severity}>{notification?.message}</Alert>
      </Snackbar>
    </Box>
  );
}
