import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Activity, Eye, Info } from 'lucide-react';

const Visualizations = () => {
  const [activeTab, setActiveTab] = useState('age-education');

  const visualizations = [
    {
      id: 'age-education',
      title: 'Age and Education Level of CHD Patients',
      image: '/viz2.png',
      description: 'Analysis of age and education level patterns in the first 200 CHD patients',
      insights: [
        'Higher education levels tend to correlate with better health outcomes',
        'Age distribution shows predominance in middle-aged to elderly patients',
        'Educational attainment varies significantly across age groups'
      ],
      patterns: 'The visualization reveals important demographic patterns in CHD patients, with education level serving as a potential socioeconomic indicator for cardiovascular health.'
    },
    {
      id: 'age-education-smokers',
      title: 'Age and Education Level - Smokers Highlighted',
      image: '/viz1.png',
      description: 'Same analysis with smoking status highlighted to show the impact of tobacco use',
      insights: [
        'Smokers are distributed across all age and education levels',
        'Smoking habits show correlation with both age and educational background',
        'Highlighted patterns reveal smoking as a significant risk factor'
      ],
      patterns: 'The smoking overlay demonstrates how tobacco use intersects with demographic factors, providing insights into lifestyle-related cardiovascular risk.'
    },
    {
      id: 'chd-education',
      title: 'CHD Incidence by Education Level',
      image: '/viz3.png',
      description: 'Distribution of coronary heart disease cases across different education levels',
      insights: [
        'Clear inverse relationship between education level and CHD incidence',
        'Higher education associated with lower CHD rates',
        'Socioeconomic factors play a significant role in cardiovascular health'
      ],
      patterns: 'This visualization highlights the importance of education as a predictor of health outcomes, likely reflecting access to healthcare, health literacy, and lifestyle factors.'
    }
  ];

  const tabs = [
    { id: 'age-education', label: 'Age & Education', icon: Activity },
    { id: 'age-education-smokers', label: 'Smokers Analysis', icon: TrendingUp },
    { id: 'chd-education', label: 'CHD by Education', icon: BarChart3 }
  ];

  const currentViz = visualizations.find(v => v.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Visualization Gallery</h1>
          <p className="text-gray-600 mt-1">
            Explore comprehensive visualizations from the CHD data analysis
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
        {/* Visualization Image */}
        <div className="lg:col-span-2">
          <div className="visualization-container">
            <h3 className="text-lg font-semibold mb-4">{currentViz.title}</h3>
            <div className="bg-white rounded-lg shadow-md p-4">
              <img 
                src={currentViz.image} 
                alt={currentViz.title}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-8 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Visualization image not available</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{currentViz.description}</p>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Analysis Insights
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Key Observations:</h4>
                  <ul className="space-y-2">
                    {currentViz.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Patterns Identified:</h4>
                  <p className="text-sm text-gray-600">
                    {currentViz.patterns}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Methodology Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Methodology</h3>
            </div>
            <div className="card-body">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Source:</span>
                  <span className="font-medium">Framingham Heart Study</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Analysis Tool:</span>
                  <span className="font-medium">Python/Jupyter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Visualization:</span>
                  <span className="font-medium">Matplotlib/Seaborn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sample Size:</span>
                  <span className="font-medium">4,238 patients</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Helper */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">What's Next?</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span>Use the tabs above to explore different visualizations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span>Each chart reveals different aspects of the data</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>Look for patterns in the key observations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;