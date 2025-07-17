import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Activity, Eye, Info } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ScatterPlot, Scatter, 
  AreaChart, Area, ComposedChart, Legend
} from 'recharts';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Visualizations = () => {
  const [activeTab, setActiveTab] = useState('kde');
  const [visualizationData, setVisualizationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVisualizationData();
  }, []);

  const loadVisualizationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [bpDistribution, bpBoxplot, ageHistogram, violinPlot] = await Promise.all([
        apiService.getBloodPressureDistribution(),
        apiService.getBloodPressureBoxplot(),
        apiService.getAgeHistogram(),
        apiService.getViolinPlot()
      ]);

      setVisualizationData({
        bpDistribution,
        bpBoxplot,
        ageHistogram,
        violinPlot
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load visualization data');
    } finally {
      setLoading(false);
    }
  };

  const processKDEData = (data) => {
    if (!data || !data.CHD || !data['No CHD']) return [];
    
    const chdValues = data.CHD.sort((a, b) => a - b);
    const noChdValues = data['No CHD'].sort((a, b) => a - b);
    
    const minValue = Math.min(...chdValues, ...noChdValues);
    const maxValue = Math.max(...chdValues, ...noChdValues);
    
    const result = [];
    for (let i = minValue; i <= maxValue; i += 5) {
      const chdCount = chdValues.filter(v => v >= i && v < i + 5).length;
      const noChdCount = noChdValues.filter(v => v >= i && v < i + 5).length;
      
      result.push({
        bloodPressure: i,
        CHD: chdCount,
        'No CHD': noChdCount
      });
    }
    
    return result;
  };

  const processBoxplotData = (data) => {
    if (!data || !data.CHD || !data['No CHD']) return [];
    
    return [
      {
        category: 'No CHD',
        q1: data['No CHD'].q1,
        q2: data['No CHD'].q2,
        q3: data['No CHD'].q3,
        min: data['No CHD'].min,
        max: data['No CHD'].max,
        outliers: data['No CHD'].outliers.length
      },
      {
        category: 'CHD',
        q1: data.CHD.q1,
        q2: data.CHD.q2,
        q3: data.CHD.q3,
        min: data.CHD.min,
        max: data.CHD.max,
        outliers: data.CHD.outliers.length
      }
    ];
  };

  const processHistogramData = (data) => {
    if (!data || !data.counts || !data.bins) return [];
    
    const result = [];
    for (let i = 0; i < data.counts.length; i++) {
      result.push({
        ageRange: `${Math.round(data.bins[i])}-${Math.round(data.bins[i + 1])}`,
        count: data.counts[i],
        frequency: (data.counts[i] / data.stats.total * 100).toFixed(1)
      });
    }
    
    return result;
  };

  const processViolinData = (data) => {
    if (!data || !data.CHD || !data['No CHD']) return [];
    
    const result = [];
    
    // Process blood pressure data
    const chdBP = data.CHD.sysBP;
    const noChdBP = data['No CHD'].sysBP;
    
    const bpRanges = [
      { range: '<120', label: 'Normal' },
      { range: '120-139', label: 'Elevated' },
      { range: '140-159', label: 'Stage 1' },
      { range: '≥160', label: 'Stage 2' }
    ];
    
    bpRanges.forEach(range => {
      let chdCount = 0;
      let noChdCount = 0;
      
      if (range.range === '<120') {
        chdCount = chdBP.filter(bp => bp < 120).length;
        noChdCount = noChdBP.filter(bp => bp < 120).length;
      } else if (range.range === '120-139') {
        chdCount = chdBP.filter(bp => bp >= 120 && bp < 140).length;
        noChdCount = noChdBP.filter(bp => bp >= 120 && bp < 140).length;
      } else if (range.range === '140-159') {
        chdCount = chdBP.filter(bp => bp >= 140 && bp < 160).length;
        noChdCount = noChdBP.filter(bp => bp >= 140 && bp < 160).length;
      } else if (range.range === '≥160') {
        chdCount = chdBP.filter(bp => bp >= 160).length;
        noChdCount = noChdBP.filter(bp => bp >= 160).length;
      }
      
      result.push({
        category: range.label,
        CHD: chdCount,
        'No CHD': noChdCount
      });
    });
    
    return result;
  };

  const tabs = [
    { id: 'kde', label: 'KDE Plot', icon: Activity },
    { id: 'boxplot', label: 'Boxplot', icon: BarChart3 },
    { id: 'histogram', label: 'Histogram', icon: TrendingUp },
    { id: 'violin', label: 'Violin Plot', icon: Eye }
  ];

  const insights = {
    kde: {
      title: "Blood Pressure Distribution Analysis",
      observations: [
        "Clear difference in blood pressure distributions between CHD and non-CHD groups",
        "CHD patients show higher average systolic blood pressure",
        "Distribution overlap suggests blood pressure as a risk factor, not absolute predictor"
      ],
      patterns: "CHD patients tend to cluster in higher blood pressure ranges, particularly above 140 mmHg"
    },
    boxplot: {
      title: "Blood Pressure Outlier Analysis",
      observations: [
        "CHD group shows higher median blood pressure values",
        "Significant outliers present in both groups",
        "Wider interquartile range in CHD patients indicates greater variability"
      ],
      patterns: "Outliers in blood pressure measurements may represent extreme cases or measurement errors"
    },
    histogram: {
      title: "Age Distribution and Skewness",
      observations: [
        `Age distribution shows ${visualizationData.ageHistogram?.stats?.skewness > 0 ? 'right' : 'left'} skewness`,
        `Mean age: ${visualizationData.ageHistogram?.stats?.mean?.toFixed(1)} years`,
        `Standard deviation: ${visualizationData.ageHistogram?.stats?.std?.toFixed(1)} years`
      ],
      patterns: "Age distribution provides insights into the demographic composition of the study population"
    },
    violin: {
      title: "CHD vs Non-CHD Group Comparison",
      observations: [
        "Distinct patterns emerge when comparing CHD positive vs negative groups",
        "Blood pressure categories show differential CHD risk",
        "Stage 1 and Stage 2 hypertension show higher CHD prevalence"
      ],
      patterns: "Progressive increase in CHD risk with increasing blood pressure categories"
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading visualization data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadVisualizationData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Visualization Gallery</h1>
          <p className="text-gray-600 mt-1">
            Interactive charts and plots showing patterns in the CHD dataset
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-container">
        <div className="flex space-x-0 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visualization Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="visualization-container">
            {activeTab === 'kde' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Blood Pressure Distribution (KDE Plot)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={processKDEData(visualizationData.bpDistribution)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="bloodPressure" 
                      label={{ value: 'Systolic Blood Pressure (mmHg)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `Blood Pressure: ${label} mmHg`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="No CHD"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="CHD"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'boxplot' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Blood Pressure Boxplot Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={processBoxplotData(visualizationData.bpBoxplot)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis 
                      label={{ value: 'Systolic Blood Pressure (mmHg)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="q1" fill="#e5e7eb" name="Q1" />
                    <Bar dataKey="q2" fill="#9ca3af" name="Median" />
                    <Bar dataKey="q3" fill="#6b7280" name="Q3" />
                    <Line type="monotone" dataKey="outliers" stroke="#ef4444" name="Outliers" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'histogram' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Age Distribution Histogram</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={processHistogramData(visualizationData.ageHistogram)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="ageRange" 
                      label={{ value: 'Age Range (years)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'count' ? 'Count' : 'Frequency %']}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'violin' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">CHD vs Non-CHD Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={processViolinData(visualizationData.violinPlot)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis 
                      label={{ value: 'Number of Patients', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="No CHD" fill="#10b981" name="No CHD" />
                    <Bar dataKey="CHD" fill="#ef4444" name="CHD" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Insights Panel */}
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold flex items-center">
                <Info className="w-5 h-5 mr-2" />
                {insights[activeTab]?.title}
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Key Observations:</h4>
                  <ul className="space-y-2">
                    {insights[activeTab]?.observations.map((obs, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Patterns Identified:</h4>
                  <p className="text-sm text-gray-600">
                    {insights[activeTab]?.patterns}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          {activeTab === 'histogram' && visualizationData.ageHistogram && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Age Statistics</h3>
              </div>
              <div className="card-body">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mean Age:</span>
                    <span className="font-medium">{visualizationData.ageHistogram.stats.mean?.toFixed(1)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Standard Deviation:</span>
                    <span className="font-medium">{visualizationData.ageHistogram.stats.std?.toFixed(1)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Skewness:</span>
                    <span className={`font-medium ${visualizationData.ageHistogram.stats.skewness > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                      {visualizationData.ageHistogram.stats.skewness?.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Patients:</span>
                    <span className="font-medium">{visualizationData.ageHistogram.stats.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizations;