'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { SmartToy, PlayArrow, Stop } from '@mui/icons-material';

export default function BotBuilder() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const strategies = [
    {
      id: 'ema',
      name: 'EMA Crossover',
      description: 'Buy when EMA(20) crosses above EMA(50)',
      winRate: '58%',
      risk: 'Medium'
    },
    {
      id: 'rsi',
      name: 'RSI Mean Reversion',
      description: 'Buy oversold, sell overbought',
      winRate: '62%',
      risk: 'Low'
    },
    {
      id: 'martingale',
      name: 'Martingale',
      description: 'Double stake after loss',
      winRate: '55%',
      risk: 'High'
    }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0f0f1e', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
          <SmartToy sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Bot Builder
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#888' }}>
          Create Automated Trading Strategies
        </Typography>
      </Box>

      <Grid container spacing={3} maxWidth="lg" mx="auto">
        {/* Strategy Templates */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a2e', color: '#fff' }}>
            <Typography variant="h5" gutterBottom>
              Select a Strategy Template
            </Typography>
            <Grid container spacing={2} mt={1}>
              {strategies.map((strategy) => (
                <Grid item xs={12} md={4} key={strategy.id}>
                  <Card
                    sx={{
                      bgcolor: selectedStrategy?.id === strategy.id ? '#252542' : '#1a1a2e',
                      border: selectedStrategy?.id === strategy.id ? '2px solid #4caf50' : '1px solid #444',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setSelectedStrategy(strategy)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {strategy.name}
                      </Typography>
                      <Typography variant="body2" color="#888" gutterBottom>
                        {strategy.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label={`Win Rate: ${strategy.winRate}`}
                          size="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={`Risk: ${strategy.risk}`}
                          size="small"
                          color={strategy.risk === 'Low' ? 'success' : strategy.risk === 'Medium' ? 'warning' : 'error'}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Bot Controls */}
        {selectedStrategy && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#1a1a2e', color: '#fff' }}>
              <Typography variant="h5" gutterBottom>
                Bot Status
              </Typography>
              
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SmartToy sx={{ fontSize: 80, color: isRunning ? '#4caf50' : '#888', mb: 2 }} />
                <Typography variant="h6" color={isRunning ? '#4caf50' : '#888'}>
                  {isRunning ? 'Bot is Running' : 'Bot is Stopped'}
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isRunning ? <Stop /> : <PlayArrow />}
                  onClick={() => setIsRunning(!isRunning)}
                  sx={{
                    mt: 3,
                    bgcolor: isRunning ? '#f44336' : '#4caf50',
                    '&:hover': { bgcolor: isRunning ? '#d32f2f' : '#45a049' },
                    minWidth: 200
                  }}
                >
                  {isRunning ? 'Stop Bot' : 'Start Bot'}
                </Button>
              </Box>

              {isRunning && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Live Performance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="#888">Trades</Typography>
                      <Typography variant="h5">15</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="#888">Wins</Typography>
                      <Typography variant="h5" color="#4caf50">9</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="#888">Profit</Typography>
                      <Typography variant="h5" color="#4caf50">+$47.50</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="#888">Win Rate</Typography>
                      <Typography variant="h5">60%</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* Instructions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a2e', color: '#fff' }}>
            <Typography variant="h6" gutterBottom>
              📚 How to Use
            </Typography>
            <Typography variant="body2" color="#888" paragraph>
              1. Select a strategy template above
            </Typography>
            <Typography variant="body2" color="#888" paragraph>
              2. Click "Start Bot" to begin automated trading
            </Typography>
            <Typography variant="body2" color="#888" paragraph>
              3. Monitor performance in real-time
            </Typography>
            <Typography variant="body2" color="#888">
              4. Click "Stop Bot" to pause trading
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
