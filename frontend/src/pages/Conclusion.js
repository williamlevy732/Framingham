import React from 'react';
import { Heart, TrendingUp, Users, AlertTriangle, CheckCircle, XCircle, ArrowRight, FileText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Conclusion = () => {
  const keyFindings = [
    {
      icon: Heart,
      title: "Blood Pressure as Key Risk Factor",
      description: "Higher systolic blood pressure levels are strongly associated with increased CHD risk, with Stage 1 and Stage 2 hypertension showing progressively higher CHD prevalence.",
      type: "critical"
    },
    {
      icon: TrendingUp,
      title: "Age-Related CHD Patterns",
      description: "CHD risk increases with age, with the highest prevalence observed in patients over 60 years old, reflecting natural aging processes on cardiovascular health.",
      type: "important"
    },
    {
      icon: Users,
      title: "Demographic Variations",
      description: "Gender differences exist in CHD presentation, with distinct patterns in risk factor distributions between male and female patients in the dataset.",
      type: "informative"
    },
    {
      icon: AlertTriangle,
      title: "Outlier Identification",
      description: "Significant outliers in blood pressure measurements highlight the importance of data quality control and potential extreme physiological cases.",
      type: "warning"
    }
  ];

  const clinicalImplications = [
    {
      title: "Preventive Healthcare",
      description: "Early identification and management of hypertension can significantly reduce CHD risk.",
      recommendations: [
        "Regular blood pressure monitoring for all patients",
        "Lifestyle interventions for pre-hypertensive patients",
        "Pharmacological treatment when appropriate"
      ]
    },
    {
      title: "Risk Stratification",
      description: "Multi-factor risk assessment combining age, blood pressure, and other clinical variables.",
      recommendations: [
        "Develop comprehensive risk scoring systems",
        "Implement age-specific screening protocols",
        "Consider gender-specific risk factors"
      ]
    },
    {
      title: "Population Health",
      description: "Understanding demographic patterns helps in designing targeted public health interventions.",
      recommendations: [
        "Age-targeted health education programs",
        "Community-based hypertension screening",
        "Healthcare resource allocation planning"
      ]
    }
  ];

  const dataQuality = [
    {
      aspect: "Dataset Completeness",
      status: "good",
      description: "Comprehensive patient records with minimal missing data points"
    },
    {
      aspect: "Variable Representation",
      status: "excellent",
      description: "All key cardiovascular risk factors well represented in the dataset"
    },
    {
      aspect: "Sample Size",
      status: "good",
      description: "Adequate sample size for statistical analysis and pattern identification"
    },
    {
      aspect: "Outlier Handling",
      status: "attention",
      description: "Some extreme values present that may require clinical validation"
    }
  ];

  const futureDirections = [
    "Longitudinal follow-up studies to track CHD progression",
    "Integration with genetic markers for personalized risk assessment",
    "Machine learning models for improved risk prediction",
    "Real-time monitoring systems for preventive interventions"
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'attention':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getInsightTypeColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'important':
        return 'border-orange-500 bg-orange-50';
      case 'informative':
        return 'border-blue-500 bg-blue-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Analysis Conclusion</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Summary of key findings, insights, and clinical implications from the CHD data analysis
        </p>
      </div>

      {/* Key Findings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Key Findings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keyFindings.map((finding, index) => {
            const Icon = finding.icon;
            return (
              <div key={index} className={`insight-card ${getInsightTypeColor(finding.type)}`}>
                <div className="flex items-start space-x-3">
                  <Icon className="w-6 h-6 text-gray-700 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">{finding.title}</h3>
                    <p className="text-gray-600 text-sm">{finding.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Implications */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Heart className="w-6 h-6 mr-2" />
          Clinical Implications
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {clinicalImplications.map((implication, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-800">{implication.title}</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-600 mb-4">{implication.description}</p>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {implication.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Assessment */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Data Quality Assessment
        </h2>
        
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataQuality.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.aspect}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {getStatusIcon(item.status)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Statistical Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15.24%</div>
              <p className="text-gray-600">Overall CHD Prevalence</p>
              <p className="text-xs text-gray-500 mt-1">
                Consistent with epidemiological studies
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">133.4</div>
              <p className="text-gray-600">Average Systolic BP (mmHg)</p>
              <p className="text-xs text-gray-500 mt-1">
                Slightly elevated from normal range
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">49.6</div>
              <p className="text-gray-600">Average Age (years)</p>
              <p className="text-xs text-gray-500 mt-1">
                Middle-aged population focus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Directions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Future Directions
        </h2>
        
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {futureDirections.map((direction, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{direction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Explore the Data Further</h2>
        <p className="text-blue-100 mb-6">
          Dive deeper into the analysis by exploring the interactive visualizations and data filtering tools.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/exploration"
            className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Explore Data</span>
          </Link>
          <Link
            to="/visualizations"
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span>View Charts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Conclusion;