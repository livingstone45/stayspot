/**
 * Property type constants for the StaySpot application
 * Defines all property types, categories, and their characteristics
 */

/**
 * Main property types
 */
export const PROPERTY_TYPES = {
  // Residential properties
  SINGLE_FAMILY: 'single_family',
  DUPLEX: 'duplex',
  TRIPLEX: 'triplex',
  FOURPLEX: 'fourplex',
  TOWNHOUSE: 'townhouse',
  CONDOMINIUM: 'condominium',
  APARTMENT_COMPLEX: 'apartment_complex',
  STUDIO: 'studio',
  LOFT: 'loft',
  
  // Commercial properties
  OFFICE_BUILDING: 'office_building',
  RETAIL_SPACE: 'retail_space',
  WAREHOUSE: 'warehouse',
  INDUSTRIAL: 'industrial',
  MIXED_USE: 'mixed_use',
  
  // Specialized properties
  STUDENT_HOUSING: 'student_housing',
  SENIOR_LIVING: 'senior_living',
  AFFORDABLE_HOUSING: 'affordable_housing',
  LUXURY_HOUSING: 'luxury_housing',
  SHORT_TERM_RENTAL: 'short_term_rental',
  VACATION_RENTAL: 'vacation_rental',
  
  // Other types
  MOBILE_HOME: 'mobile_home',
  MANUFACTURED_HOME: 'manufactured_home',
  TINY_HOME: 'tiny_home',
  CO_LIVING: 'co_living',
  CO_WORKING: 'co_working'
};

/**
 * Property categories for grouping
 */
export const PROPERTY_CATEGORIES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  MIXED_USE: 'mixed_use',
  SPECIALIZED: 'specialized',
  ALTERNATIVE: 'alternative'
};

/**
 * Property type display names
 */
export const PROPERTY_TYPE_DISPLAY_NAMES = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: 'Single Family Home',
  [PROPERTY_TYPES.DUPLEX]: 'Duplex',
  [PROPERTY_TYPES.TRIPLEX]: 'Triplex',
  [PROPERTY_TYPES.FOURPLEX]: 'Fourplex',
  [PROPERTY_TYPES.TOWNHOUSE]: 'Townhouse',
  [PROPERTY_TYPES.CONDOMINIUM]: 'Condominium',
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: 'Apartment Complex',
  [PROPERTY_TYPES.STUDIO]: 'Studio Apartment',
  [PROPERTY_TYPES.LOFT]: 'Loft',
  [PROPERTY_TYPES.OFFICE_BUILDING]: 'Office Building',
  [PROPERTY_TYPES.RETAIL_SPACE]: 'Retail Space',
  [PROPERTY_TYPES.WAREHOUSE]: 'Warehouse',
  [PROPERTY_TYPES.INDUSTRIAL]: 'Industrial Property',
  [PROPERTY_TYPES.MIXED_USE]: 'Mixed Use Property',
  [PROPERTY_TYPES.STUDENT_HOUSING]: 'Student Housing',
  [PROPERTY_TYPES.SENIOR_LIVING]: 'Senior Living',
  [PROPERTY_TYPES.AFFORDABLE_HOUSING]: 'Affordable Housing',
  [PROPERTY_TYPES.LUXURY_HOUSING]: 'Luxury Housing',
  [PROPERTY_TYPES.SHORT_TERM_RENTAL]: 'Short-term Rental',
  [PROPERTY_TYPES.VACATION_RENTAL]: 'Vacation Rental',
  [PROPERTY_TYPES.MOBILE_HOME]: 'Mobile Home',
  [PROPERTY_TYPES.MANUFACTURED_HOME]: 'Manufactured Home',
  [PROPERTY_TYPES.TINY_HOME]: 'Tiny Home',
  [PROPERTY_TYPES.CO_LIVING]: 'Co-living Space',
  [PROPERTY_TYPES.CO_WORKING]: 'Co-working Space'
};

/**
 * Property type descriptions
 */
export const PROPERTY_TYPE_DESCRIPTIONS = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: 'Detached single-family residential home',
  [PROPERTY_TYPES.DUPLEX]: 'Two-unit residential building with shared wall',
  [PROPERTY_TYPES.TRIPLEX]: 'Three-unit residential building',
  [PROPERTY_TYPES.FOURPLEX]: 'Four-unit residential building',
  [PROPERTY_TYPES.TOWNHOUSE]: 'Multi-story attached residential unit',
  [PROPERTY_TYPES.CONDOMINIUM]: 'Individually owned unit in a larger building',
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: 'Multi-unit residential building complex',
  [PROPERTY_TYPES.STUDIO]: 'Single-room living space with kitchenette',
  [PROPERTY_TYPES.LOFT]: 'Open-plan living space, often in converted buildings',
  [PROPERTY_TYPES.OFFICE_BUILDING]: 'Commercial building for office use',
  [PROPERTY_TYPES.RETAIL_SPACE]: 'Commercial space for retail businesses',
  [PROPERTY_TYPES.WAREHOUSE]: 'Large storage and distribution facility',
  [PROPERTY_TYPES.INDUSTRIAL]: 'Property for manufacturing or industrial use',
  [PROPERTY_TYPES.MIXED_USE]: 'Property combining residential and commercial use',
  [PROPERTY_TYPES.STUDENT_HOUSING]: 'Housing specifically designed for students',
  [PROPERTY_TYPES.SENIOR_LIVING]: 'Housing designed for senior residents',
  [PROPERTY_TYPES.AFFORDABLE_HOUSING]: 'Housing with income-restricted tenancy',
  [PROPERTY_TYPES.LUXURY_HOUSING]: 'High-end residential property with premium amenities',
  [PROPERTY_TYPES.SHORT_TERM_RENTAL]: 'Property for short-term stays (under 30 days)',
  [PROPERTY_TYPES.VACATION_RENTAL]: 'Property for vacation and holiday rentals',
  [PROPERTY_TYPES.MOBILE_HOME]: 'Prefabricated home designed for mobility',
  [PROPERTY_TYPES.MANUFACTURED_HOME]: 'Factory-built home on permanent foundation',
  [PROPERTY_TYPES.TINY_HOME]: 'Small residential dwelling under 600 sq ft',
  [PROPERTY_TYPES.CO_LIVING]: 'Shared living space with private and common areas',
  [PROPERTY_TYPES.CO_WORKING]: 'Shared workspace for professionals and businesses'
};

/**
 * Property category mappings
 */
export const PROPERTY_CATEGORY_MAPPING = {
  [PROPERTY_CATEGORIES.RESIDENTIAL]: [
    PROPERTY_TYPES.SINGLE_FAMILY,
    PROPERTY_TYPES.DUPLEX,
    PROPERTY_TYPES.TRIPLEX,
    PROPERTY_TYPES.FOURPLEX,
    PROPERTY_TYPES.TOWNHOUSE,
    PROPERTY_TYPES.CONDOMINIUM,
    PROPERTY_TYPES.APARTMENT_COMPLEX,
    PROPERTY_TYPES.STUDIO,
    PROPERTY_TYPES.LOFT
  ],
  [PROPERTY_CATEGORIES.COMMERCIAL]: [
    PROPERTY_TYPES.OFFICE_BUILDING,
    PROPERTY_TYPES.RETAIL_SPACE,
    PROPERTY_TYPES.WAREHOUSE,
    PROPERTY_TYPES.INDUSTRIAL,
    PROPERTY_TYPES.CO_WORKING
  ],
  [PROPERTY_CATEGORIES.MIXED_USE]: [
    PROPERTY_TYPES.MIXED_USE
  ],
  [PROPERTY_CATEGORIES.SPECIALIZED]: [
    PROPERTY_TYPES.STUDENT_HOUSING,
    PROPERTY_TYPES.SENIOR_LIVING,
    PROPERTY_TYPES.AFFORDABLE_HOUSING,
    PROPERTY_TYPES.LUXURY_HOUSING,
    PROPERTY_TYPES.SHORT_TERM_RENTAL,
    PROPERTY_TYPES.VACATION_RENTAL
  ],
  [PROPERTY_CATEGORIES.ALTERNATIVE]: [
    PROPERTY_TYPES.MOBILE_HOME,
    PROPERTY_TYPES.MANUFACTURED_HOME,
    PROPERTY_TYPES.TINY_HOME,
    PROPERTY_TYPES.CO_LIVING
  ]
};

/**
 * Property type characteristics
 */
export const PROPERTY_TYPE_CHARACTERISTICS = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: {
    typicalUnits: 1,
    averageSize: '1500-3000',
    parkingSpaces: '1-3',
    outdoorSpace: true,
    petFriendly: true,
    familyFriendly: true,
    maintenanceComplexity: 'medium',
    investmentType: 'residential'
  },
  [PROPERTY_TYPES.DUPLEX]: {
    typicalUnits: 2,
    averageSize: '800-1500',
    parkingSpaces: '2-4',
    outdoorSpace: true,
    petFriendly: true,
    familyFriendly: true,
    maintenanceComplexity: 'medium',
    investmentType: 'residential'
  },
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: {
    typicalUnits: '10-200',
    averageSize: '500-1200',
    parkingSpaces: '1-2',
    outdoorSpace: false,
    petFriendly: 'varies',
    familyFriendly: true,
    maintenanceComplexity: 'high',
    investmentType: 'commercial'
  },
  [PROPERTY_TYPES.STUDIO]: {
    typicalUnits: 1,
    averageSize: '300-600',
    parkingSpaces: '0-1',
    outdoorSpace: false,
    petFriendly: 'limited',
    familyFriendly: false,
    maintenanceComplexity: 'low',
    investmentType: 'residential'
  },
  [PROPERTY_TYPES.OFFICE_BUILDING]: {
    typicalUnits: '5-100',
    averageSize: '1000-10000',
    parkingSpaces: '2-5 per 1000 sq ft',
    outdoorSpace: false,
    petFriendly: false,
    familyFriendly: false,
    maintenanceComplexity: 'high',
    investmentType: 'commercial'
  },
  [PROPERTY_TYPES.STUDENT_HOUSING]: {
    typicalUnits: '50-500',
    averageSize: '400-800',
    parkingSpaces: '0.5-1',
    outdoorSpace: 'common areas',
    petFriendly: 'limited',
    familyFriendly: false,
    maintenanceComplexity: 'high',
    investmentType: 'specialized'
  }
};

/**
 * Property type icons and colors
 */
export const PROPERTY_TYPE_STYLING = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: {
    icon: '🏠',
    color: '#10B981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  [PROPERTY_TYPES.DUPLEX]: {
    icon: '🏘️',
    color: '#3B82F6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: {
    icon: '🏢',
    color: '#8B5CF6',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  },
  [PROPERTY_TYPES.TOWNHOUSE]: {
    icon: '🏘️',
    color: '#F59E0B',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  [PROPERTY_TYPES.CONDOMINIUM]: {
    icon: '🏬',
    color: '#EF4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  [PROPERTY_TYPES.STUDIO]: {
    icon: '🏠',
    color: '#6B7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  [PROPERTY_TYPES.OFFICE_BUILDING]: {
    icon: '🏢',
    color: '#1F2937',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  [PROPERTY_TYPES.RETAIL_SPACE]: {
    icon: '🏪',
    color: '#DC2626',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  [PROPERTY_TYPES.WAREHOUSE]: {
    icon: '🏭',
    color: '#7C2D12',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  [PROPERTY_TYPES.STUDENT_HOUSING]: {
    icon: '🎓',
    color: '#059669',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800'
  },
  [PROPERTY_TYPES.LUXURY_HOUSING]: {
    icon: '✨',
    color: '#7C3AED',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-800'
  }
};

/**
 * Lease term preferences by property type
 */
export const PROPERTY_TYPE_LEASE_TERMS = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: ['12 months', '24 months'],
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: ['6 months', '12 months', '18 months'],
  [PROPERTY_TYPES.STUDIO]: ['6 months', '12 months'],
  [PROPERTY_TYPES.STUDENT_HOUSING]: ['9 months', '12 months', 'Academic year'],
  [PROPERTY_TYPES.SHORT_TERM_RENTAL]: ['Daily', 'Weekly', 'Monthly'],
  [PROPERTY_TYPES.OFFICE_BUILDING]: ['12 months', '24 months', '36 months', '60 months'],
  [PROPERTY_TYPES.RETAIL_SPACE]: ['12 months', '24 months', '36 months', '60 months'],
  [PROPERTY_TYPES.CO_LIVING]: ['1 month', '3 months', '6 months', '12 months'],
  [PROPERTY_TYPES.CO_WORKING]: ['Monthly', '3 months', '6 months', '12 months']
};

/**
 * Required amenities by property type
 */
export const PROPERTY_TYPE_REQUIRED_AMENITIES = {
  [PROPERTY_TYPES.STUDENT_HOUSING]: [
    'High-speed internet',
    'Study areas',
    'Laundry facilities',
    'Security system'
  ],
  [PROPERTY_TYPES.SENIOR_LIVING]: [
    'Accessibility features',
    'Emergency call system',
    'Medical facilities nearby',
    'Transportation services'
  ],
  [PROPERTY_TYPES.LUXURY_HOUSING]: [
    'Concierge service',
    'Fitness center',
    'Premium finishes',
    'Valet parking'
  ],
  [PROPERTY_TYPES.CO_LIVING]: [
    'Shared kitchen',
    'Common areas',
    'High-speed internet',
    'Cleaning service'
  ],
  [PROPERTY_TYPES.CO_WORKING]: [
    'High-speed internet',
    'Meeting rooms',
    'Printing facilities',
    'Kitchen/break area'
  ]
};

/**
 * Property type market segments
 */
export const PROPERTY_TYPE_MARKET_SEGMENTS = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: ['Families', 'Young professionals', 'Empty nesters'],
  [PROPERTY_TYPES.STUDIO]: ['Young professionals', 'Students', 'Singles'],
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: ['Young professionals', 'Families', 'Seniors'],
  [PROPERTY_TYPES.STUDENT_HOUSING]: ['College students', 'Graduate students'],
  [PROPERTY_TYPES.SENIOR_LIVING]: ['Seniors 55+', 'Retirees'],
  [PROPERTY_TYPES.LUXURY_HOUSING]: ['High-income professionals', 'Executives', 'Affluent families'],
  [PROPERTY_TYPES.SHORT_TERM_RENTAL]: ['Tourists', 'Business travelers', 'Temporary residents'],
  [PROPERTY_TYPES.CO_LIVING]: ['Young professionals', 'Digital nomads', 'Recent graduates'],
  [PROPERTY_TYPES.OFFICE_BUILDING]: ['Corporations', 'Small businesses', 'Startups'],
  [PROPERTY_TYPES.RETAIL_SPACE]: ['Retailers', 'Restaurants', 'Service businesses']
};

/**
 * Property type investment metrics
 */
export const PROPERTY_TYPE_INVESTMENT_METRICS = {
  [PROPERTY_TYPES.SINGLE_FAMILY]: {
    averageCapRate: '4-8%',
    appreciationPotential: 'Medium-High',
    cashFlowPotential: 'Medium',
    managementIntensity: 'Low-Medium',
    liquidityLevel: 'High'
  },
  [PROPERTY_TYPES.APARTMENT_COMPLEX]: {
    averageCapRate: '5-10%',
    appreciationPotential: 'Medium',
    cashFlowPotential: 'High',
    managementIntensity: 'High',
    liquidityLevel: 'Medium'
  },
  [PROPERTY_TYPES.OFFICE_BUILDING]: {
    averageCapRate: '6-12%',
    appreciationPotential: 'Medium',
    cashFlowPotential: 'High',
    managementIntensity: 'Medium-High',
    liquidityLevel: 'Low-Medium'
  },
  [PROPERTY_TYPES.STUDENT_HOUSING]: {
    averageCapRate: '5-9%',
    appreciationPotential: 'Medium',
    cashFlowPotential: 'High',
    managementIntensity: 'High',
    liquidityLevel: 'Low'
  },
  [PROPERTY_TYPES.SHORT_TERM_RENTAL]: {
    averageCapRate: '8-15%',
    appreciationPotential: 'Medium-High',
    cashFlowPotential: 'High',
    managementIntensity: 'Very High',
    liquidityLevel: 'Medium'
  }
};

/**
 * Property type utility functions
 */
export const PROPERTY_TYPE_UTILS = {
  /**
   * Get property type display name
   * @param {string} propertyType - Property type key
   * @returns {string} Display name
   */
  getDisplayName: (propertyType) => {
    return PROPERTY_TYPE_DISPLAY_NAMES[propertyType] || propertyType;
  },

  /**
   * Get property type description
   * @param {string} propertyType - Property type key
   * @returns {string} Description
   */
  getDescription: (propertyType) => {
    return PROPERTY_TYPE_DESCRIPTIONS[propertyType] || '';
  },

  /**
   * Get property type category
   * @param {string} propertyType - Property type key
   * @returns {string} Category
   */
  getCategory: (propertyType) => {
    for (const [category, types] of Object.entries(PROPERTY_CATEGORY_MAPPING)) {
      if (types.includes(propertyType)) {
        return category;
      }
    }
    return PROPERTY_CATEGORIES.RESIDENTIAL;
  },

  /**
   * Get property types by category
   * @param {string} category - Category key
   * @returns {Array} Property types in category
   */
  getTypesByCategory: (category) => {
    return PROPERTY_CATEGORY_MAPPING[category] || [];
  },

  /**
   * Get property type styling
   * @param {string} propertyType - Property type key
   * @returns {Object} Styling information
   */
  getStyling: (propertyType) => {
    return PROPERTY_TYPE_STYLING[propertyType] || {
      icon: '🏠',
      color: '#6B7280',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    };
  },

  /**
   * Get property type characteristics
   * @param {string} propertyType - Property type key
   * @returns {Object} Characteristics
   */
  getCharacteristics: (propertyType) => {
    return PROPERTY_TYPE_CHARACTERISTICS[propertyType] || {};
  },

  /**
   * Get recommended lease terms
   * @param {string} propertyType - Property type key
   * @returns {Array} Recommended lease terms
   */
  getRecommendedLeaseTerms: (propertyType) => {
    return PROPERTY_TYPE_LEASE_TERMS[propertyType] || ['12 months'];
  },

  /**
   * Get required amenities
   * @param {string} propertyType - Property type key
   * @returns {Array} Required amenities
   */
  getRequiredAmenities: (propertyType) => {
    return PROPERTY_TYPE_REQUIRED_AMENITIES[propertyType] || [];
  },

  /**
   * Get target market segments
   * @param {string} propertyType - Property type key
   * @returns {Array} Market segments
   */
  getMarketSegments: (propertyType) => {
    return PROPERTY_TYPE_MARKET_SEGMENTS[propertyType] || [];
  },

  /**
   * Get investment metrics
   * @param {string} propertyType - Property type key
   * @returns {Object} Investment metrics
   */
  getInvestmentMetrics: (propertyType) => {
    return PROPERTY_TYPE_INVESTMENT_METRICS[propertyType] || {};
  },

  /**
   * Check if property type is residential
   * @param {string} propertyType - Property type key
   * @returns {boolean} Whether property type is residential
   */
  isResidential: (propertyType) => {
    return PROPERTY_CATEGORY_MAPPING[PROPERTY_CATEGORIES.RESIDENTIAL].includes(propertyType);
  },

  /**
   * Check if property type is commercial
   * @param {string} propertyType - Property type key
   * @returns {boolean} Whether property type is commercial
   */
  isCommercial: (propertyType) => {
    return PROPERTY_CATEGORY_MAPPING[PROPERTY_CATEGORIES.COMMERCIAL].includes(propertyType);
  },

  /**
   * Filter property types by category
   * @param {Array} propertyTypes - Property types to filter
   * @param {string} category - Category to filter by
   * @returns {Array} Filtered property types
   */
  filterByCategory: (propertyTypes, category) => {
    const categoryTypes = PROPERTY_CATEGORY_MAPPING[category] || [];
    return propertyTypes.filter(type => categoryTypes.includes(type));
  }
};

// Export all property type constants and utilities
export default {
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  PROPERTY_TYPE_DISPLAY_NAMES,
  PROPERTY_TYPE_DESCRIPTIONS,
  PROPERTY_CATEGORY_MAPPING,
  PROPERTY_TYPE_CHARACTERISTICS,
  PROPERTY_TYPE_STYLING,
  PROPERTY_TYPE_LEASE_TERMS,
  PROPERTY_TYPE_REQUIRED_AMENITIES,
  PROPERTY_TYPE_MARKET_SEGMENTS,
  PROPERTY_TYPE_INVESTMENT_METRICS,
  PROPERTY_TYPE_UTILS
};