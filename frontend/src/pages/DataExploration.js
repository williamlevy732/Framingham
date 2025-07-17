import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Users, Heart, Activity, SortAsc, SortDesc } from 'lucide-react';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DataExploration = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    age_min: '',
    age_max: '',
    bp_range: '',
    chd_status: '',
    gender: '',
    skip: 0,
    limit: 50
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, [filters]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const patientsData = await apiService.getPatients(filters);
      setPatients(patientsData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load patients data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      skip: 0 // Reset pagination when filtering
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedPatients = [...patients].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setPatients(sortedPatients);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <SortAsc className="w-4 h-4 ml-1" /> : 
      <SortDesc className="w-4 h-4 ml-1" />;
  };

  const getBloodPressureCategory = (sysBP) => {
    if (sysBP < 120) return { category: 'Normal', color: 'text-green-600' };
    if (sysBP < 140) return { category: 'Elevated', color: 'text-yellow-600' };
    return { category: 'High', color: 'text-red-600' };
  };

  const getAgeCategory = (age) => {
    if (age < 40) return 'Young Adult';
    if (age < 60) return 'Middle Age';
    return 'Elderly';
  };

  const clearFilters = () => {
    setFilters({
      age_min: '',
      age_max: '',
      bp_range: '',
      chd_status: '',
      gender: '',
      skip: 0,
      limit: 50
    });
    setSearchTerm('');
  };

  const loadMore = () => {
    setFilters(prev => ({
      ...prev,
      skip: prev.skip + prev.limit
    }));
  };

  if (loading && patients.length === 0) {
    return <LoadingSpinner size="large" text="Loading patient data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadPatients} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data Exploration</h1>
          <p className="text-gray-600 mt-1">
            Search and filter the CHD dataset to explore patient records
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <Users className="w-4 h-4" />
            <span>{patients.length} patients</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.age_min}
                onChange={(e) => handleFilterChange('age_min', e.target.value)}
                className="input text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.age_max}
                onChange={(e) => handleFilterChange('age_max', e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          {/* Blood Pressure Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Pressure
            </label>
            <select
              value={filters.bp_range}
              onChange={(e) => handleFilterChange('bp_range', e.target.value)}
              className="select text-sm"
            >
              <option value="">All Ranges</option>
              <option value="low">Low (&lt;120)</option>
              <option value="normal">Normal (120-139)</option>
              <option value="high">High (≥140)</option>
            </select>
          </div>

          {/* CHD Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CHD Diagnosis
            </label>
            <select
              value={filters.chd_status}
              onChange={(e) => handleFilterChange('chd_status', e.target.value)}
              className="select text-sm"
            >
              <option value="">All Patients</option>
              <option value="1">CHD Positive</option>
              <option value="0">CHD Negative</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="select text-sm"
            >
              <option value="">All Genders</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          {/* Results per page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Results per page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="select text-sm"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Patient ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('age')}
                >
                  <div className="flex items-center">
                    Age
                    {getSortIcon('age')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('male')}
                >
                  <div className="flex items-center">
                    Gender
                    {getSortIcon('male')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sysBP')}
                >
                  <div className="flex items-center">
                    Blood Pressure
                    {getSortIcon('sysBP')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('BMI')}
                >
                  <div className="flex items-center">
                    BMI
                    {getSortIcon('BMI')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totChol')}
                >
                  <div className="flex items-center">
                    Total Cholesterol
                    {getSortIcon('totChol')}
                  </div>
                </th>
                <th 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('TenYearCHD')}
                >
                  <div className="flex items-center">
                    CHD Status
                    {getSortIcon('TenYearCHD')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                const bpCategory = getBloodPressureCategory(patient.sysBP);
                return (
                  <tr key={patient.id}>
                    <td className="font-mono text-sm">
                      {patient.id.substring(0, 8)}...
                    </td>
                    <td>
                      <div>
                        <span className="font-medium">{patient.age}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({getAgeCategory(patient.age)})
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${patient.male ? 'badge-info' : 'badge-warning'}`}>
                        {patient.male ? 'Male' : 'Female'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="font-medium">{patient.sysBP}</span>
                        <span className="text-xs text-gray-500">/{patient.diaBP}</span>
                        <div className={`text-xs ${bpCategory.color}`}>
                          {bpCategory.category}
                        </div>
                      </div>
                    </td>
                    <td>{patient.BMI.toFixed(1)}</td>
                    <td>{patient.totChol}</td>
                    <td>
                      <span className={`badge ${patient.TenYearCHD ? 'badge-error' : 'badge-success'}`}>
                        {patient.TenYearCHD ? 'CHD Positive' : 'CHD Negative'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {patients.length === filters.limit && (
          <div className="p-4 text-center border-t">
            <button
              onClick={loadMore}
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CHD Positive Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {patients.length > 0 ? 
                    `${((patients.filter(p => p.TenYearCHD === 1).length / patients.length) * 100).toFixed(1)}%` : 
                    '0%'
                  }
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Age</p>
                <p className="text-2xl font-bold text-blue-600">
                  {patients.length > 0 ? 
                    `${(patients.reduce((sum, p) => sum + p.age, 0) / patients.length).toFixed(1)}` : 
                    '0'
                  } years
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Blood Pressure</p>
                <p className="text-2xl font-bold text-green-600">
                  {patients.length > 0 ? 
                    `${(patients.reduce((sum, p) => sum + p.sysBP, 0) / patients.length).toFixed(1)}` : 
                    '0'
                  } mmHg
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExploration;