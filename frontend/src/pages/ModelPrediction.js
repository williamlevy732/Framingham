import React, { useState } from 'react';
import { Brain, Heart, AlertTriangle, CheckCircle, Calculator, Info, TrendingUp, User } from 'lucide-react';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ModelPrediction = () => {
  const [formData, setFormData] = useState({
    male: 0,
    age: 45,
    education: 2,
    currentSmoker: 0,
    cigsPerDay: 0,
    BPMeds: 0,
    prevalentStroke: 0,
    prevalentHyp: 0,
    diabetes: 0,
    totChol: 200,
    sysBP: 130,
    diaBP: 80,
    BMI: 25,
    heartRate: 70,
    glucose: 85
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.predictCHD(formData);
      setPrediction(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      male: 0,
      age: 45,
      education: 2,
      currentSmoker: 0,
      cigsPerDay: 0,
      BPMeds: 0,
      prevalentStroke: 0,
      prevalentHyp: 0,
      diabetes: 0,
      totChol: 200,
      sysBP: 130,
      diaBP: 80,
      BMI: 25,
      heartRate: 70,
      glucose: 85
    });
    setPrediction(null);
    setError(null);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'Moderate':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'High':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <Brain className="w-8 h-8 mr-3" />
          CHD Risk Prediction
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Use our trained logistic regression model to predict 10-year coronary heart disease risk based on patient characteristics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Information
            </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Demographics */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.male}
                      onChange={(e) => handleInputChange('male', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={0}>Female</option>
                      <option value={1}>Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education Level
                    </label>
                    <select
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={1}>Some High School</option>
                      <option value={2}>High School Graduate</option>
                      <option value={3}>Some College</option>
                      <option value={4}>College Graduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Lifestyle Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Smoker
                    </label>
                    <select
                      value={formData.currentSmoker}
                      onChange={(e) => handleInputChange('currentSmoker', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cigarettes Per Day
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.cigsPerDay}
                      onChange={(e) => handleInputChange('cigsPerDay', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Medical History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure Medication
                    </label>
                    <select
                      value={formData.BPMeds}
                      onChange={(e) => handleInputChange('BPMeds', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Stroke
                    </label>
                    <select
                      value={formData.prevalentStroke}
                      onChange={(e) => handleInputChange('prevalentStroke', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hypertension
                    </label>
                    <select
                      value={formData.prevalentHyp}
                      onChange={(e) => handleInputChange('prevalentHyp', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diabetes
                    </label>
                    <select
                      value={formData.diabetes}
                      onChange={(e) => handleInputChange('diabetes', parseInt(e.target.value))}
                      className="select"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Clinical Measurements */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Clinical Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Cholesterol (mg/dL)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="400"
                      value={formData.totChol}
                      onChange={(e) => handleInputChange('totChol', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      min="90"
                      max="250"
                      value={formData.sysBP}
                      onChange={(e) => handleInputChange('sysBP', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="150"
                      value={formData.diaBP}
                      onChange={(e) => handleInputChange('diaBP', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BMI
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="50"
                      step="0.1"
                      value={formData.BMI}
                      onChange={(e) => handleInputChange('BMI', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="150"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="300"
                      value={formData.glucose}
                      onChange={(e) => handleInputChange('glucose', parseFloat(e.target.value))}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>Predicting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Calculator className="w-4 h-4" />
                      <span>Predict CHD Risk</span>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Prediction Result */}
          {prediction && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Prediction Result
                </h2>
              </div>
              <div className="card-body">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-lg ${getRiskColor(prediction.risk_level)}`}>
                    {getRiskIcon(prediction.risk_level)}
                    <div>
                      <div className="text-2xl font-bold">{prediction.risk_level} Risk</div>
                      <div className="text-sm">
                        {(prediction.probability * 100).toFixed(1)}% probability
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">CHD Prediction</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {prediction.prediction === 1 ? 'Positive' : 'Negative'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Risk Probability</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {(prediction.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      Identified Risk Factors
                    </h3>
                    <div className="space-y-2">
                      {prediction.risk_factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-gray-700">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          )}

          {/* Model Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                About the Model
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Model Details</h3>
                  <p className="text-sm text-gray-600">
                    This prediction model uses logistic regression trained on the Framingham Heart Study dataset. 
                    It predicts the 10-year risk of coronary heart disease based on demographic, lifestyle, and clinical factors.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Important Notes</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• This is a statistical model for educational purposes only</li>
                    <li>• Results should not replace professional medical advice</li>
                    <li>• Model accuracy depends on data quality and completeness</li>
                    <li>• Consult healthcare providers for actual risk assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPrediction;