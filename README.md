🏠 NYC Airbnb Room Type Classification

A Machine Learning web application that predicts the type of Airbnb room/property in New York City based on listing information.

The model classifies a listing into one of three categories:

Entire home/apt
Private room
Shared room
📌 Project Overview

This project uses the NYC Airbnb dataset to build a Machine Learning classification model.

The project includes:

Data cleaning and preprocessing
Exploratory Data Analysis
Feature engineering
Machine Learning model training
Hyperparameter tuning
Model evaluation
FastAPI backend
Interactive web frontend
GitHub + Git LFS for model storage
🤖 Machine Learning Model

The project uses a Random Forest Classifier.

Model Performance
Metric	Score
Test Accuracy	85.37%
Macro F1-Score	74.21%
Best Cross-Validation Macro F1	72.92%

The model was tuned using RandomizedSearchCV with 3-fold cross-validation and f1_macro scoring.

📊 Dataset

The project uses the NYC Airbnb Open Data (AB_NYC_2019.csv) dataset.

The dataset contains information about Airbnb listings such as:

Location
Price
Minimum nights
Number of reviews
Reviews per month
Host listings count
Availability
Neighbourhood
Room type
🔢 Input Features

The prediction model uses the following features:

Numerical Features
Latitude
Longitude
Price
Minimum nights
Number of reviews
Reviews per month
Calculated host listings count
Availability 365
Categorical Features
Neighbourhood group
Neighbourhood
⚙️ Technologies Used
Machine Learning
Python
Pandas
NumPy
Scikit-learn
Joblib
Jupyter Notebook
Backend
FastAPI
Uvicorn
Frontend
HTML
CSS
JavaScript
Version Control
Git
GitHub
Git LFS
🔄 Project Workflow
NYC Airbnb Dataset
        ↓
Data Cleaning
        ↓
Data Preprocessing
        ↓
Feature Transformation
        ↓
Random Forest Classifier
        ↓
Hyperparameter Tuning
        ↓
Model Evaluation
        ↓
Save Trained Model
        ↓
FastAPI Backend
        ↓
Web Frontend
        ↓
Room Type Prediction
🧹 Data Preprocessing

The following preprocessing steps were performed:

Removed unnecessary columns such as ID and host information.
Filled missing reviews_per_month values with 0.
Reduced the effect of extreme values by clipping price and minimum_nights.
Numerical features were processed using:
Median imputation
Yeo-Johnson transformation
Standard scaling
Categorical features were processed using:
Most-frequent imputation
One-hot encoding
🌲 Random Forest

A Random Forest Classifier was selected for the classification task.

The model was trained with:

class_weight = balanced

Hyperparameters were optimized using RandomizedSearchCV.

Best Parameters
n_estimators = 100
min_samples_split = 2
max_depth = None
🌐 Web Application

The project includes a web interface where users can enter Airbnb listing details and receive a predicted room type.

The application also displays:

Predicted room type
Prediction confidence
Class probabilities
Listing summary
📁 Project Structure
nyc-airbnb-room-classification/
│
├── backend/
│   ├── main.py
│   └── room_type_model.pkl
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── notebooks/
│   └── nyc_airbnb_room_type_classification.ipynb
│
├── .gitignore
├── .gitattributes
└── README.md
🚀 How to Run
1. Clone the repository
git clone https://github.com/Karan07871/nyc_airbnb_room_type_prediction.git
cd nyc_airbnb_room_type_prediction
2. Install Python dependencies
pip install fastapi uvicorn scikit-learn pandas numpy joblib
3. Start the Backend

Open CMD inside the backend folder:

cd backend

Then run:

uvicorn main:app --reload

The API will run at:

http://127.0.0.1:8000

FastAPI documentation is available at:

http://127.0.0.1:8000/docs
4. Run the Frontend

Open:

frontend/index.html

in your browser.

Make sure the FastAPI backend is running before making predictions.

🔮 Future Improvements

Possible future improvements include:

Deploy the FastAPI backend online
Deploy the frontend online
Add interactive maps
Improve model performance
Add more Machine Learning models
Add feature importance visualization
Add automated model retraining
Improve mobile responsiveness
👨‍💻 Author

Karan Yadav

Computer Science & Engineering Student

⭐ If you find this project useful, feel free to explore the repository.