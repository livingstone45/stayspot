import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { usePermissions } from './PermissionContext';

const PropertyContext = createContext();

const initialState = {
  properties: [],
  currentProperty: null,
  selectedProperties: [],
  units: [],
  tenants: [],
  maintenanceRequests: [],
  leases: [],
  applications: [],
  inspections: [],
  documents: [],
  analytics: {},
  loading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    location: 'all',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  cache: {},
  lastUpdated: null,
  realTimeUpdates: true,
  bulkOperations: {
    selected: [],
    operation: null,
    progress: 0
  }
};

const propertyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload.properties,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      };
    
    case 'ADD_PROPERTY':
      return {
        ...state,
        properties: [action.payload, ...state.properties],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        }
      };
    
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(property =>
          property.id === action.payload.id ? action.payload : property
        ),
        currentProperty: state.currentProperty?.id === action.payload.id 
          ? action.payload 
          : state.currentProperty
      };
    
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(property => property.id !== action.payload),
        currentProperty: state.currentProperty?.id === action.payload ? null : state.currentProperty,
        selectedProperties: state.selectedProperties.filter(id => id !== action.payload),
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1)
        }
      };
    
    case 'SET_CURRENT_PROPERTY':
      return { ...state, currentProperty: action.payload };
    
    case 'SET_SELECTED_PROPERTIES':
      return { ...state, selectedProperties: action.payload };
    
    case 'SET_UNITS':
      return { ...state, units: action.payload, loading: false };
    
    case 'ADD_UNIT':
      return { ...state, units: [action.payload, ...state.units] };
    
    case 'UPDATE_UNIT':
      return {
        ...state,
        units: state.units.map(unit =>
          unit.id === action.payload.id ? action.payload : unit
        )
      };
    
    case 'DELETE_UNIT':
      return {
        ...state,
        units: state.units.filter(unit => unit.id !== action.payload)
      };
    
    case 'SET_TENANTS':
      return { ...state, tenants: action.payload, loading: false };
    
    case 'ADD_TENANT':
      return { ...state, tenants: [action.payload, ...state.tenants] };
    
    case 'UPDATE_TENANT':
      return {
        ...state,
        tenants: state.tenants.map(tenant =>
          tenant.id === action.payload.id ? action.payload : tenant
        )
      };
    
    case 'SET_MAINTENANCE_REQUESTS':
      return { ...state, maintenanceRequests: action.payload, loading: false };
    
    case 'ADD_MAINTENANCE_REQUEST':
      return { ...state, maintenanceRequests: [action.payload, ...state.maintenanceRequests] };
    
    case 'UPDATE_MAINTENANCE_REQUEST':
      return {
        ...state,
        maintenanceRequests: state.maintenanceRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        )
      };
    
    case 'SET_LEASES':
      return { ...state, leases: action.payload, loading: false };
    
    case 'ADD_LEASE':
      return { ...state, leases: [action.payload, ...state.leases] };
    
    case 'UPDATE_LEASE':
      return {
        ...state,
        leases: state.leases.map(lease =>
          lease.id === action.payload.id ? action.payload : lease
        )
      };
    
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload, loading: false };
    
    case 'ADD_APPLICATION':
      return { ...state, applications: [action.payload, ...state.applications] };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? action.payload : app
        )
      };
    
    case 'SET_INSPECTIONS':
      return { ...state, inspections: action.payload, loading: false };
    
    case 'ADD_INSPECTION':
      return { ...state, inspections: [action.payload, ...state.inspections] };
    
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload, loading: false };
    
    case 'ADD_DOCUMENT':
      return { ...state, documents: [action.payload, ...state.documents] };
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload, loading: false };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case 'CACHE_DATA':
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.payload.key]: {
            data: action.payload.data,
            timestamp: Date.now()
          }
        }
      };
    
    case 'CLEAR_CACHE':
      return { ...state, cache: {} };
    
    case 'SET_BULK_OPERATION':
      return {
        ...state,
        bulkOperations: { ...state.bulkOperations, ...action.payload }
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'TOGGLE_REAL_TIME':
      return { ...state, realTimeUpdates: action.payload };
    
    default:
      return state;
  }
};

export const PropertyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);
  const { apiCall } = useAuth();
  const { canAccess, getAccessibleResources } = usePermissions();

  const fetchProperties = useCallback(async (params = {}) => {
    if (!canAccess('properties', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view properties' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const queryParams = new URLSearchParams({
        ...state.filters,
        ...state.pagination,
        ...params
      }).toString();

      const cacheKey = `properties_${queryParams}`;
      const cached = state.cache[cacheKey];
      
      if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        dispatch({ type: 'SET_PROPERTIES', payload: cached.data });
        return cached.data;
      }

      const data = await apiCall(`/properties?${queryParams}`);
      
      dispatch({ type: 'SET_PROPERTIES', payload: data });
      dispatch({ type: 'CACHE_DATA', payload: { key: cacheKey, data } });
      
      return data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess, state.filters, state.pagination, state.cache]);

  const fetchProperty = useCallback(async (propertyId) => {
    if (!canAccess('properties', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view property' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const cacheKey = `property_${propertyId}`;
      const cached = state.cache[cacheKey];
      
      if (cached && Date.now() - cached.timestamp < 180000) { // 3 minutes cache
        dispatch({ type: 'SET_CURRENT_PROPERTY', payload: cached.data });
        dispatch({ type: 'SET_LOADING', payload: false });
        return cached.data;
      }

      const data = await apiCall(`/properties/${propertyId}`);
      
      dispatch({ type: 'SET_CURRENT_PROPERTY', payload: data.property });
      dispatch({ type: 'CACHE_DATA', payload: { key: cacheKey, data: data.property } });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return data.property;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess, state.cache]);

  const createProperty = useCallback(async (propertyData) => {
    if (!canAccess('properties', 'create')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to create properties' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall('/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData)
      });

      dispatch({ type: 'ADD_PROPERTY', payload: data.property });
      dispatch({ type: 'CLEAR_CACHE' });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return data.property;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const updateProperty = useCallback(async (propertyId, updates) => {
    if (!canAccess('properties', 'update')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to update properties' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      dispatch({ type: 'UPDATE_PROPERTY', payload: data.property });
      dispatch({ type: 'CLEAR_CACHE' });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return data.property;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const deleteProperty = useCallback(async (propertyId) => {
    if (!canAccess('properties', 'delete')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to delete properties' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await apiCall(`/properties/${propertyId}`, {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_PROPERTY', payload: propertyId });
      dispatch({ type: 'CLEAR_CACHE' });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return true;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchUnits = useCallback(async (propertyId) => {
    if (!canAccess('properties', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view units' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/units`);
      dispatch({ type: 'SET_UNITS', payload: data.units });
      return data.units;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const createUnit = useCallback(async (propertyId, unitData) => {
    if (!canAccess('properties', 'update')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to create units' });
      return;
    }

    try {
      const data = await apiCall(`/properties/${propertyId}/units`, {
        method: 'POST',
        body: JSON.stringify(unitData)
      });

      dispatch({ type: 'ADD_UNIT', payload: data.unit });
      return data.unit;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const updateUnit = useCallback(async (propertyId, unitId, updates) => {
    if (!canAccess('properties', 'update')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to update units' });
      return;
    }

    try {
      const data = await apiCall(`/properties/${propertyId}/units/${unitId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      dispatch({ type: 'UPDATE_UNIT', payload: data.unit });
      return data.unit;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const deleteUnit = useCallback(async (propertyId, unitId) => {
    if (!canAccess('properties', 'delete')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to delete units' });
      return;
    }

    try {
      await apiCall(`/properties/${propertyId}/units/${unitId}`, {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_UNIT', payload: unitId });
      return true;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchTenants = useCallback(async (propertyId) => {
    if (!canAccess('tenants', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view tenants' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/tenants`);
      dispatch({ type: 'SET_TENANTS', payload: data.tenants });
      return data.tenants;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchMaintenanceRequests = useCallback(async (propertyId) => {
    if (!canAccess('maintenance', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view maintenance requests' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/maintenance`);
      dispatch({ type: 'SET_MAINTENANCE_REQUESTS', payload: data.requests });
      return data.requests;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchLeases = useCallback(async (propertyId) => {
    if (!canAccess('tenants', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view leases' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/leases`);
      dispatch({ type: 'SET_LEASES', payload: data.leases });
      return data.leases;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchApplications = useCallback(async (propertyId) => {
    if (!canAccess('tenants', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view applications' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/applications`);
      dispatch({ type: 'SET_APPLICATIONS', payload: data.applications });
      return data.applications;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchInspections = useCallback(async (propertyId) => {
    if (!canAccess('properties', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view inspections' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/inspections`);
      dispatch({ type: 'SET_INSPECTIONS', payload: data.inspections });
      return data.inspections;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchDocuments = useCallback(async (propertyId) => {
    if (!canAccess('documents', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view documents' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/documents`);
      dispatch({ type: 'SET_DOCUMENTS', payload: data.documents });
      return data.documents;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const fetchAnalytics = useCallback(async (propertyId, timeframe = '30d') => {
    if (!canAccess('analytics', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to view analytics' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await apiCall(`/properties/${propertyId}/analytics?timeframe=${timeframe}`);
      dispatch({ type: 'SET_ANALYTICS', payload: data.analytics });
      return data.analytics;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, [apiCall, canAccess]);

  const bulkUpdateProperties = useCallback(async (propertyIds, updates) => {
    if (!canAccess('properties', 'update')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to bulk update properties' });
      return;
    }

    dispatch({ type: 'SET_BULK_OPERATION', payload: { operation: 'update', progress: 0 } });

    try {
      const data = await apiCall('/properties/bulk-update', {
        method: 'PUT',
        body: JSON.stringify({ propertyIds, updates })
      });

      // Update properties in state
      data.updatedProperties.forEach(property => {
        dispatch({ type: 'UPDATE_PROPERTY', payload: property });
      });

      dispatch({ type: 'CLEAR_CACHE' });
      dispatch({ type: 'SET_BULK_OPERATION', payload: { operation: null, progress: 0 } });
      
      return data.updatedProperties;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      dispatch({ type: 'SET_BULK_OPERATION', payload: { operation: null, progress: 0 } });
      throw err;
    }
  }, [apiCall, canAccess]);

  const searchProperties = useCallback(async (searchTerm, searchFilters = {}) => {
    if (!canAccess('properties', 'view')) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied to search properties' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...searchFilters
      }).toString();

      const data = await apiCall(`/properties/search?${params}`);
      return data.properties;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [apiCall, canAccess]);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const setPagination = useCallback((newPagination) => {
    dispatch({ type: 'SET_PAGINATION', payload: newPagination });
  }, []);

  const setSelectedProperties = useCallback((propertyIds) => {
    dispatch({ type: 'SET_SELECTED_PROPERTIES', payload: propertyIds });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  const toggleRealTimeUpdates = useCallback((enabled) => {
    dispatch({ type: 'TOGGLE_REAL_TIME', payload: enabled });
  }, []);

  // Computed values
  const filteredProperties = useMemo(() => {
    return state.properties.filter(property => {
      const matchesStatus = state.filters.status === 'all' || property.status === state.filters.status;
      const matchesType = state.filters.type === 'all' || property.type === state.filters.type;
      const matchesLocation = state.filters.location === 'all' || 
        property.location?.toLowerCase().includes(state.filters.location.toLowerCase());
      const matchesSearch = !state.filters.search || 
        property.name?.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        property.address?.toLowerCase().includes(state.filters.search.toLowerCase());

      return matchesStatus && matchesType && matchesLocation && matchesSearch;
    });
  }, [state.properties, state.filters]);

  const propertyStats = useMemo(() => {
    return {
      total: state.properties.length,
      occupied: state.properties.filter(p => p.status === 'occupied').length,
      vacant: state.properties.filter(p => p.status === 'vacant').length,
      maintenance: state.properties.filter(p => p.status === 'maintenance').length,
      totalUnits: state.properties.reduce((sum, p) => sum + (p.unitCount || 0), 0),
      totalRevenue: state.properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0),
      averageOccupancy: state.properties.length > 0 
        ? state.properties.reduce((sum, p) => sum + (p.occupancyRate || 0), 0) / state.properties.length 
        : 0
    };
  }, [state.properties]);

  // Initialize data
  useEffect(() => {
    const accessibleProperties = getAccessibleResources('properties');
    if (accessibleProperties !== 'none') {
      fetchProperties();
    }
  }, [getAccessibleResources]);

  const value = useMemo(() => ({
    ...state,
    filteredProperties,
    propertyStats,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    fetchTenants,
    fetchMaintenanceRequests,
    fetchLeases,
    fetchApplications,
    fetchInspections,
    fetchDocuments,
    fetchAnalytics,
    bulkUpdateProperties,
    searchProperties,
    setFilters,
    setPagination,
    setSelectedProperties,
    clearError,
    clearCache,
    toggleRealTimeUpdates
  }), [
    state,
    filteredProperties,
    propertyStats,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    fetchTenants,
    fetchMaintenanceRequests,
    fetchLeases,
    fetchApplications,
    fetchInspections,
    fetchDocuments,
    fetchAnalytics,
    bulkUpdateProperties,
    searchProperties,
    setFilters,
    setPagination,
    setSelectedProperties,
    clearError,
    clearCache,
    toggleRealTimeUpdates
  ]);

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export default PropertyContext;