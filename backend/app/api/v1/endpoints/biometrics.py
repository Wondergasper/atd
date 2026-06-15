from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....services.biometric_service import biometric_service
from ....schemas.biometric import BiometricEnrollRequest, BiometricVerifyRequest, BiometricVerifyResponse
from ....core.database import get_db

router = APIRouter()

@router.post("/enroll")
def enroll_biometric(
    *,
    db: Session = Depends(get_db),
    enroll_data: BiometricEnrollRequest
):
    """
    Enroll student fingerprint.
    """
    return biometric_service.enroll_fingerprint(db, enroll_data)

@router.post("/verify", response_model=BiometricVerifyResponse)
def verify_biometric(
    *,
    db: Session = Depends(get_db),
    verify_data: BiometricVerifyRequest
):
    """
    Verify student fingerprint.
    """
    return biometric_service.verify_fingerprint(db, verify_data)
