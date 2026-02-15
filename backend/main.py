"""
xTrader Platform - Backend API
SIMPLIFIED VERSION FOR ANDROID DEPLOYMENT

This is the main backend file that handles:
- Trading API endpoints
- Real-time WebSocket connections
- AI signal generation
- Market data
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import random
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="xTrader API",
    description="Trading Platform Backend",
    version="1.0.0"
)

# Enable CORS (allow frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active WebSocket connections
active_connections: Dict[str, WebSocket] = {}


# ===== BASIC ENDPOINTS =====

@app.get("/")
async def root():
    """API home - check if backend is running"""
    return {
        "name": "xTrader API",
        "version": "1.0.0",
        "status": "operational",
        "message": "Welcome to xTrader Platform! Go to /docs for API documentation."
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "connections": len(active_connections)
    }


# ===== MARKET DATA ENDPOINTS =====

@app.get("/api/v1/markets")
async def get_markets():
    """Get list of available markets"""
    return {
        "markets": [
            {"symbol": "R_10", "name": "Volatility 10 Index", "type": "synthetic"},
            {"symbol": "R_25", "name": "Volatility 25 Index", "type": "synthetic"},
            {"symbol": "R_50", "name": "Volatility 50 Index", "type": "synthetic"},
            {"symbol": "R_75", "name": "Volatility 75 Index", "type": "synthetic"},
            {"symbol": "R_100", "name": "Volatility 100 Index", "type": "synthetic"},
            {"symbol": "BOOM500", "name": "Boom 500 Index", "type": "synthetic"},
            {"symbol": "CRASH500", "name": "Crash 500 Index", "type": "synthetic"},
        ]
    }


@app.get("/api/v1/markets/{symbol}/price")
async def get_price(symbol: str):
    """Get current price for a symbol"""
    # Simulated price data
    base_prices = {
        "R_10": 1000,
        "R_25": 2500,
        "R_50": 5000,
        "R_75": 7500,
        "R_100": 10000,
        "BOOM500": 5000,
        "CRASH500": 5000
    }
    
    base = base_prices.get(symbol, 10000)
    price = round(base + random.uniform(-50, 50), 2)
    
    return {
        "symbol": symbol,
        "price": price,
        "last_digit": int(str(price).replace(".", "")[-1]),
        "timestamp": "2024-02-14T12:00:00Z"
    }


# ===== AI SIGNAL GENERATION =====

@app.get("/api/v1/signals/{symbol}")
async def get_signal(symbol: str):
    """Get AI-powered trading signal"""
    
    # Simulated AI signal
    predictions = ["DIGIT_OVER_5", "DIGIT_UNDER_5", "EVEN", "ODD"]
    prediction = random.choice(predictions)
    confidence = round(random.uniform(0.65, 0.95), 2)
    
    # Simulated analysis factors
    factors = [
        {"name": "RSI", "value": round(random.uniform(30, 70), 1), "weight": 0.25},
        {"name": "MACD", "value": "bullish" if random.random() > 0.5 else "bearish", "weight": 0.20},
        {"name": "Volatility", "value": "high" if random.random() > 0.5 else "low", "weight": 0.30},
        {"name": "Pattern", "value": "streak_detected", "weight": 0.25}
    ]
    
    return {
        "symbol": symbol,
        "prediction": prediction,
        "confidence": confidence,
        "timestamp": "2024-02-14T12:00:00Z",
        "factors": factors,
        "recommendation": "BUY" if confidence > 0.75 else "WAIT"
    }


# ===== TRADING ENDPOINTS =====

@app.post("/api/v1/trades")
async def place_trade(trade_data: dict):
    """Place a new trade"""
    
    # Simulate trade result
    result = random.choice(["WIN", "LOSS"])
    profit = trade_data.get("stake", 1.0) * (0.95 if result == "WIN" else -1.0)
    
    return {
        "trade_id": f"trade_{random.randint(10000, 99999)}",
        "symbol": trade_data.get("symbol", "R_100"),
        "type": trade_data.get("type", "DIGIT_OVER"),
        "stake": trade_data.get("stake", 1.0),
        "result": result,
        "profit": round(profit, 2),
        "timestamp": "2024-02-14T12:00:00Z"
    }


@app.get("/api/v1/trades/history")
async def get_trade_history():
    """Get trade history"""
    
    # Simulated trade history
    trades = []
    for i in range(10):
        result = random.choice(["WIN", "LOSS"])
        stake = round(random.uniform(1, 10), 2)
        profit = stake * (0.95 if result == "WIN" else -1.0)
        
        trades.append({
            "id": f"trade_{i}",
            "symbol": random.choice(["R_100", "R_50", "R_25"]),
            "type": random.choice(["DIGIT_OVER", "DIGIT_UNDER", "EVEN", "ODD"]),
            "stake": stake,
            "result": result,
            "profit": round(profit, 2),
            "timestamp": f"2024-02-14T{12+i}:00:00Z"
        })
    
    return {"trades": trades}


# ===== BOT ENDPOINTS =====

@app.get("/api/v1/bots")
async def get_bots():
    """Get list of trading bots"""
    return {
        "bots": [
            {
                "id": "bot_1",
                "name": "EMA Crossover Bot",
                "status": "ACTIVE",
                "strategy": "ema_cross",
                "profit": 145.50,
                "trades": 47,
                "win_rate": 0.62
            },
            {
                "id": "bot_2",
                "name": "RSI Bot",
                "status": "PAUSED",
                "strategy": "rsi_reversal",
                "profit": 89.30,
                "trades": 32,
                "win_rate": 0.58
            }
        ]
    }


@app.get("/api/v1/strategies")
async def get_strategies():
    """Get available trading strategies"""
    return {
        "strategies": [
            {
                "id": "ema_cross",
                "name": "EMA Crossover",
                "description": "Buy when EMA(20) crosses above EMA(50)",
                "risk": "medium",
                "avg_win_rate": 0.58
            },
            {
                "id": "rsi_reversal",
                "name": "RSI Mean Reversion",
                "description": "Buy oversold, sell overbought",
                "risk": "low",
                "avg_win_rate": 0.62
            },
            {
                "id": "martingale",
                "name": "Martingale",
                "description": "Double stake after loss",
                "risk": "high",
                "avg_win_rate": 0.55
            }
        ]
    }


# ===== ANALYTICS ENDPOINTS =====

@app.get("/api/v1/analytics/performance")
async def get_performance():
    """Get account performance metrics"""
    return {
        "total_trades": 156,
        "wins": 94,
        "losses": 62,
        "win_rate": 0.603,
        "total_profit": 1247.80,
        "best_trade": 45.00,
        "worst_trade": -10.00,
        "avg_profit": 8.00
    }


# ===== WEBSOCKET FOR REAL-TIME DATA =====

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket connection for real-time updates"""
    await websocket.accept()
    active_connections[client_id] = websocket
    logger.info(f"Client {client_id} connected")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            if data.get("action") == "subscribe":
                # Send confirmation
                await websocket.send_json({
                    "type": "subscribed",
                    "symbol": data.get("symbol")
                })
                
            elif data.get("action") == "ping":
                # Send pong response
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": data.get("timestamp")
                })
    
    except WebSocketDisconnect:
        del active_connections[client_id]
        logger.info(f"Client {client_id} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if client_id in active_connections:
            del active_connections[client_id]


# ===== STARTUP MESSAGE =====

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 xTrader Platform API is starting...")
    logger.info("✅ Backend is ready!")
    logger.info("📊 Access API docs at: /docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
