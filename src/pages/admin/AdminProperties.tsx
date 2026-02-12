'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyFormModal from '@/components/admin/PropertyFormModal';
import { propertyApi } from '@/services/adminApi';
import { Plus, Edit, Trash2, Eye, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Property } from '@/types';

const AdminProperties: React.FC = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const safePriceRange = (pr: any): string => {
    if (!pr) return '';
    if (typeof pr === 'string') return pr;
    if (typeof pr === 'object' && pr !== null) {
      const min = pr.min ?? pr.minimum ?? 0;
      const max = pr.max ?? pr.maximum ?? 0;
      const fmt = (v: number) => v >= 10000000 ? `${(v / 10000000).toFixed(1)} Cr` : v >= 100000 ? `${(v / 100000).toFixed(0)} Lacs` : `${v}`;
      return max ? `₹${fmt(min)} - ₹${fmt(max)}` : `₹${fmt(min)}+`;
    }
    return String(pr);
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getAll();
      // API may return { data: [...] } or { properties: [...] } or flat array
      const raw = response.data?.properties || response.data?.items || response.data || response.properties || response || [];
      const props = (Array.isArray(raw) ? raw : []).map((p: any) => ({
        ...p,
        _id: p._id || p.id || '',
        id: p.id || p._id || '',
        priceRange: safePriceRange(p.priceRange),
      }));
      setAllProperties(props);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filtered = allProperties.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowFormModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowFormModal(true);
  };

  const handleSaveProperty = async (property: Property) => {
    try {
      if (editingProperty?.id) {
        const response = await propertyApi.update(editingProperty.id, property);
        setAllProperties(allProperties.map(p => p.id === editingProperty.id ? (response.data || property) : p));
      } else {
        const response = await propertyApi.create(property);
        setAllProperties([...allProperties, response.data || { ...property, id: Date.now().toString() }]);
      }
      setShowFormModal(false);
      setEditingProperty(null);
    } catch (err: any) {
      console.error('Error saving property:', err);
      // Fallback to local state update
      if (editingProperty?.id) {
        setAllProperties(allProperties.map(p => p.id === editingProperty.id ? property : p));
      } else {
        setAllProperties([...allProperties, { ...property, id: Date.now().toString() }]);
      }
      setShowFormModal(false);
      setEditingProperty(null);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyApi.delete(id);
      setAllProperties(allProperties.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting property:', err);
      setAllProperties(allProperties.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Properties</h1>
            <p className="text-stone-600 text-sm mt-1">Manage all property listings ({allProperties.length})</p>
          </div>
          <Button onClick={handleAddProperty} className="bg-[#D92228] hover:bg-[#B01820] text-white gap-2">
            <Plus size={18} /> Add Property
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-stone-200">
          <Input placeholder="Search by title or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D92228]">
            <option value="all">All Status</option>
            <option value="newly-launched">Newly Launched</option>
            <option value="under-construction">Under Construction</option>
            <option value="ready-to-move">Ready to Move</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm mt-1">{searchTerm ? 'Try a different search term' : 'Add your first property to get started'}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Property Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Price Range</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Groups</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-stone-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((property) => (
                  <motion.tr key={property.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-900">{property.name}</p>
                      <p className="text-xs text-stone-500 mt-1">{property.developer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-700">
                        <MapPin size={16} className="text-stone-400" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-900 font-medium">
                        <DollarSign size={16} className="text-[#D92228]" />
                        <span className="text-sm">{typeof property.priceRange === 'string' ? property.priceRange : JSON.stringify(property.priceRange)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${property.status === 'newly-launched' ? 'bg-blue-100 text-blue-700' : property.status === 'under-construction' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {property.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-stone-900">{property.totalGroups || 0} groups</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="View"><Eye size={16} /></button>
                        <button onClick={() => handleEditProperty(property)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-600" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteProperty(property.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <PropertyFormModal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); setEditingProperty(null); }}
        onSave={handleSaveProperty}
        initialData={editingProperty || undefined}
        isEditing={!!editingProperty}
      />
    </>
  );
};

export default AdminProperties;
