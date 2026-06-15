from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....repositories.device_repository import device_repo
from ....schemas.device import Device, DeviceCreate, DeviceUpdate
from ....core.database import get_db

router = APIRouter()

@router.get("/", response_model=List[Device])
def read_devices(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve devices.
    """
    return device_repo.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=Device)
def create_device(
    *,
    db: Session = Depends(get_db),
    device_in: DeviceCreate
) -> Any:
    """
    Create new device.
    """
    device = device_repo.get_by_serial(db, serial_number=device_in.serial_number)
    if device:
        raise HTTPException(status_code=400, detail="Device already exists")
    return device_repo.create(db, obj_in=device_in)

@router.get("/status")
def get_devices_status(db: Session = Depends(get_db)):
    """
    Get all devices status.
    """
    devices = device_repo.get_multi(db)
    return [{"id": d.id, "serial_number": d.serial_number, "status": d.status} for d in devices]
