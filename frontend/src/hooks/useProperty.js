import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

export const useProperty = (propertyId = null) => {
  const { apiCall } = useAuth();
  const { canAccessProperty, getAccessibleResources } = usePermissions();
  
  const [properties, setProperties] = useState([]);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [financials, setFinancials] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    location: 'all',
    search: ''
  });

  const fetchProperties = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const data = await apiCall(`/properties?${queryParams}`);
      setProperties(data.properties || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, filters]);

  const fetchProperty = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${id}`);
      setCurrentProperty(data.property);
      return data.property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const createProperty = useCallback(async (propertyData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall('/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData)
      });

      setProperties(prev => [data.property, ...prev]);
      return data.property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const updateProperty = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setProperties(prev => 
        prev.map(property => 
          property.id === id ? data.property : property
        )
      );

      if (currentProperty?.id === id) {
        setCurrentProperty(data.property);
      }

      return data.property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, currentProperty]);

  const deleteProperty = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await apiCall(`/properties/${id}`, {
        method: 'DELETE'
      });

      setProperties(prev => prev.filter(property => property.id !== id));
      
      if (currentProperty?.id === id) {
        setCurrentProperty(null);
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, currentProperty]);

  const fetchUnits = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${propertyId}/units`);
      setUnits(data.units || []);
      return data.units;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const createUnit = useCallback(async (propertyId, unitData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${propertyId}/units`, {
        method: 'POST',
        body: JSON.stringify(unitData)
      });

      setUnits(prev => [data.unit, ...prev]);
      return data.unit;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const updateUnit = useCallback(async (propertyId, unitId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${propertyId}/units/${unitId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setUnits(prev => 
        prev.map(unit => 
          unit.id === unitId ? data.unit : unit
        )
      );

      return data.unit;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const fetchTenants = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${propertyId}/tenants`);
      setTenants(data.tenants || []);
      return data.tenants;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const fetchMaintenanceRequests = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${propertyId}/maintenance`);
      setMaintenanceRequests(data.requests || []);
      return data.requests;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const fetchFinancials = useCallback(async (propertyId, period = 'month') => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(`/properties/${propertyId}/financials?period=${period}`);
      setFinancials(data.financials || {});
      return data.financials;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const searchProperties = useCallback(async (searchTerm, searchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...searchFilters
      }).toString();

      const data = await apiCall(`/properties/search?${params}`);
      return data.properties || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesStatus = filters.status === 'all' || property.status === filters.status;
      const matchesType = filters.type === 'all' || property.type === filters.type;
      const matchesLocation = filters.location === 'all' || property.location?.includes(filters.location);
      const matchesSearch = !filters.search || 
        property.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesType && matchesLocation && matchesSearch;
    });
  }, [properties, filters]);

  const propertyStats = useMemo(() => {
    return {
      total: properties.length,
      occupied: properties.filter(p => p.status === 'occupied').length,
      vacant: properties.filter(p => p.status === 'vacant').length,
      maintenance: properties.filter(p => p.status === 'maintenance').length,
      totalUnits: properties.reduce((sum, p) => sum + (p.unitCount || 0), 0),
      totalRevenue: properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0)
    };
  }, [properties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId);
    }
  }, [propertyId, fetchProperty]);

  return {
    properties: filteredProperties,
    allProperties: properties,
    currentProperty,
    units,
    tenants,
    maintenanceRequests,
    financials,
    loading,
    error,
    filters,
    propertyStats,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchUnits,
    createUnit,
    updateUnit,
    fetchTenants,
    fetchMaintenanceRequests,
    fetchFinancials,
    searchProperties,
    setFilters,
    setError,
    setCurrentProperty
  };
};

export default useProperty;
