'use client';

import React from 'react';
import { MapPin, Home, Users, Calendar, TrendingDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useShortlist } from '@/contexts/ShortlistContext';
import type { Property } from '@/types';

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

const safeConfigurations = (configs: any): string[] => {
  if (!configs) return [];
  if (!Array.isArray(configs)) return [String(configs)];
  return configs.map((c: any) => (typeof c === 'string' ? c : c?.name || c?.type || String(c)));
};

const safeSavings = (s: any): string => {
  if (!s) return '';
  if (typeof s === 'string') return s;
  if (typeof s === 'object' && s !== null) {
    const min = s.min ?? 0;
    const max = s.max ?? 0;
    const fmt = (v: number) => v >= 100000 ? `${(v / 100000).toFixed(0)} Lacs` : `${v}`;
    return max ? `₹${fmt(min)} - ₹${fmt(max)}` : `₹${fmt(min)}`;
  }
  return String(s);
};

const safeDate = (d: any): string => {
  if (!d) return '';
  if (typeof d === 'string' && d.includes('T')) {
    try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; }
  }
  return String(d);
};

interface PropertyCardProps {
  property: Property;
  onJoinGroup: (property: Property) => void;
  onViewMore: (property: Property) => void;
}

const statusLabels = {
  'newly-launched': 'Newly Launched',
  'under-construction': 'Under Construction',
  'ready-to-move': 'Ready to Move',
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onJoinGroup, onViewMore }) => {
  const pid = property._id || property.id || '';
  const positionsLeft = property.totalPositions - property.buyersJoined;
  const { addToShortlist, removeFromShortlist, isShortlisted } = useShortlist();
  const shortlisted = isShortlisted(pid);

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shortlisted) {
      removeFromShortlist(pid);
    } else {
      addToShortlist({
        id: pid,
        name: property.name || '',
        developer: property.developer || '',
        location: property.location || '',
        priceRange: safePriceRange(property.priceRange),
        image: property.image || '/placeholder.svg',
        configurations: property.configurations || [],
        addedDate: new Date().toLocaleDateString(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-property group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground text-xs">
            {statusLabels[property.status]}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleShortlist}
            className={`p-2 rounded-lg transition-colors ${shortlisted
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/90 backdrop-blur-sm text-foreground hover:bg-background'
              }`}
          >
            <Heart className={`w-5 h-5 ${shortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium">
            <TrendingDown className="w-4 h-4" />
            {safeSavings(property.estimatedSavings)} savings
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Location */}
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-1">
            {property.name}
          </h3>
          <p className="text-sm text-muted-foreground">{property.developer}</p>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            {property.location}
          </div>
        </div>

        {/* Configuration & Price */}
        <div className="flex items-center justify-between py-3 border-y border-border">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {safeConfigurations(property.configurations).join(', ')}
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {safePriceRange(property.priceRange)}
          </span>
        </div>

        {/* Buyers Interest */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Buyer Interest</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {property.buyersJoined} joined • {positionsLeft} positions left
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-brand rounded-full transition-all duration-500"
              style={{ width: `${property.totalPositions > 0 ? (property.buyersJoined / property.totalPositions) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Join before: <span className="font-medium text-foreground">{safeDate(property.joinBefore)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onJoinGroup(property)}
            className="flex-1 btn-primary"
          >
            Join Group
          </Button>
          <Button
            onClick={() => onViewMore(property)}
            variant="outline"
            className="flex-1 btn-outline"
          >
            View More
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
