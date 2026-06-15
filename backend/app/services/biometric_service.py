from sqlalchemy.orm import Session
from ..repositories.biometric_repository import biometric_repo
from ..repositories.student_repository import student_repo
from ..schemas.biometric import BiometricEnrollRequest, BiometricVerifyRequest, BiometricVerifyResponse
from fastapi import HTTPException, status

class BiometricService:
    def enroll_fingerprint(self, db: Session, enroll_data: BiometricEnrollRequest):
        # Check if student exists
        student = student_repo.get(db, id=enroll_data.student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student with id {enroll_data.student_id} not found"
            )
        
        # In a real scenario, you might want to check if this finger_type is already enrolled
        # and update it or prevent duplicates.
        
        db_obj = biometric_repo.create(db, obj_in=enroll_data)
        return {
            "student_id": student.id,
            "finger_type": db_obj.finger_type,
            "quality_score": db_obj.quality_score,
            "status": "enrolled"
        }

    def verify_fingerprint(self, db: Session, verify_data: BiometricVerifyRequest):
        # This is where the scanner-agnostic matching logic would go.
        # For now, we'll implement a placeholder for the matching algorithm.
        # In a production system, you might use a server-side SDK (like MegaMatcher or a custom one)
        # to compare the incoming template with all templates in the database.
        
        templates = biometric_repo.get_multi(db, limit=1000) # Fetch all templates for matching
        
        # Placeholder for matching logic
        matched_student_id = None
        highest_confidence = 0.0
        
        # Example of how matching might look (logic depends on the SDK/algorithm used)
        # for template in templates:
        #     confidence = some_matching_algorithm(verify_data.template_data, template.template_data)
        #     if confidence > threshold and confidence > highest_confidence:
        #         matched_student_id = template.student_id
        #         highest_confidence = confidence
        
        # SIMULATION for development
        if verify_data.template_data == "dummy_match":
            matched_student_id = 1
            highest_confidence = 99.9
            
        return BiometricVerifyResponse(
            matched=matched_student_id is not None,
            student_id=matched_student_id,
            confidence=highest_confidence
        )

biometric_service = BiometricService()
