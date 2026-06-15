from pydantic import BaseModel

class PredictionInput(BaseModel):
    student_id: str
    attendance_rate: float
    late_count: int

class PredictionOutput(BaseModel):
    risk_level: str
    predicted_absence_probability: float

def predict_absenteeism(data: PredictionInput) -> PredictionOutput:
    # This is a placeholder for actual ML model inference
    # In reality, you would load a trained model (e.g., scikit-learn, XGBoost)
    # and call model.predict()
    
    risk_level = "LOW"
    probability = 0.1
    
    if data.attendance_rate < 50:
        risk_level = "HIGH"
        probability = 0.85
    elif data.attendance_rate < 75:
        risk_level = "MEDIUM"
        probability = 0.45
        
    return PredictionOutput(
        risk_level=risk_level,
        predicted_absence_probability=probability
    )
