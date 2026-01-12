import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
  // Properties data
  properties: [],
  currentProperty: null,
  selectedProperties: [],
  
  // Related data
  units: [],
  tenants: [],
  leases: [],
  applications: [],
  maintenanceRequests: [],
  inspections: [],
  documents: [],
  
  // Analytics and reports
  analytics: {},
  reports: [],
  
  // Loading states
  loading: false,
  propertiesLoading: false,
  unitsLoading: false,
  tenantsLoading: false,
  
  // Error states
  error: null,
  propertiesError: null,
  unitsError: null,
  tenantsError: null,
  
  // Filters and search
  filters: {
    status: 'all',
    type: 'all',
    location: 'all',
    priceRange: { min: 0, max: 10000 },
    bedrooms: 'all',
    bathrooms: 'all',
    amenities: [],
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  
  // Cache management
  cache: {},
  cacheExpiry: 300000, // 5 minutes
  
  // Real-time updates
  realTimeEnabled: true,
  lastSync: null,
  
  // Bulk operations
  bulkOperations: {
    selected: [],
    operation: null,
    progress: 0,
    results: []
  },
  
  // View preferences
  viewMode: 'grid', // grid, list, map
  mapCenter: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  mapZoom: 10,
  
  // Form states
  propertyForm: {
    data: {},
    errors: {},
    touched: {},
    isSubmitting: false
  }
};

export const usePropertyStore = create(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Basic actions
        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),

        setError: (error) => set((state) => {
          state.error = error;
          state.loading = false;
        }),

        clearError: () => set((state) => {
          state.error = null;
          state.propertiesError = null;
          state.unitsError = null;
          state.tenantsError = null;
        }),

        // Properties actions
        fetchProperties: async (params = {}) => {
          set((state) => {
            state.propertiesLoading = true;
            state.propertiesError = null;
          });

          try {
            const { filters, pagination } = get();
            const queryParams = new URLSearchParams({
              ...filters,
              ...pagination,
              ...params
            }).toString();

            // Check cache first
            const cacheKey = `properties_${queryParams}`;
            const cached = get().cache[cacheKey];
            
            if (cached && Date.now() - cached.timestamp < get().cacheExpiry) {
              set((state) => {
                state.properties = cached.data.properties;
                state.pagination = cached.data.pagination;
                state.propertiesLoading = false;
              });
              return cached.data;
            }

            const response = await fetch(`${API_BASE}/properties?${queryParams}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch properties');
            }

            set((state) => {
              state.properties = data.properties || [];
              state.pagination = data.pagination || state.pagination;
              state.propertiesLoading = false;
              state.lastSync = Date.now();
              
              // Cache the result
              state.cache[cacheKey] = {
                data,
                timestamp: Date.now()
              };
            });

            return data;
          } catch (err) {
            set((state) => {
              state.propertiesError = err.message;
              state.propertiesLoading = false;
            });
            throw err;
          }
        },

        fetchProperty: async (propertyId) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            // Check cache first
            const cacheKey = `property_${propertyId}`;
            const cached = get().cache[cacheKey];
            
            if (cached && Date.now() - cached.timestamp < get().cacheExpiry) {
              set((state) => {
                state.currentProperty = cached.data;
                state.loading = false;
              });
              return cached.data;
            }

            const response = await fetch(`${API_BASE}/properties/${propertyId}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch property');
            }

            set((state) => {
              state.currentProperty = data.property;
              state.loading = false;
              
              // Cache the result
              state.cache[cacheKey] = {
                data: data.property,
                timestamp: Date.now()
              };
            });

            return data.property;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        createProperty: async (propertyData) => {
          set((state) => {
            state.propertyForm.isSubmitting = true;
            state.propertyForm.errors = {};
          });

          try {
            const response = await fetch(`${API_BASE}/properties`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(propertyData)
            });

            const data = await response.json();

            if (!response.ok) {
              if (data.errors) {
                set((state) => {
                  state.propertyForm.errors = data.errors;
                });
              }
              throw new Error(data.message || 'Failed to create property');
            }

            set((state) => {
              state.properties.unshift(data.property);
              state.pagination.total += 1;
              state.propertyForm.isSubmitting = false;
              state.propertyForm.data = {};
              state.propertyForm.errors = {};
              state.propertyForm.touched = {};
              
              // Clear cache
              state.cache = {};
            });

            return data.property;
          } catch (err) {
            set((state) => {
              state.propertyForm.isSubmitting = false;
              if (!state.propertyForm.errors || Object.keys(state.propertyForm.errors).length === 0) {
                state.error = err.message;
              }
            });
            throw err;
          }
        },

        updateProperty: async (propertyId, updates) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to update property');
            }

            set((state) => {
              // Update in properties list
              const index = state.properties.findIndex(p => p.id === propertyId);
              if (index !== -1) {
                state.properties[index] = data.property;
              }
              
              // Update current property if it's the same
              if (state.currentProperty?.id === propertyId) {
                state.currentProperty = data.property;
              }
              
              state.loading = false;
              
              // Clear cache
              state.cache = {};
            });

            return data.property;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        deleteProperty: async (propertyId) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to delete property');
            }

            set((state) => {
              state.properties = state.properties.filter(p => p.id !== propertyId);
              state.selectedProperties = state.selectedProperties.filter(id => id !== propertyId);
              
              if (state.currentProperty?.id === propertyId) {
                state.currentProperty = null;
              }
              
              state.pagination.total = Math.max(0, state.pagination.total - 1);
              state.loading = false;
              
              // Clear cache
              state.cache = {};
            });

            return true;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Units actions
        fetchUnits: async (propertyId) => {
          set((state) => {
            state.unitsLoading = true;
            state.unitsError = null;
          });

          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}/units`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch units');
            }

            set((state) => {
              state.units = data.units || [];
              state.unitsLoading = false;
            });

            return data.units;
          } catch (err) {
            set((state) => {
              state.unitsError = err.message;
              state.unitsLoading = false;
            });
            throw err;
          }
        },

        createUnit: async (propertyId, unitData) => {
          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}/units`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(unitData)
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to create unit');
            }

            set((state) => {
              state.units.unshift(data.unit);
            });

            return data.unit;
          } catch (err) {
            set((state) => {
              state.unitsError = err.message;
            });
            throw err;
          }
        },

        updateUnit: async (propertyId, unitId, updates) => {
          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}/units/${unitId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to update unit');
            }

            set((state) => {
              const index = state.units.findIndex(u => u.id === unitId);
              if (index !== -1) {
                state.units[index] = data.unit;
              }
            });

            return data.unit;
          } catch (err) {
            set((state) => {
              state.unitsError = err.message;
            });
            throw err;
          }
        },

        deleteUnit: async (propertyId, unitId) => {
          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}/units/${unitId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to delete unit');
            }

            set((state) => {
              state.units = state.units.filter(u => u.id !== unitId);
            });

            return true;
          } catch (err) {
            set((state) => {
              state.unitsError = err.message;
            });
            throw err;
          }
        },

        // Tenants actions
        fetchTenants: async (propertyId) => {
          set((state) => {
            state.tenantsLoading = true;
            state.tenantsError = null;
          });

          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}/tenants`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch tenants');
            }

            set((state) => {
              state.tenants = data.tenants || [];
              state.tenantsLoading = false;
            });

            return data.tenants;
          } catch (err) {
            set((state) => {
              state.tenantsError = err.message;
              state.tenantsLoading = false;
            });
            throw err;
          }
        },

        // Analytics actions
        fetchAnalytics: async (propertyId, timeframe = '30d') => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch(`${API_BASE}/properties/${propertyId}/analytics?timeframe=${timeframe}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to fetch analytics');
            }

            set((state) => {
              state.analytics = data.analytics || {};
              state.loading = false;
            });

            return data.analytics;
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Search and filter actions
        setFilters: (newFilters) => set((state) => {
          state.filters = { ...state.filters, ...newFilters };
          state.pagination.page = 1; // Reset to first page
          state.cache = {}; // Clear cache when filters change
        }),

        setPagination: (newPagination) => set((state) => {
          state.pagination = { ...state.pagination, ...newPagination };
        }),

        searchProperties: async (searchTerm, searchFilters = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const params = new URLSearchParams({
              search: searchTerm,
              ...searchFilters
            }).toString();

            const response = await fetch(`${API_BASE}/properties/search?${params}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Search failed');
            }

            set((state) => {
              state.loading = false;
            });

            return data.properties || [];
          } catch (err) {
            set((state) => {
              state.error = err.message;
              state.loading = false;
            });
            throw err;
          }
        },

        // Selection actions
        setSelectedProperties: (propertyIds) => set((state) => {
          state.selectedProperties = propertyIds;
        }),

        togglePropertySelection: (propertyId) => set((state) => {
          const index = state.selectedProperties.indexOf(propertyId);
          if (index === -1) {
            state.selectedProperties.push(propertyId);
          } else {
            state.selectedProperties.splice(index, 1);
          }
        }),

        selectAllProperties: () => set((state) => {
          state.selectedProperties = state.properties.map(p => p.id);
        }),

        clearSelection: () => set((state) => {
          state.selectedProperties = [];
        }),

        // Bulk operations
        bulkUpdateProperties: async (propertyIds, updates) => {
          set((state) => {
            state.bulkOperations.operation = 'update';
            state.bulkOperations.progress = 0;
            state.bulkOperations.results = [];
          });

          try {
            const response = await fetch(`${API_BASE}/properties/bulk-update`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ propertyIds, updates })
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Bulk update failed');
            }

            set((state) => {
              // Update properties in state
              data.updatedProperties.forEach(updatedProperty => {
                const index = state.properties.findIndex(p => p.id === updatedProperty.id);
                if (index !== -1) {
                  state.properties[index] = updatedProperty;
                }
              });

              state.bulkOperations.operation = null;
              state.bulkOperations.progress = 100;
              state.bulkOperations.results = data.updatedProperties;
              
              // Clear cache
              state.cache = {};
            });

            return data.updatedProperties;
          } catch (err) {
            set((state) => {
              state.bulkOperations.operation = null;
              state.error = err.message;
            });
            throw err;
          }
        },

        bulkDeleteProperties: async (propertyIds) => {
          set((state) => {
            state.bulkOperations.operation = 'delete';
            state.bulkOperations.progress = 0;
          });

          try {
            const response = await fetch(`${API_BASE}/properties/bulk-delete`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ propertyIds })
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Bulk delete failed');
            }

            set((state) => {
              state.properties = state.properties.filter(p => !propertyIds.includes(p.id));
              state.selectedProperties = [];
              state.bulkOperations.operation = null;
              state.bulkOperations.progress = 100;
              state.pagination.total = Math.max(0, state.pagination.total - propertyIds.length);
              
              // Clear cache
              state.cache = {};
            });

            return true;
          } catch (err) {
            set((state) => {
              state.bulkOperations.operation = null;
              state.error = err.message;
            });
            throw err;
          }
        },

        // View preferences
        setViewMode: (mode) => set((state) => {
          state.viewMode = mode;
        }),

        setMapCenter: (center) => set((state) => {
          state.mapCenter = center;
        }),

        setMapZoom: (zoom) => set((state) => {
          state.mapZoom = zoom;
        }),

        // Form management
        updatePropertyForm: (updates) => set((state) => {
          state.propertyForm.data = { ...state.propertyForm.data, ...updates };
        }),

        setPropertyFormErrors: (errors) => set((state) => {
          state.propertyForm.errors = errors;
        }),

        setPropertyFormTouched: (field, touched = true) => set((state) => {
          state.propertyForm.touched[field] = touched;
        }),

        resetPropertyForm: () => set((state) => {
          state.propertyForm = {
            data: {},
            errors: {},
            touched: {},
            isSubmitting: false
          };
        }),

        // Cache management
        clearCache: () => set((state) => {
          state.cache = {};
        }),

        // Real-time updates
        toggleRealTime: (enabled) => set((state) => {
          state.realTimeEnabled = enabled;
        }),

        // Computed getters
        getFilteredProperties: () => {
          const { properties, filters } = get();
          
          return properties.filter(property => {
            const matchesStatus = filters.status === 'all' || property.status === filters.status;
            const matchesType = filters.type === 'all' || property.type === filters.type;
            const matchesLocation = filters.location === 'all' || 
              property.location?.toLowerCase().includes(filters.location.toLowerCase());
            const matchesPrice = property.rent >= filters.priceRange.min && 
              property.rent <= filters.priceRange.max;
            const matchesBedrooms = filters.bedrooms === 'all' || 
              property.bedrooms === parseInt(filters.bedrooms);
            const matchesBathrooms = filters.bathrooms === 'all' || 
              property.bathrooms === parseInt(filters.bathrooms);
            const matchesAmenities = filters.amenities.length === 0 || 
              filters.amenities.every(amenity => property.amenities?.includes(amenity));
            const matchesSearch = !filters.search || 
              property.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
              property.address?.toLowerCase().includes(filters.search.toLowerCase());

            return matchesStatus && matchesType && matchesLocation && matchesPrice && 
                   matchesBedrooms && matchesBathrooms && matchesAmenities && matchesSearch;
          });
        },

        getPropertyStats: () => {
          const { properties } = get();
          
          return {
            total: properties.length,
            occupied: properties.filter(p => p.status === 'occupied').length,
            vacant: properties.filter(p => p.status === 'vacant').length,
            maintenance: properties.filter(p => p.status === 'maintenance').length,
            totalUnits: properties.reduce((sum, p) => sum + (p.unitCount || 0), 0),
            totalRevenue: properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0),
            averageRent: properties.length > 0 
              ? properties.reduce((sum, p) => sum + (p.rent || 0), 0) / properties.length 
              : 0,
            occupancyRate: properties.length > 0 
              ? properties.filter(p => p.status === 'occupied').length / properties.length * 100 
              : 0
          };
        }
      })),
      {
        name: 'property-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          filters: state.filters,
          viewMode: state.viewMode,
          mapCenter: state.mapCenter,
          mapZoom: state.mapZoom,
          realTimeEnabled: state.realTimeEnabled
        })
      }
    )
  )
);

// Auto-clear expired cache entries
setInterval(() => {
  const { cache, cacheExpiry } = usePropertyStore.getState();
  const now = Date.now();
  
  const validCache = {};
  Object.entries(cache).forEach(([key, value]) => {
    if (now - value.timestamp < cacheExpiry) {
      validCache[key] = value;
    }
  });
  
  usePropertyStore.setState({ cache: validCache });
}, 60000); // Check every minute

export default usePropertyStore;