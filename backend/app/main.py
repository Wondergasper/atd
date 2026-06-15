from app import models  # Ensure all models are registered FIRST
from sqlalchemy.orm import configure_mappers
configure_mappers() # Force relationship resolution

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for the Biometric Attendance System with ML integration",
    version="1.0.0"
)

# Set all authorized CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to the Biometric Attendance System API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api": "online",
        "database": "connected (sqlite)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
