from fastapi import APIRouter
from ....ml.absenteeism_predictor import predict_absenteeism, PredictionInput, PredictionOutput

router = APIRouter()

@router.post("/predict-absenteeism", response_model=PredictionOutput)
def get_absenteeism_prediction(data: PredictionInput):
    """
    Predict absenteeism for a student.
    """
    return predict_absenteeism(data)

@router.get("/attendance-trends")
def get_attendance_trends():
    """
    Get general attendance trends.
    """
    return {"message": "Placeholder for attendance trends analytics"}
