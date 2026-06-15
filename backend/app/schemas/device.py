from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceBase(BaseModel):
    serial_number: str
    name: Optional[str] = None
    location: Optional[str] = None
    ip_address: Optional[str] = None
    latency: Optional[str] = None
    status: Optional[str] = "OFFLINE"

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(DeviceBase):
    serial_number: Optional[str] = None
    status: Optional[str] = None

class Device(DeviceBase):
    id: int
    last_seen: Optional[datetime] = None

    class Config:
        from_attributes = True
