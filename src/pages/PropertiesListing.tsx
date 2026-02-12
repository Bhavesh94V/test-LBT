'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Users, Home } from 'lucide-react';

const mockProperties = [
  {
    id: '1',
    name: 'Sky Heights Residency',
    developer: 'SkyLine Developers',
    location: 'Mumbai',
    image: 'https://via.placeholder.com/400x300',
    priceMin: 5000000,
    priceMax: 8000000,
    configurations: ['2BHK', '3BHK', '4BHK'],
    status: 'Newly Launched',
    buyersInterested: 245,
    totalPositions: 500,
    estimatedSavings: '₹15-25L',
    amenities: ['Pool', 'Gym', 'Clubhouse', 'Garden'],
  },
  {
    id: '2',
    name: 'Green Park Towers',
    developer: 'Green Developers',
    location: 'Bangalore',
    image: 'https://via.placeholder.com/400x300',
    priceMin: 4500000,
    priceMax: 7500000,
    configurations: ['1BHK', '2BHK', '3BHK'],
    status: 'Under Construction',
    buyersInterested: 189,
    totalPositions: 400,
    estimatedSavings: '₹12-20L',
    amenities: ['Pool', 'Gym', 'Park', 'Security'],
  },
  {
    id: '3',
    name: 'Ocean View Residences',
    developer: 'Coastal Builders',
    location: 'Pune',
    image: 'https://via.placeholder.com/400x300',
    priceMin: 3500000,
    priceMax: 6000000,
    configurations: ['1BHK', '2BHK', '3BHK'],
    status: 'Ready to Move',
    buyersInterested: 156,
    totalPositions: 300,
    estimatedSavings: '₹8-15L',
    amenities: ['Club', 'Garden', 'Gym'],
  },
];

export const PropertiesListing = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [filters, setFilters] = useState({
    location: '',
    priceMin: 0,
    priceMax: 10000000,
    configuration: '',
    status: '',
    amenities: [] as string[],
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleShortlist = (id: string) => {
    setShortlisted((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(0)}L`;

  const filteredProperties = properties.filter((prop) => {
    if (filters.location && !prop.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (prop.priceMin < filters.priceMin || prop.priceMax > filters.priceMax) return false;
    if (filters.configuration && !prop.configurations.includes(filters.configuration)) return false;
    if (filters.status && prop.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Property</h1>
          <p className="text-gray-600">Explore premium residential properties with group buying benefits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <Input
                    placeholder="Search location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Price Range</label>
                  <div className="space-y-2">
                    <Input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-600">
                      {formatCurrency(filters.priceMin)} - {formatCurrency(filters.priceMax)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Configuration</label>
                  <Select value={filters.configuration} onValueChange={(val) => handleFilterChange('configuration', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Newly Launched">Newly Launched</SelectItem>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Search</Button>
              </CardContent>
            </Card>
          </div>

          {/* Properties Grid/List */}
          <div className="lg:col-span-3">
            {/* View Toggle & Results */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">Showing {filteredProperties.length} properties</p>
              <div className="space-x-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Properties Display */}
            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleShortlist(property.id)}
                        className="bg-white rounded-full p-2 hover:bg-gray-100"
                      >
                        <Heart
                          className={`w-5 h-5 ${shortlisted.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-600">{property.status}</Badge>
                    </div>
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-1">{property.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location} • {property.developer}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Price Range</p>
                        <p className="font-semibold">
                          {formatCurrency(property.priceMin)} - {formatCurrency(property.priceMax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Est. Savings</p>
                        <p className="font-semibold text-green-600">{property.estimatedSavings}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="font-semibold">{property.buyersInterested}</span> interested
                      </div>
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1 text-gray-600" />
                        {property.totalPositions} positions
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        I&apos;m Interested
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
