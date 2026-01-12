const { PropertyImage, Property } = require('../../models');

class AIProcessingService {
  async analyzePropertyImages(propertyId) {
    const images = await PropertyImage.findAll({
      where: { property_id: propertyId }
    });

    const analysis = {
      totalImages: images.length,
      imageTypes: {},
      qualityScore: 0,
      suggestions: []
    };

    // Analyze image types
    images.forEach(image => {
      const type = image.type || 'other';
      analysis.imageTypes[type] = (analysis.imageTypes[type] || 0) + 1;
    });

    // Generate suggestions
    if (!analysis.imageTypes.exterior) {
      analysis.suggestions.push('Add exterior photos to showcase the property');
    }
    
    if (!analysis.imageTypes.kitchen) {
      analysis.suggestions.push('Add kitchen photos - they are important for tenants');
    }
    
    if (analysis.totalImages < 5) {
      analysis.suggestions.push('Add more photos to better showcase the property');
    }

    // Calculate quality score (simplified)
    analysis.qualityScore = Math.min(100, (analysis.totalImages * 10) + 
      (Object.keys(analysis.imageTypes).length * 15));

    return analysis;
  }

  async extractImageMetadata(imageId) {
    const image = await PropertyImage.findByPk(imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // In a real implementation, this would use AI services like AWS Rekognition
    // For now, return mock metadata
    return {
      imageId,
      detectedObjects: ['room', 'furniture', 'window'],
      colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0'],
      brightness: 0.7,
      contrast: 0.6,
      quality: 'good',
      suggestions: [
        'Image is well-lit',
        'Good composition',
        'Consider adding more angles'
      ]
    };
  }

  async generatePropertyDescription(propertyId) {
    const property = await Property.findByPk(propertyId, {
      include: [
        { model: PropertyImage, as: 'images' }
      ]
    });

    if (!property) {
      throw new Error('Property not found');
    }

    // Generate description based on property data
    let description = `Beautiful ${property.type} located in ${property.city}, ${property.state}. `;
    
    if (property.year_built) {
      description += `Built in ${property.year_built}, `;
    }
    
    if (property.property_size) {
      description += `featuring ${property.property_size} sq ft of living space. `;
    }

    if (property.amenities && property.amenities.length > 0) {
      description += `Amenities include: ${property.amenities.join(', ')}. `;
    }

    description += `This property offers ${property.total_units} unit${property.total_units > 1 ? 's' : ''} `;
    description += `with monthly rent starting at $${property.monthly_rent}.`;

    return {
      generatedDescription: description,
      confidence: 0.8,
      suggestions: [
        'Review and customize the generated description',
        'Add unique selling points',
        'Include neighborhood highlights'
      ]
    };
  }

  async analyzeMarketPosition(propertyId) {
    const property = await Property.findByPk(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Find comparable properties
    const comparables = await Property.findAll({
      where: {
        city: property.city,
        state: property.state,
        type: property.type,
        id: { [Op.ne]: propertyId },
        status: 'active'
      },
      limit: 10
    });

    if (comparables.length === 0) {
      return {
        position: 'unique',
        averageRent: property.monthly_rent,
        suggestion: 'No comparable properties found in the area'
      };
    }

    const averageRent = comparables.reduce((sum, p) => sum + parseFloat(p.monthly_rent), 0) / comparables.length;
    const propertyRent = parseFloat(property.monthly_rent);
    
    let position = 'average';
    let suggestion = 'Property is priced competitively';
    
    if (propertyRent > averageRent * 1.1) {
      position = 'premium';
      suggestion = 'Property is priced above market average';
    } else if (propertyRent < averageRent * 0.9) {
      position = 'budget';
      suggestion = 'Property is priced below market average';
    }

    return {
      position,
      propertyRent,
      averageRent: Math.round(averageRent),
      comparableCount: comparables.length,
      suggestion,
      priceVariance: ((propertyRent - averageRent) / averageRent * 100).toFixed(1)
    };
  }

  async suggestAmenities(propertyId) {
    const property = await Property.findByPk(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const currentAmenities = property.amenities || [];
    const commonAmenities = [
      'parking', 'laundry', 'gym', 'pool', 'balcony', 'air_conditioning',
      'heating', 'dishwasher', 'microwave', 'wifi', 'cable_ready'
    ];

    const suggestions = commonAmenities
      .filter(amenity => !currentAmenities.includes(amenity))
      .slice(0, 5);

    return {
      currentAmenities,
      suggestedAmenities: suggestions,
      popularInArea: ['parking', 'laundry', 'air_conditioning'] // Mock data
    };
  }

  async optimizeImageOrder(propertyId) {
    const images = await PropertyImage.findAll({
      where: { property_id: propertyId },
      order: [['display_order', 'ASC']]
    });

    // Optimal order: main -> exterior -> interior -> amenities -> other
    const typeOrder = {
      main: 1,
      exterior: 2,
      interior: 3,
      kitchen: 4,
      bathroom: 5,
      bedroom: 6,
      living_room: 7,
      amenity: 8,
      other: 9
    };

    const sortedImages = images.sort((a, b) => {
      const orderA = typeOrder[a.type] || 9;
      const orderB = typeOrder[b.type] || 9;
      return orderA - orderB;
    });

    // Update display orders
    const updates = sortedImages.map((image, index) => 
      image.update({ display_order: index + 1 })
    );

    await Promise.all(updates);

    return {
      reordered: images.length,
      newOrder: sortedImages.map(img => ({
        id: img.id,
        type: img.type,
        order: img.display_order
      }))
    };
  }
}

module.exports = new AIProcessingService();