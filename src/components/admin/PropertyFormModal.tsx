'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Property, PropertyGalleryImage } from '@/types';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
  initialData?: Property;
  isEditing: boolean;
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing,
}) => {
  const [formData, setFormData] = useState<Property>(
    initialData || {
      id: '',
      name: '',
      developer: '',
      location: '',
      configurations: [],
      priceRange: '',
      estimatedSavings: '',
      buyersJoined: 0,
      totalPositions: 0,
      joinBefore: '',
      status: 'under-construction',
      image: '',
      amenities: [],
      gallery: [],
      totalGroups: 0,
    }
  );

  const [configInput, setConfigInput] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');

  const handleAddConfiguration = () => {
    if (configInput.trim()) {
      setFormData(prev => ({
        ...prev,
        configurations: [...prev.configurations, configInput.trim()]
      }));
      setConfigInput('');
    }
  };

  const handleRemoveConfiguration = (index: number) => {
    setFormData(prev => ({
      ...prev,
      configurations: prev.configurations.filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleAddGalleryImage = () => {
    if (galleryImageUrl.trim()) {
      const newImage: PropertyGalleryImage = {
        url: galleryImageUrl.trim(),
        caption: galleryCaption.trim() || 'Property Image'
      };
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), newImage]
      }));
      setGalleryImageUrl('');
      setGalleryCaption('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.developer || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Property Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Godrej Garden City"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Developer *</Label>
                    <Input
                      value={formData.developer}
                      onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                      placeholder="e.g., Godrej Properties"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., SG Highway, Ahmedabad"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Price Range *</Label>
                    <Input
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      placeholder="₹85 Lacs - ₹2.1 Cr"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Estimated Savings *</Label>
                    <Input
                      value={formData.estimatedSavings}
                      onChange={(e) => setFormData({ ...formData, estimatedSavings: e.target.value })}
                      placeholder="₹3-8 Lacs"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Status *</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 mt-2 border border-stone-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D92228]"
                    >
                      <option value="under-construction">Under Construction</option>
                      <option value="newly-launched">Newly Launched</option>
                      <option value="ready-to-move">Ready to Move</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Join Before Date *</Label>
                  <Input
                    value={formData.joinBefore}
                    onChange={(e) => setFormData({ ...formData, joinBefore: e.target.value })}
                    placeholder="15 Feb 2026"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Group & Slots */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900">Group & Slots</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Total Positions *</Label>
                    <Input
                      type="number"
                      value={formData.totalPositions}
                      onChange={(e) => setFormData({ ...formData, totalPositions: parseInt(e.target.value) || 0 })}
                      placeholder="25"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Buyers Joined</Label>
                    <Input
                      type="number"
                      value={formData.buyersJoined}
                      onChange={(e) => setFormData({ ...formData, buyersJoined: parseInt(e.target.value) || 0 })}
                      placeholder="12"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Total Groups</Label>
                    <Input
                      type="number"
                      value={formData.totalGroups || 0}
                      onChange={(e) => setFormData({ ...formData, totalGroups: parseInt(e.target.value) || 0 })}
                      placeholder="1"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Configurations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900">Configurations</h3>

                <div className="flex gap-2">
                  <Input
                    value={configInput}
                    onChange={(e) => setConfigInput(e.target.value)}
                    placeholder="e.g., 2 BHK"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddConfiguration()}
                  />
                  <Button
                    onClick={handleAddConfiguration}
                    className="bg-[#D92228] hover:bg-red-700 text-white"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.configurations.map((config, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-full text-sm"
                    >
                      {config}
                      <button
                        onClick={() => handleRemoveConfiguration(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900">Amenities</h3>

                <div className="flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g., Swimming Pool"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
                  />
                  <Button
                    onClick={handleAddAmenity}
                    className="bg-[#D92228] hover:bg-red-700 text-white"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                      <button
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900">Gallery Images</h3>

                <div className="space-y-2">
                  <Input
                    value={galleryImageUrl}
                    onChange={(e) => setGalleryImageUrl(e.target.value)}
                    placeholder="Image URL"
                  />
                  <Input
                    value={galleryCaption}
                    onChange={(e) => setGalleryCaption(e.target.value)}
                    placeholder="Image Caption (optional)"
                  />
                  <Button
                    onClick={handleAddGalleryImage}
                    className="w-full bg-[#D92228] hover:bg-red-700 text-white gap-2"
                  >
                    <Upload size={16} /> Add Image
                  </Button>
                </div>

                {formData.gallery && formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.gallery.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden border border-stone-200">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.caption}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end">
                          <div className="w-full p-2 text-white text-xs font-medium">
                            {image.caption}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-stone-900">Main Display Image</h3>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Main image URL"
                />
                {formData.image && (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Main"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-stone-200 mt-6">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#D92228] hover:bg-red-700 text-white"
              >
                {isEditing ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyFormModal;
