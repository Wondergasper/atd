from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
try:
    from .scanner_bridge import scanner
except ImportError:
    from scanner_bridge import scanner
import json
import asyncio

app = FastAPI(title="Biometric Local Agent")

# Allow requests from your React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
def get_status():
    return {"status": "online", "hardware": "Futronic FS80H"}

@app.websocket("/ws/scan")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Frontend Connected to Local Agent")
    try:
        while True:
            # Wait for "START_SCAN" message from React
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("command") == "START_SCAN":
                await websocket.send_json({"status": "scanning", "message": "Place finger on scanner..."})
                
                # Run the blocking scanner logic in a thread to keep websocket alive
                result = await asyncio.to_thread(scanner.capture_template)
                
                if result["status"] == "success":
                    await websocket.send_json({
                        "status": "success",
                        "template_data": result["template"],
                        "quality": result["quality"],
                        "message": "Scan captured successfully"
                    })
                else:
                    await websocket.send_json({"status": "error", "message": result["message"]})
                    
    except WebSocketDisconnect:
        print("Frontend Disconnected")

if __name__ == "__main__":
    import uvicorn
    # Running on port 8001 to not conflict with the main backend on 8000
    uvicorn.run(app, host="127.0.0.1", port=8001)
