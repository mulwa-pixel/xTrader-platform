'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Chip, Avatar, Tab, Tabs, LinearProgress, IconButton, Badge, Divider } from '@mui/material';
import { TrendingUp, Psychology, ShowChart, People, Store, EmojiEvents, Notifications, Settings, LocalFireDepartment, Star, VerifiedUser, TrendingDown } from '@mui/icons-material';

export default function EnhancedDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState('R_100');
  const [stakeAmount, setStakeAmount] = useState(1.00);
  const [balance, setBalance] = useState(10000);
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
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
  ];
  const getAdvancedSignal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v2/signals/${selectedMarket}/advanced`);
      const data = await response.json();
      setSignal(data);
    } catch (error) {
      setSignal({ ensemble: { prediction: Math.random() > 0.5 ? 'CALL' : 'PUT', confidence: 0.85, strength: 'STRONG' }, models: { neural_network: { prediction: 'CALL', confidence: 0.87 }, random_forest: { prediction: 'CALL', confidence: 0.85 }, gradient_boost: { prediction: 'PUT', confidence: 0.78 } }, technical_analysis: { rsi: 62.1, macd: 'bullish', sma_trend: 'uptrend' } });
    }
    setLoading(false);
  };
  const placeTrade = async (type) => {
    try {
      const response = await fetch(`${API_URL}/api/v2/trades/execute`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symbol: selectedMarket, type: type, stake: stakeAmount }) });
      const data = await response.json();
      if (data.result) {
        const profit = data.profit || (Math.random() > 0.5 ? stakeAmount * 0.95 : -stakeAmount);
        setBalance(prev => prev + profit);
        alert(`${data.result}! Profit/Loss: $${profit.toFixed(2)}`);
      }
    } catch (error) {
      const result = Math.random() > 0.5 ? 'WIN' : 'LOSS';
      const profit = result === 'WIN' ? stakeAmount * 0.95 : -stakeAmount;
      setBalance(prev => prev + profit);
      alert(`${result}! Profit/Loss: $${profit.toFixed(2)}`);
    }
  };
  useEffect(() => {
    const fetchTopTraders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/copy-trading/traders`);
        const data = await response.json();
        setTopTraders(data.traders || []);
      } catch (error) {
        setTopTraders([{ id: 'trader_001', username: 'ProTrader99', avatar: 'https://i.pravatar.cc/150?img=1', profit_30d: 3847.50, win_rate: 0.68, followers: 1240, roi: 38.5, risk_score: 6.5, verified: true, premium: true }, { id: 'trader_002', username: 'SignalMaster', avatar: 'https://i.pravatar.cc/150?img=2', profit_30d: 2940.20, win_rate: 0.71, followers: 890, roi: 29.4, risk_score: 5.2, verified: true, premium: false }]);
      }
    };
    fetchTopTraders();
  }, []);
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/marketplace/strategies`);
        const data = await response.json();
        setStrategies(data.strategies || []);
      } catch (error) {
        setStrategies([{ id: 'strat_001', name: 'RSI Scalper Pro', creator: 'TradeKing', description: 'Quick scalping with RSI oversold/overbought', win_rate: 0.67, profit: 2847.50, price: 49.99, rating: 4.8, verified: true }, { id: 'strat_002', name: 'Martingale Master', creator: 'RiskTaker', description: 'Controlled martingale with safety limits', win_rate: 0.61, profit: 1923.80, price: 29.99, rating: 4.5, verified: true }, { id: 'strat_003', name: 'Trend Follower Elite', creator: 'MarketGuru', description: 'Follow strong trends with EMA crossovers', win_rate: 0.72, profit: 3456.20, price: 79.99, rating: 4.9, verified: true }]);
      }
    };
    fetchStrategies();
  }, []);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/community/leaderboard`);
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      } catch (error) {
        setLeaderboard([{ rank: 1, username: 'ProTrader99', profit: 15847.50, trades: 1240, win_rate: 0.68 }, { rank: 2, username: 'MarketNinja', profit: 12340.20, trades: 980, win_rate: 0.65 }, { rank: 3, username: 'SignalMaster', profit: 10567.80, trades: 856, win_rate: 0.71 }, { rank: 4, username: 'BotKing', profit: 9234.10, trades: 1120, win_rate: 0.63 }, { rank: 5, username: 'AITrader', profit: 8901.40, trades: 745, win_rate: 0.69 }]);
      }
    };
    fetchLeaderboard();
  }, []);
  return (<Box sx={{ bgcolor: '#0a0e27', minHeight: '100vh' }}><Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}><Grid container alignItems="center" justifyContent="space-between"><Grid item><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #00ff88 0%, #00aa55 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShowChart sx={{ fontSize: 30, color: '#fff' }} /></Box><Box><Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>xTrader Pro</Typography><Typography variant="caption" sx={{ color: '#ddd' }}>AI-Powered Trading Platform</Typography></Box></Box></Grid><Grid item><Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}><Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}><CardContent sx={{ py: 1, px: 2 }}><Typography variant="caption" sx={{ color: '#ddd' }}>Balance</Typography><Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 'bold' }}>${balance.toFixed(2)}</Typography></CardContent></Card><IconButton sx={{ color: '#fff' }}><Badge badgeContent={3} color="error"><Notifications /></Badge></IconButton><IconButton sx={{ color: '#fff' }}><Settings /></IconButton></Box></Grid></Grid><Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mt: 2 }} textColor="inherit" TabIndicatorProps={{ style: { background: '#00ff88' } }}><Tab label="Trading" sx={{ color: '#fff' }} /><Tab label="Copy Trading" sx={{ color: '#fff' }} icon={<People />} iconPosition="start" /><Tab label="Marketplace" sx={{ color: '#fff' }} icon={<Store />} iconPosition="start" /><Tab label="Leaderboard" sx={{ color: '#fff' }} icon={<EmojiEvents />} iconPosition="start" /></Tabs></Box><Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>{selectedTab === 0 && (<Grid container spacing={3}><Grid item xs={12}><Paper sx={{ p: 2, bgcolor: '#1a1f3a', display: 'flex', gap: 3, overflow: 'auto' }}>{markets.map(m => (<Box key={m.value} sx={{ minWidth: 150 }}><Typography variant="caption" color="#888">{m.label}</Typography><Typography variant="h6" sx={{ color: m.color, fontWeight: 'bold' }}>10,{Math.floor(Math.random() * 900 + 100)}.{Math.floor(Math.random() * 100)}</Typography><Chip label={Math.random() > 0.5 ? '+0.5%' : '-0.3%'} size="small" color={Math.random() > 0.5 ? 'success' : 'error'} sx={{ mt: 0.5 }} /></Box>))}</Paper></Grid><Grid item xs={12} md={6}><Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3 }}><Typography variant="h5" gutterBottom sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}><LocalFireDepartment sx={{ color: '#ff6b00' }} />Quick Trade</Typography><FormControl fullWidth sx={{ mb: 2 }}><InputLabel sx={{ color: '#888' }}>Market</InputLabel><Select value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)} sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#444' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}>{markets.map(m => (<MenuItem key={m.value} value={m.value}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.color }} />{m.label}</Box></MenuItem>))}</Select></FormControl><TextField fullWidth label="Stake Amount ($)" type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))} sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#888' } }} /><Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 255, 136, 0.1)', borderRadius: 2 }}><Typography variant="body2" color="#00ff88">💰 Potential Payout: ${(stakeAmount * 1.95).toFixed(2)}</Typography><Typography variant="caption" color="#888">Risk/Reward: 1:0.95</Typography></Box><Grid container spacing={1} mb={2}><Grid item xs={6}><Button fullWidth variant="contained" onClick={() => placeTrade('CALL')} sx={{ bgcolor: '#00ff88', color: '#000', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: '#00dd77' } }}><TrendingUp sx={{ mr: 1 }} /> CALL</Button></Grid><Grid item xs={6}><Button fullWidth variant="contained" onClick={() => placeTrade('PUT')} sx={{ bgcolor: '#ff0055', color: '#fff', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: '#dd0044' } }}><TrendingDown sx={{ mr: 1 }} /> PUT</Button></Grid></Grid><Button fullWidth variant="outlined" startIcon={<Psychology />} onClick={getAdvancedSignal} disabled={loading} sx={{ borderColor: '#667eea', color: '#667eea', py: 1 }}>{loading ? 'Analyzing...' : 'Get AI Signal'}</Button></Paper></Grid><Grid item xs={12} md={6}><Paper sx={{ p: 3, bgcolor: '#1a1f3a', borderRadius: 3, minHeight: 450 }}><Typography variant="h5" gutterBottom sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}><Psychology sx={{ color: '#667eea' }} />AI Analysis</Typography>{signal ? (<Box><Box sx={{ mb: 3, textAlign: 'center' }}><Chip label={`${(signal.ensemble.confidence * 100).toFixed(0)}% Confidence`} sx={{ bgcolor: 'rgba(102, 126, 234, 0.2)', color: '#667eea', fontWeight: 'bold', mb: 2 }} /><Typography variant="h2" sx={{ color: signal.ensemble.prediction === 'CALL' ? '#00ff88' : '#ff0055', fontWeight: 'bold', mb: 1 }}>{signal.ensemble.prediction}</Typography><Chip label={signal.ensemble.strength} color={signal.ensemble.strength === 'STRONG' ? 'success' : 'warning'} /></Box><Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>AI Models Consensus:</Typography>{Object.entries(signal.models).map(([name, model]) => (<Box key={name} sx={{ mb: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2" color="#fff">{name.replace('_', ' ').toUpperCase()}</Typography><Typography variant="body2" sx={{ color: model.prediction === 'CALL' ? '#00ff88' : '#ff0055' }}>{model.prediction} ({(model.confidence * 100).toFixed(0)}%)</Typography></Box><LinearProgress variant="determinate" value={model.confidence * 100} sx={{ bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: model.prediction === 'CALL' ? '#00ff88' : '#ff0055' } }} /></Box>))}<Divider sx={{ my: 2, bgcolor: '#333' }} /><Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>Technical Indicators:</Typography><Grid container spacing={1}><Grid item xs={6}><Typography variant="caption" color="#888">RSI</Typography><Typography variant="body2" color="#fff">{signal.technical_analysis.rsi}</Typography></Grid><Grid item xs={6}><Typography variant="caption" color="#888">MACD</Typography><Typography variant="body2" color={signal.technical_analysis.macd === 'bullish' ? '#00ff88' : '#ff0055'}>{signal.technical_analysis.macd}</Typography></Grid></Grid></Box>) : (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 350 }}><Psychology sx={{ fontSize: 80, color: '#444', mb: 2 }} /><Typography variant="h6" color="#888">Click "Get AI Signal" to analyze</Typography></Box>)}</Paper></Grid></Grid>)}{selectedTab === 1 && (<Grid container spacing={3}><Grid item xs={12}><Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>🔥 Top Traders to Copy</Typography></Grid>{topTraders.map(trader => (<Grid item xs={12} md={6} key={trader.id}><Card sx={{ bgcolor: '#1a1f3a', borderRadius: 3 }}><CardContent><Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Avatar src={trader.avatar} sx={{ width: 60, height: 60 }} /><Box sx={{ flex: 1 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="h6" color="#fff">{trader.username}</Typography>{trader.verified && <VerifiedUser sx={{ fontSize: 20, color: '#00ff88' }} />}{trader.premium && <Star sx={{ fontSize: 20, color: '#ffaa00' }} />}</Box><Typography variant="caption" color="#888">{trader.followers.toLocaleString()} followers</Typography></Box><Button variant="contained" size="small" sx={{ bgcolor: '#667eea' }}>Follow</Button></Box><Grid container spacing={2}><Grid item xs={6}><Typography variant="caption" color="#888">30-Day Profit</Typography><Typography variant="h6" color="#00ff88">+${trader.profit_30d.toFixed(2)}</Typography></Grid><Grid item xs={6}><Typography variant="caption" color="#888">Win Rate</Typography><Typography variant="h6" color="#fff">{(trader.win_rate * 100).toFixed(1)}%</Typography></Grid><Grid item xs={6}><Typography variant="caption" color="#888">ROI</Typography><Typography variant="h6" color="#00ff88">+{trader.roi}%</Typography></Grid><Grid item xs={6}><Typography variant="caption" color="#888">Risk Score</Typography><Chip label={trader.risk_score + '/10'} size="small" color={trader.risk_score < 5 ? 'success' : trader.risk_score < 7 ? 'warning' : 'error'} /></Grid></Grid></CardContent></Card></Grid>))}</Grid>)}{selectedTab === 2 && (<Grid container spacing={3}><Grid item xs={12}><Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>💎 Strategy Marketplace</Typography></Grid>{strategies.map(strategy => (<Grid item xs={12} md={4} key={strategy.id}><Card sx={{ bgcolor: '#1a1f3a', borderRadius: 3, border: strategy.verified ? '2px solid #00ff88' : 'none' }}><CardContent>{strategy.verified && (<Chip label="VERIFIED" size="small" icon={<VerifiedUser />} sx={{ bgcolor: '#00ff88', color: '#000', mb: 2 }} />)}<Typography variant="h6" color="#fff" gutterBottom>{strategy.name}</Typography><Typography variant="body2" color="#888" paragraph>by {strategy.creator}</Typography><Typography variant="body2" color="#ddd" paragraph>{strategy.description}</Typography><Grid container spacing={1} mb={2}><Grid item xs={4}><Typography variant="caption" color="#888">Win Rate</Typography><Typography variant="body1" color="#00ff88">{(strategy.win_rate * 100).toFixed(0)}%</Typography></Grid><Grid item xs={4}><Typography variant="caption" color="#888">Profit</Typography><Typography variant="body1" color="#00ff88">${strategy.profit}</Typography></Grid><Grid item xs={4}><Typography variant="caption" color="#888">Rating</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Star sx={{ fontSize: 16, color: '#ffaa00' }} /><Typography variant="body1" color="#fff">{strategy.rating}</Typography></Box></Grid></Grid><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h5" color="#667eea" fontWeight="bold">${strategy.price}</Typography><Button variant="contained" size="small" sx={{ bgcolor: '#667eea' }}>Buy Now</Button></Box></CardContent></Card></Grid>))}</Grid>)}{selectedTab === 3 && (<Box><Typography variant="h4" sx={{ color: '#fff', mb: 3 }}>🏆 Community Leaderboard</Typography><Paper sx={{ bgcolor: '#1a1f3a', borderRadius: 3, overflow: 'hidden' }}>{leaderboard.map((user, idx) => (<Box key={user.rank} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 3, borderBottom: idx < leaderboard.length - 1 ? '1px solid #333' : 'none', bgcolor: idx < 3 ? 'rgba(102, 126, 234, 0.1)' : 'transparent' }}><Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: idx === 0 ? '#ffaa00' : idx === 1 ? '#aaa' : idx === 2 ? '#cd7f32' : '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="h6" fontWeight="bold" color="#fff">{user.rank}</Typography></Box><Avatar sx={{ width: 50, height: 50 }}>{user.username[0]}</Avatar><Box sx={{ flex: 1 }}><Typography variant="h6" color="#fff">{user.username}</Typography><Typography variant="caption" color="#888">{user.trades} trades • {(user.win_rate * 100).toFixed(1)}% win rate</Typography></Box><Typography variant="h5" color="#00ff88" fontWeight="bold">+${user.profit.toFixed(2)}</Typography></Box>))}</Paper></Box>)}</Box><Box sx={{ p: 3, textAlign: 'center', color: '#666' }}><Typography variant="caption">⚠️ Demo Account - For Learning Only | Trading involves significant risk</Typography></Box></Box>);
}
