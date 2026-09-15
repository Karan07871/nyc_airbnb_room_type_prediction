from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware





# Create FastAPI application
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load trained ML model
model = joblib.load("room_type_model.pkl")


# Input data format
class PredictionInput(BaseModel):
    latitude: float
    longitude: float
    price: float
    minimum_nights: int
    number_of_reviews: int
    reviews_per_month: float
    calculated_host_listings_count: int
    availability_365: int
    neighbourhood_group: str
    neighbourhood: str


@app.get("/")
def home():
    return {
        "message": "NYC Airbnb Room Type Prediction API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.post("/predict")
def predict(data: PredictionInput):

    # Convert user input into a DataFrame
    input_data = pd.DataFrame([{
        "latitude": data.latitude,
        "longitude": data.longitude,
        "price": data.price,
        "minimum_nights": data.minimum_nights,
        "number_of_reviews": data.number_of_reviews,
        "reviews_per_month": data.reviews_per_month,
        "calculated_host_listings_count": data.calculated_host_listings_count,
        "availability_365": data.availability_365,
        "neighbourhood_group": data.neighbourhood_group,
        "neighbourhood": data.neighbourhood
    }])

    # Make prediction
    prediction = model.predict(input_data)[0]

    # Get probabilities
    probabilities = model.predict_proba(input_data)[0]

    # Get room type names
    classes = model.classes_

    # Create probability dictionary
    probability_result = {
        classes[i]: round(float(probabilities[i]) * 100, 2)
        for i in range(len(classes))
    }

    return {
        "prediction": prediction,
        "probabilities": probability_result
    }