import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, TrendingUp, Activity, ArrowRight, Database, BarChart3 } from 'lucide-react';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [datasetStats, setDatasetStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDatasetStats();
  }, []);

  const loadDatasetStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to import data first
      await apiService.importData();
      
      // Then get stats
      const stats = await apiService.getDatasetStats();
      setDatasetStats(stats);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dataset statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dataset statistics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDatasetStats} />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-pink-300" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            CHD Data Analysis Journey
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Exploring Coronary Heart Disease patterns through comprehensive data analysis
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/exploration"
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>Explore Data</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/visualizations"
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Visualizations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dataset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card total-patients">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-white">
                {datasetStats?.total_patients?.toLocaleString() || '0'}
              </p>
            </div>
            <Users className="w-8 h-8 text-white/70" />
          </div>
        </div>

        <div className="stat-card chd-positive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">CHD Positive</p>
              <p className="text-3xl font-bold text-white">
                {datasetStats?.chd_positive?.toLocaleString() || '0'}
              </p>
              <p className="text-white/60 text-xs">
                {datasetStats?.total_patients ? 
                  `${((datasetStats.chd_positive / datasetStats.total_patients) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </p>
            </div>
            <Heart className="w-8 h-8 text-white/70" />
          </div>
        </div>

        <div className="stat-card chd-negative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">CHD Negative</p>
              <p className="text-3xl font-bold text-white">
                {datasetStats?.chd_negative?.toLocaleString() || '0'}
              </p>
              <p className="text-white/60 text-xs">
                {datasetStats?.total_patients ? 
                  `${((datasetStats.chd_negative / datasetStats.total_patients) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </p>
            </div>
            <Activity className="w-8 h-8 text-white/70" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Age Range</p>
              <p className="text-3xl font-bold text-white">
                {datasetStats?.age_range?.min || '0'} - {datasetStats?.age_range?.max || '0'}
              </p>
              <p className="text-white/60 text-xs">
                Avg: {datasetStats?.age_range?.avg || '0'} years
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </div>

      {/* Dataset Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-800">Dataset Overview</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Purpose of Analysis</h3>
                <p className="text-gray-600">
                  This analysis explores the Framingham Heart Study dataset to identify patterns 
                  and risk factors associated with Coronary Heart Disease (CHD). We examine various 
                  demographic, lifestyle, and clinical variables to understand their relationship 
                  with CHD development.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Key Research Questions</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• How does blood pressure correlate with CHD risk?</li>
                  <li>• What are the age-related patterns in CHD diagnosis?</li>
                  <li>• Which demographic factors show the strongest associations?</li>
                  <li>• What outliers exist in the clinical measurements?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-800">Key Variables</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {datasetStats?.key_variables?.map((variable, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {variable.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Blood Pressure Range:</strong> {datasetStats?.bp_stats?.min || '0'} - {datasetStats?.bp_stats?.max || '0'} mmHg
                <br />
                <strong>Average:</strong> {datasetStats?.bp_stats?.avg || '0'} mmHg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/exploration"
          className="card hover:shadow-lg transition-shadow duration-300 group"
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8 text-blue-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Exploration</h3>
            <p className="text-gray-600 text-sm">
              Search, filter, and explore the CHD dataset with interactive tools. 
              Filter by age, blood pressure, and CHD diagnosis.
            </p>
          </div>
        </Link>

        <Link
          to="/visualizations"
          className="card hover:shadow-lg transition-shadow duration-300 group"
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Visualizations</h3>
            <p className="text-gray-600 text-sm">
              Explore comprehensive visualizations including KDE plots, boxplots, 
              histograms, and violin plots with detailed insights.
            </p>
          </div>
        </Link>

        <Link
          to="/conclusion"
          className="card hover:shadow-lg transition-shadow duration-300 group"
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-red-600" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Conclusion</h3>
            <p className="text-gray-600 text-sm">
              Review key findings, insights, and implications from the CHD data analysis. 
              Understand the clinical significance.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;