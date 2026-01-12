/**
 * Property Types and Enums for StaySpot Platform
 * Comprehensive property management type definitions
 */

// Property Types
export const PROPERTY_TYPES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  MIXED_USE: 'mixed_use',
  INDUSTRIAL: 'industrial',
  RETAIL: 'retail',
  OFFICE: 'office',
  WAREHOUSE: 'warehouse',
  LAND: 'land'
};

// Property Subtypes for Residential
export const RESIDENTIAL_SUBTYPES = {
  SINGLE_FAMILY: 'single_family',
  DUPLEX: 'duplex',
  TRIPLEX: 'triplex',
  FOURPLEX: 'fourplex',
  APARTMENT: 'apartment',
  CONDOMINIUM: 'condominium',
  TOWNHOUSE: 'townhouse',
  MOBILE_HOME: 'mobile_home',
  STUDIO: 'studio'
};

// Property Status
export const PROPERTY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  UNDER_CONSTRUCTION: 'under_construction',
  RENOVATION: 'renovation',
  SOLD: 'sold',
  DEMOLISHED: 'demolished',
  PENDING_APPROVAL: 'pending_approval'
};

// Unit Status
export const UNIT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  RENOVATION: 'renovation',
  RESERVED: 'reserved',
  UNAVAILABLE: 'unavailable'
};

// Lease Status
export const LEASE_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  RENEWED: 'renewed',
  DRAFT: 'draft'
};

// Lease Types
export const LEASE_TYPES = {
  FIXED_TERM: 'fixed_term',
  MONTH_TO_MONTH: 'month_to_month',
  WEEK_TO_WEEK: 'week_to_week',
  COMMERCIAL: 'commercial',
  SHORT_TERM: 'short_term'
};

// Property Features and Amenities
export const PROPERTY_FEATURES = {
  // Building Features
  ELEVATOR: 'elevator',
  PARKING_GARAGE: 'parking_garage',
  BALCONY: 'balcony',
  PATIO: 'patio',
  GARDEN: 'garden',
  POOL: 'pool',
  GYM: 'gym',
  LAUNDRY_ROOM: 'laundry_room',
  STORAGE: 'storage',
  
  // Unit Features
  AIR_CONDITIONING: 'air_conditioning',
  HEATING: 'heating',
  DISHWASHER: 'dishwasher',
  WASHER_DRYER: 'washer_dryer',
  FIREPLACE: 'fireplace',
  HARDWOOD_FLOORS: 'hardwood_floors',
  CARPET: 'carpet',
  TILE_FLOORS: 'tile_floors',
  
  // Security Features
  SECURITY_SYSTEM: 'security_system',
  DOORMAN: 'doorman',
  GATED_COMMUNITY: 'gated_community',
  INTERCOM: 'intercom',
  
  // Accessibility
  WHEELCHAIR_ACCESSIBLE: 'wheelchair_accessible',
  ELEVATOR_ACCESS: 'elevator_access',
  RAMP_ACCESS: 'ramp_access'
};

// Utility Types
export const UTILITY_TYPES = {
  ELECTRICITY: 'electricity',
  GAS: 'gas',
  WATER: 'water',
  SEWER: 'sewer',
  TRASH: 'trash',
  INTERNET: 'internet',
  CABLE: 'cable',
  HEATING: 'heating',
  COOLING: 'cooling'
};

// Utility Responsibility
export const UTILITY_RESPONSIBILITY = {
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  SHARED: 'shared'
};

// Property Condition
export const PROPERTY_CONDITION = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  NEEDS_REPAIR: 'needs_repair'
};

// Inspection Types
export const INSPECTION_TYPES = {
  MOVE_IN: 'move_in',
  MOVE_OUT: 'move_out',
  ROUTINE: 'routine',
  MAINTENANCE: 'maintenance',
  EMERGENCY: 'emergency',
  ANNUAL: 'annual',
  SAFETY: 'safety'
};

// Document Types
export const PROPERTY_DOCUMENT_TYPES = {
  DEED: 'deed',
  TITLE: 'title',
  INSURANCE: 'insurance',
  TAX_RECORDS: 'tax_records',
  PERMITS: 'permits',
  INSPECTION_REPORTS: 'inspection_reports',
  PHOTOS: 'photos',
  FLOOR_PLANS: 'floor_plans',
  LEASE_AGREEMENTS: 'lease_agreements',
  MAINTENANCE_RECORDS: 'maintenance_records'
};

// Financial Categories
export const FINANCIAL_CATEGORIES = {
  RENT: 'rent',
  DEPOSIT: 'deposit',
  FEES: 'fees',
  UTILITIES: 'utilities',
  MAINTENANCE: 'maintenance',
  INSURANCE: 'insurance',
  TAXES: 'taxes',
  MANAGEMENT: 'management',
  MARKETING: 'marketing',
  LEGAL: 'legal'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CHECK: 'check',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  ACH: 'ach',
  MONEY_ORDER: 'money_order',
  ONLINE: 'online'
};

// Property Search Filters
export const SEARCH_FILTERS = {
  PRICE_RANGE: 'price_range',
  BEDROOMS: 'bedrooms',
  BATHROOMS: 'bathrooms',
  SQUARE_FOOTAGE: 'square_footage',
  PROPERTY_TYPE: 'property_type',
  LOCATION: 'location',
  AMENITIES: 'amenities',
  PET_FRIENDLY: 'pet_friendly',
  PARKING: 'parking',
  LEASE_TERM: 'lease_term'
};

// Market Analysis Types
export const MARKET_ANALYSIS_TYPES = {
  RENTAL_COMPARISON: 'rental_comparison',
  PROPERTY_VALUE: 'property_value',
  MARKET_TRENDS: 'market_trends',
  OCCUPANCY_RATES: 'occupancy_rates',
  RENT_ROLL: 'rent_roll'
};

// Utility functions
export const getPropertyTypeDisplayName = (type) => {
  const typeNames = {
    [PROPERTY_TYPES.RESIDENTIAL]: 'Residential',
    [PROPERTY_TYPES.COMMERCIAL]: 'Commercial',
    [PROPERTY_TYPES.MIXED_USE]: 'Mixed Use',
    [PROPERTY_TYPES.INDUSTRIAL]: 'Industrial',
    [PROPERTY_TYPES.RETAIL]: 'Retail',
    [PROPERTY_TYPES.OFFICE]: 'Office',
    [PROPERTY_TYPES.WAREHOUSE]: 'Warehouse',
    [PROPERTY_TYPES.LAND]: 'Land'
  };
  return typeNames[type] || type;
};

export const getUnitStatusColor = (status) => {
  const statusColors = {
    [UNIT_STATUS.AVAILABLE]: 'green',
    [UNIT_STATUS.OCCUPIED]: 'blue',
    [UNIT_STATUS.MAINTENANCE]: 'yellow',
    [UNIT_STATUS.RENOVATION]: 'orange',
    [UNIT_STATUS.RESERVED]: 'purple',
    [UNIT_STATUS.UNAVAILABLE]: 'red'
  };
  return statusColors[status] || 'gray';
};

export const calculatePropertyMetrics = (property) => {
  const totalUnits = property.units?.length || 0;
  const occupiedUnits = property.units?.filter(unit => unit.status === UNIT_STATUS.OCCUPIED).length || 0;
  const availableUnits = property.units?.filter(unit => unit.status === UNIT_STATUS.AVAILABLE).length || 0;
  
  return {
    totalUnits,
    occupiedUnits,
    availableUnits,
    occupancyRate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0,
    vacancyRate: totalUnits > 0 ? (availableUnits / totalUnits) * 100 : 0
  };
};

export const formatPropertyAddress = (property) => {
  const { street, city, state, zipCode } = property.address || {};
  return [street, city, state, zipCode].filter(Boolean).join(', ');
};

export const isPropertyAvailable = (property) => {
  return property.status === PROPERTY_STATUS.ACTIVE && 
         property.units?.some(unit => unit.status === UNIT_STATUS.AVAILABLE);
};