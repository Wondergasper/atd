from sqlalchemy.orm import Session
from .base import BaseRepository
from ..models.attendance import Device
from ..schemas.device import DeviceCreate, DeviceUpdate

class DeviceRepository(BaseRepository[Device, DeviceCreate, DeviceUpdate]):
    def get_by_serial(self, db: Session, serial_number: str):
        return db.query(self.model).filter(self.model.serial_number == serial_number).first()

device_repo = DeviceRepository(Device)
