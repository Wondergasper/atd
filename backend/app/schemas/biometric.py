from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BiometricTemplateBase(BaseModel):
    finger_type: str
    quality_score: Optional[int] = None

class BiometricTemplateCreate(BiometricTemplateBase):
    student_id: int
    template_data: str

class BiometricTemplate(BiometricTemplateBase):
    id: int
    student_id: int
    template_data: str
    created_at: datetime

    class Config:
        from_attributes = True

class BiometricEnrollRequest(BaseModel):
    student_id: int
    finger_type: str
    template_data: str
    quality_score: int

class BiometricVerifyRequest(BaseModel):
    template_data: str
    device_id: Optional[int] = None

class BiometricVerifyResponse(BaseModel):
    matched: bool
    student_id: Optional[int] = None
    confidence: Optional[float] = None
