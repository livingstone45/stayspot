import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import PropertyCard from '../../components/properties/PropertyCard';
import FilterBar from '../../components/common/FilterBar';
import PaginationControls from '../../components/common/PaginationControls';

const PropertyList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        'http://localhost:5000/api/properties',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProperties(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = properties;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (prop) =>
          prop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((prop) => prop.status === filterStatus);
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'units':
          return (b.units?.length || 0) - (a.units?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [properties, searchTerm, filterStatus, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProperties(paginatedProperties.map((p) => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProperties.length} properties?`)) {
      return;
    }

    try {
      for (const id of selectedProperties) {
        await axios.delete(`http://localhost:5000/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setProperties((prev) =>
        prev.filter((p) => !selectedProperties.includes(p.id))
      );
      setSelectedProperties([]);
      setShowBulkActions(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete properties');
    }
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/management/properties/${propertyId}/edit`);
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/management/properties/${propertyId}`);
  };

  const handleAddProperty = () => {
    navigate('/management/properties/new');
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Properties
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and view all properties
              </p>
            </div>
            <button
              onClick={handleAddProperty}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Property
            </button>
          </div>

          {error && <ErrorAlert message={error} />}

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
              <option value="units">Sort by Units</option>
            </select>
            <div className="text-right text-sm text-gray-600 self-center">
              {filteredProperties.length} properties found
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProperties.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
              <span className="text-blue-900">
                {selectedProperties.length} property(ies) selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Properties Table */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedProperties.length ===
                        paginatedProperties.length &&
                      paginatedProperties.length > 0
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProperties.map((property) => (
                <tr key={property.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handleSelectProperty(property.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {property.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {property.address}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {property.units?.length || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleViewProperty(property.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditProperty(property.id)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
