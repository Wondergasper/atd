from fastapi import APIRouter
from .endpoints import students, biometrics, attendance, devices, analytics, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(biometrics.router, prefix="/biometrics", tags=["biometrics"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
