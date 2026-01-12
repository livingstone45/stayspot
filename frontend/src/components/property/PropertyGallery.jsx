import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon,
  PhotoIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const PropertyGallery = ({
  images = [],
  onAddImages,
  onRemoveImage,
  onReorderImages,
  onSetPrimary,
  maxImages = 20,
  readOnly = false,
  title = 'Property Gallery',
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  
  const handleImageClick = (image, index) => {
    if (readOnly) {
      setSelectedImage({ image, index });
      setLightboxOpen(true);
    }
  };
  
  const handleAddImages = (e) => {
    if (!onAddImages || readOnly) return;
    
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 10 * 1024 * 1024 // 10MB max
    );
    
    if (validImages.length === 0) {
      alert('Please select valid image files (max 10MB each)');
      return;
    }
    
    if (images.length + validImages.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      return;
    }
    
    onAddImages(validImages);
  };
  
  const handleRemove = (image, index) => {
    if (onRemoveImage && !readOnly) {
      onRemoveImage(image, index);
    }
  };
  
  const handleSetPrimary = (image, index) => {
    if (onSetPrimary && !readOnly) {
      onSetPrimary(image, index);
    }
  };
  
  const handleDragStart = (e, index) => {
    if (readOnly || !onReorderImages) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Use a transparent image as drag image
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (readOnly || !onReorderImages) return;
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (readOnly || !onReorderImages || draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    onReorderImages(newImages);
    setDraggedIndex(null);
  };
  
  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };
  
  const navigateLightbox = (direction) => {
    if (!selectedImage) return;
    
    let newIndex = selectedImage.index + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    setSelectedImage({
      image: images[newIndex],
      index: newIndex,
    });
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImage]);
  
  if (images.length === 0 && readOnly) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <PhotoIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Available</h3>
        <p className="text-gray-600">This property doesn't have any images yet.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {images.length} {images.length === 1 ? 'image' : 'images'} • {readOnly ? 'View only' : 'Click to edit'}
          </p>
        </div>
        
        {!readOnly && onAddImages && (
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
              className="hidden"
              disabled={images.length >= maxImages}
            />
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Images
            </div>
          </label>
        )}
      </div>
      
      {/* Primary Image */}
      {primaryImage && (
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            {imageErrors[primaryImage.id] ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Image failed to load</p>
                </div>
              </div>
            ) : (
              <img
                src={primaryImage.url || primaryImage}
                alt="Primary property view"
                className="w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleImageClick(primaryImage, images.indexOf(primaryImage))}
                onError={() => handleImageError(primaryImage.id)}
              />
            )}
            
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                Primary Photo
              </span>
            </div>
            
            {!readOnly && (
              <div className="absolute top-4 right-4 flex space-x-2">
                {onSetPrimary && !primaryImage.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(primaryImage, images.indexOf(primaryImage))}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                    title="Set as primary"
                  >
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                )}
                
                {onRemoveImage && (
                  <button
                    onClick={() => handleRemove(primaryImage, images.indexOf(primaryImage))}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                    title="Remove image"
                  >
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">All Photos ({images.length})</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => {
              const isPrimary = image.isPrimary || image === primaryImage;
              const isDragging = draggedIndex === index;
              const hasError = imageErrors[image.id];
              
              return (
                <div
                  key={image.id || index}
                  className={`relative group rounded-lg overflow-hidden bg-gray-100 ${
                    isDragging ? 'opacity-50' : ''
                  } ${
                    !readOnly && onReorderImages ? 'cursor-move' : 'cursor-pointer'
                  }`}
                  draggable={!readOnly && !!onReorderImages}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={() => setDraggedIndex(null)}
                >
                  {/* Image or placeholder */}
                  {hasError ? (
                    <div className="aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <PhotoIcon className="h-8 w-8 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Error</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={image.url || image}
                      alt={`Property view ${index + 1}`}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                      onClick={() => handleImageClick(image, index)}
                      onError={() => handleImageError(image.id)}
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    {!readOnly && (
                      <div className="flex space-x-2">
                        {onSetPrimary && !isPrimary && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetPrimary(image, index);
                            }}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                            title="Set as primary"
                          >
                            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        )}
                        
                        {onRemoveImage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(image, index);
                            }}
                            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                            title="Remove image"
                          >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Primary badge */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        Primary
                      </span>
                    </div>
                  )}
                  
                  {/* Drag handle */}
                  {!readOnly && onReorderImages && (
                    <div className="absolute top-2 right-2">
                      <div className="p-1 bg-white/80 backdrop-blur-sm rounded">
                        <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Add more images slot */}
            {!readOnly && onAddImages && images.length < maxImages && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddImages}
                  className="hidden"
                />
                <PlusIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Add Photos</span>
                <span className="text-xs text-gray-500 mt-1">
                  {maxImages - images.length} remaining
                </span>
              </label>
            )}
          </div>
        </div>
      )}
      
      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          
          <button
            onClick={() => navigateLightbox(-1)}
            className="absolute left-4 p-3 text-white hover:text-gray-300"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          
          <button
            onClick={() => navigateLightbox(1)}
            className="absolute right-4 p-3 text-white hover:text-gray-300"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
            <img
              src={selectedImage.image.url || selectedImage.image}
              alt={`Property view ${selectedImage.index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImage.index + 1} of {images.length}
            {selectedImage.image.isPrimary && ' • Primary Photo'}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      {!readOnly && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-blue-600">1</span>
              </div>
              <span>Upload high-quality photos (max 10MB each)</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-blue-600">2</span>
              </div>
              <span>Drag and drop to reorder images</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-blue-600">3</span>
              </div>
              <span>First image will be set as primary, or click the star icon</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-blue-600">4</span>
              </div>
              <span>Maximum {maxImages} images per property</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;