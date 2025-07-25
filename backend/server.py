import os
import uuid
import pickle
import joblib
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import pandas as pd
import numpy as np
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CHD Analysis API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:
    raise ValueError("MONGO_URL environment variable is not set")

client = MongoClient(MONGO_URL)
db = client.chd_analysis
patients_collection = db.patients

# Load the trained model and preprocessor
try:
    model = joblib.load("/app/model.pkl")
    preprocessor = joblib.load("/app/preprocessor.pkl")
    print("✅ Model and preprocessor loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    preprocessor = None

# Pydantic models
class Patient(BaseModel):
    id: str
    male: int
    age: int
    education: int
    currentSmoker: int
    cigsPerDay: float
    BPMeds: int
    prevalentStroke: int
    prevalentHyp: int
    diabetes: int
    totChol: float
    sysBP: float
    diaBP: float
    BMI: float
    heartRate: float
    glucose: float
    TenYearCHD: int

class PatientFilter(BaseModel):
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    bp_range: Optional[str] = None  # "low", "normal", "high"
    chd_status: Optional[int] = None  # 0 or 1
    gender: Optional[int] = None  # 0 or 1

class DatasetStats(BaseModel):
    total_patients: int
    chd_positive: int
    chd_negative: int
    age_range: dict
    bp_stats: dict
    key_variables: List[str]

class PredictionInput(BaseModel):
    male: int  # 0 for female, 1 for male
    age: int
    education: int  # 1-4 scale
    currentSmoker: int  # 0 or 1
    cigsPerDay: float
    BPMeds: int  # 0 or 1
    prevalentStroke: int  # 0 or 1
    prevalentHyp: int  # 0 or 1
    diabetes: int  # 0 or 1
    totChol: float
    sysBP: float
    diaBP: float
    BMI: float
    heartRate: float
    glucose: float

class PredictionResult(BaseModel):
    prediction: int  # 0 or 1
    probability: float  # probability of CHD
    risk_level: str  # "Low", "Moderate", "High"
    risk_factors: List[str]

@app.get("/")
async def root():
    return {"message": "CHD Analysis API"}

@app.get("/api/dataset/stats", response_model=DatasetStats)
async def get_dataset_stats():
    """Get overall dataset statistics"""
    try:
        total_patients = patients_collection.count_documents({})
        chd_positive = patients_collection.count_documents({"TenYearCHD": 1})
        chd_negative = patients_collection.count_documents({"TenYearCHD": 0})
        
        # Get age statistics
        age_pipeline = [
            {"$group": {
                "_id": None,
                "min_age": {"$min": "$age"},
                "max_age": {"$max": "$age"},
                "avg_age": {"$avg": "$age"}
            }}
        ]
        age_stats = list(patients_collection.aggregate(age_pipeline))
        
        # Get BP statistics
        bp_pipeline = [
            {"$group": {
                "_id": None,
                "min_sys_bp": {"$min": "$sysBP"},
                "max_sys_bp": {"$max": "$sysBP"},
                "avg_sys_bp": {"$avg": "$sysBP"}
            }}
        ]
        bp_stats = list(patients_collection.aggregate(bp_pipeline))
        
        return DatasetStats(
            total_patients=total_patients,
            chd_positive=chd_positive,
            chd_negative=chd_negative,
            age_range={
                "min": int(age_stats[0]["min_age"]) if age_stats else 0,
                "max": int(age_stats[0]["max_age"]) if age_stats else 0,
                "avg": round(age_stats[0]["avg_age"], 1) if age_stats else 0
            },
            bp_stats={
                "min": round(bp_stats[0]["min_sys_bp"], 1) if bp_stats else 0,
                "max": round(bp_stats[0]["max_sys_bp"], 1) if bp_stats else 0,
                "avg": round(bp_stats[0]["avg_sys_bp"], 1) if bp_stats else 0
            },
            key_variables=["age", "sysBP", "diaBP", "BMI", "totChol", "heartRate", "glucose"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/patients", response_model=List[Patient])
async def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    age_min: Optional[int] = Query(None, ge=0),
    age_max: Optional[int] = Query(None, le=120),
    bp_range: Optional[str] = Query(None, pattern="^(low|normal|high)$"),
    chd_status: Optional[int] = Query(None, ge=0, le=1),
    gender: Optional[int] = Query(None, ge=0, le=1),
    search: Optional[str] = Query(None)
):
    """Get patients with optional filtering"""
    try:
        # Build filter query
        filter_query = {}
        
        if age_min is not None:
            filter_query["age"] = {"$gte": age_min}
        if age_max is not None:
            if "age" in filter_query:
                filter_query["age"]["$lte"] = age_max
            else:
                filter_query["age"] = {"$lte": age_max}
                
        if bp_range:
            if bp_range == "low":
                filter_query["sysBP"] = {"$lt": 120}
            elif bp_range == "normal":
                filter_query["sysBP"] = {"$gte": 120, "$lt": 140}
            elif bp_range == "high":
                filter_query["sysBP"] = {"$gte": 140}
                
        if chd_status is not None:
            filter_query["TenYearCHD"] = chd_status
            
        if gender is not None:
            filter_query["male"] = gender
            
        patients = list(patients_collection.find(filter_query).skip(skip).limit(limit))
        
        # Convert MongoDB documents to Patient models
        patient_list = []
        for patient in patients:
            patient_dict = dict(patient)
            patient_dict["id"] = str(patient_dict.pop("_id"))
            patient_list.append(Patient(**patient_dict))
            
        return patient_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/visualizations/blood-pressure-distribution")
async def get_bp_distribution():
    """Get blood pressure distribution data for KDE plot"""
    try:
        pipeline = [
            {"$group": {
                "_id": "$TenYearCHD",
                "bp_values": {"$push": "$sysBP"}
            }}
        ]
        
        result = list(patients_collection.aggregate(pipeline))
        
        data = {}
        for group in result:
            chd_status = "CHD" if group["_id"] == 1 else "No CHD"
            data[chd_status] = group["bp_values"]
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/visualizations/blood-pressure-boxplot")
async def get_bp_boxplot():
    """Get blood pressure boxplot data"""
    try:
        pipeline = [
            {"$group": {
                "_id": "$TenYearCHD",
                "values": {"$push": "$sysBP"}
            }}
        ]
        
        result = list(patients_collection.aggregate(pipeline))
        
        data = {}
        for group in result:
            chd_status = "CHD" if group["_id"] == 1 else "No CHD"
            values = group["values"]
            
            # Calculate quartiles and outliers
            q1 = np.percentile(values, 25)
            q2 = np.percentile(values, 50)
            q3 = np.percentile(values, 75)
            iqr = q3 - q1
            
            # Outliers are beyond 1.5 * IQR
            outliers = [v for v in values if v < q1 - 1.5 * iqr or v > q3 + 1.5 * iqr]
            
            data[chd_status] = {
                "q1": q1,
                "q2": q2,
                "q3": q3,
                "min": min([v for v in values if v >= q1 - 1.5 * iqr]),
                "max": max([v for v in values if v <= q3 + 1.5 * iqr]),
                "outliers": outliers
            }
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/visualizations/age-histogram")
async def get_age_histogram():
    """Get age histogram data"""
    try:
        pipeline = [
            {"$group": {
                "_id": None,
                "ages": {"$push": "$age"}
            }}
        ]
        
        result = list(patients_collection.aggregate(pipeline))
        ages = result[0]["ages"] if result else []
        
        # Create histogram bins
        hist, bins = np.histogram(ages, bins=20)
        
        return {
            "counts": hist.tolist(),
            "bins": bins.tolist(),
            "stats": {
                "mean": np.mean(ages),
                "std": np.std(ages),
                "skewness": float(pd.Series(ages).skew()),
                "total": len(ages)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/visualizations/violin-plot")
async def get_violin_plot():
    """Get violin plot data for CHD vs non-CHD comparison"""
    try:
        pipeline = [
            {"$group": {
                "_id": "$TenYearCHD",
                "sysBP": {"$push": "$sysBP"},
                "age": {"$push": "$age"},
                "BMI": {"$push": "$BMI"}
            }}
        ]
        
        result = list(patients_collection.aggregate(pipeline))
        
        data = {}
        for group in result:
            chd_status = "CHD" if group["_id"] == 1 else "No CHD"
            data[chd_status] = {
                "sysBP": group["sysBP"],
                "age": group["age"],
                "BMI": group["BMI"]
            }
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict", response_model=PredictionResult)
async def predict_chd(input_data: PredictionInput):
    """Predict CHD risk using the trained model"""
    try:
        if model is None or preprocessor is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data.dict()])
        
        # Preprocess the input
        processed_input = preprocessor.transform(input_df)
        
        # Make prediction
        prediction = model.predict(processed_input)[0]
        probability = model.predict_proba(processed_input)[0][1]  # Probability of CHD (class 1)
        
        # Determine risk level
        if probability < 0.3:
            risk_level = "Low"
        elif probability < 0.7:
            risk_level = "Moderate"
        else:
            risk_level = "High"
        
        # Identify risk factors
        risk_factors = []
        if input_data.age > 60:
            risk_factors.append("Advanced age (>60 years)")
        if input_data.sysBP > 140:
            risk_factors.append("High blood pressure (>140 mmHg)")
        if input_data.currentSmoker == 1:
            risk_factors.append("Current smoker")
        if input_data.diabetes == 1:
            risk_factors.append("Diabetes")
        if input_data.totChol > 240:
            risk_factors.append("High cholesterol (>240 mg/dL)")
        if input_data.BMI > 30:
            risk_factors.append("Obesity (BMI >30)")
        if input_data.prevalentHyp == 1:
            risk_factors.append("Hypertension")
        if input_data.male == 1 and input_data.age > 45:
            risk_factors.append("Male over 45 years")
        elif input_data.male == 0 and input_data.age > 55:
            risk_factors.append("Female over 55 years")
        
        return PredictionResult(
            prediction=int(prediction),
            probability=round(probability, 4),
            risk_level=risk_level,
            risk_factors=risk_factors
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/api/model/info")
async def get_model_info():
    """Get information about the loaded model"""
    try:
        if model is None or preprocessor is None:
            return {"status": "error", "message": "Model not loaded"}
        
        return {
            "status": "loaded",
            "model_type": str(type(model).__name__),
            "preprocessor_type": str(type(preprocessor).__name__),
            "feature_names": list(preprocessor.feature_names_in_) if hasattr(preprocessor, 'feature_names_in_') else None,
            "model_params": model.get_params() if hasattr(model, 'get_params') else None
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/import-data")
async def import_data():
    """Import data from CSV file"""
    try:
        # Check if data already exists
        if patients_collection.count_documents({}) > 0:
            return {"message": "Data already imported", "count": patients_collection.count_documents({})}
        
        # Read CSV file
        df = pd.read_csv("/app/framingham.csv", skipinitialspace=True)
        
        # Remove any empty columns (caused by trailing comma)
        df = df.dropna(axis=1, how='all')
        
        # Clean the data - only drop rows with missing key fields
        df = df.dropna(subset=['male', 'age', 'sysBP', 'TenYearCHD'])
        
        # Fill missing values with appropriate defaults
        df = df.fillna({
            'education': 0,
            'cigsPerDay': 0,
            'BPMeds': 0,
            'totChol': df['totChol'].median(),
            'BMI': df['BMI'].median(),
            'heartRate': df['heartRate'].median(),
            'glucose': df['glucose'].median()
        })
        
        # Check if DataFrame is empty
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file is empty or could not be read")
        
        # Convert to records and add IDs
        records = []
        for _, row in df.iterrows():
            record = row.to_dict()
            record["_id"] = str(uuid.uuid4())
            records.append(record)
        
        # Validate that we have records
        if not records:
            raise HTTPException(status_code=400, detail="No valid records found in CSV file")
        
        # Insert into MongoDB
        result = patients_collection.insert_many(records)
        
        return {"message": "Data imported successfully", "count": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)