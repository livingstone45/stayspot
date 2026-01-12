import React, { useState } from 'react';
import { X, Home, MapPin, DollarSign, Building2, Upload, Trash2, Wifi, Zap, Droplet, Check } from 'lucide-react';

const AddPropertyModal = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [formData, setFormData] = useState({
    propertyName: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    propertyType: 'apartment',
    numberOfUnits: '',
    monthlyIncome: '',
    propertyValue: '',
    bedrooms: '',
    bathrooms: '',
    condition: 'good',
    yearBuilt: ''
  });

  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'electricity', label: 'Electricity', icon: Zap },
    { id: 'water', label: 'Water', icon: Droplet },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
    { id: 'garden', label: 'Garden', icon: '🌳' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: 'security', label: '24/7 Security', icon: '🔒' }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, { id: Date.now() + Math.random(), src: event.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onAdd({ ...formData, image: images[0]?.src || 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=500&h=300&fit=crop', images, amenities: selectedAmenities });
    setStep(1);
    setFormData({ propertyName: '', address: '', city: '', latitude: '', longitude: '', propertyType: 'apartment', numberOfUnits: '', monthlyIncome: '', propertyValue: '', bedrooms: '', bathrooms: '', condition: 'good', yearBuilt: '' });
    setImages([]);
    setSelectedAmenities([]);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ propertyName: '', address: '', city: '', latitude: '', longitude: '', propertyType: 'apartment', numberOfUnits: '', monthlyIncome: '', propertyValue: '', bedrooms: '', bathrooms: '', condition: 'good', yearBuilt: '' });
    setImages([]);
    setSelectedAmenities([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-orange-900/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Home className="text-white" size={24} />
            <h2 className="text-2xl font-bold text-white">Add New Property</h2>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 px-6 py-4 bg-slate-800/50 border-b border-orange-900/20">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-slate-700'}`}></div>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto text-slate-100">
          {/* Step 1: Images & Basic */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2">Property Images</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group">
                      <img src={img.src} alt="property" className="w-full h-24 object-cover rounded-lg border border-orange-900/30" />
                      <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-orange-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-orange-600/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-900/20 transition bg-slate-800/50">
                    <Upload className="text-orange-500 mb-1" size={20} />
                    <span className="text-xs font-medium text-orange-400">Upload</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2">Property Name</label>
                <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} placeholder="e.g., Sunset Apartments" className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-orange-400 mb-2">Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-orange-400 mb-2">Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs-repair">Needs Repair</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" /> Address
                </label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} placeholder="Year Built" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" step="0.0001" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" step="0.0001" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
          )}

          {/* Step 3: Details & Amenities */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="number" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} placeholder="Units" className="px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-3">Amenities</label>
                <div className="grid grid-cols-4 gap-2">
                  {amenities.map(amenity => {
                    const Icon = typeof amenity.icon === 'string' ? null : amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                          selectedAmenities.includes(amenity.id)
                            ? 'border-orange-500 bg-orange-900/30 text-orange-300'
                            : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-orange-600/50'
                        }`}
                      >
                        {Icon ? <Icon size={16} className="mx-auto mb-1" /> : <span className="text-lg">{amenity.icon}</span>}
                        {amenity.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                  <DollarSign size={16} className="text-orange-500" /> Monthly Income (KES)
                </label>
                <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} placeholder="e.g., 150000" className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                  <DollarSign size={16} className="text-orange-500" /> Property Value (KES)
                </label>
                <input type="number" name="propertyValue" value={formData.propertyValue} onChange={handleChange} placeholder="e.g., 5000000" className="w-full px-4 py-2 border border-orange-900/30 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
                <p className="text-sm text-orange-400 font-medium">Summary</p>
                <div className="text-xs text-orange-300 mt-2 space-y-1">
                  <p>Property: {formData.propertyName}</p>
                  <p>Location: {formData.city}</p>
                  <p>Units: {formData.numberOfUnits}</p>
                  <p>Images: {images.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800/50 px-6 py-4 flex gap-3 border-t border-orange-900/20 rounded-b-2xl">
          <button onClick={() => step > 1 ? setStep(step - 1) : handleClose()} className="flex-1 px-4 py-2 border-2 border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-colors">
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all flex items-center justify-center gap-2"
          >
            {step === 4 ? <><Check size={18} /> Add Property</> : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;
