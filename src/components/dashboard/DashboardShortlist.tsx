'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Heart, MapPin, Home, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShortlist } from '@/contexts/ShortlistContext';
import { useNavigate } from 'react-router-dom';

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

const DashboardShortlist: React.FC = () => {
    const { shortlistedProperties, removeFromShortlist } = useShortlist();
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Shortlist Properties</h2>
                <p className="text-stone-500">
                    {shortlistedProperties.length} properties shortlisted for you
                </p>
            </div>

            {shortlistedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shortlistedProperties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-shadow group"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-background">
                                <img
                                    src={property.image || "/placeholder.svg"}
                                    alt={property.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => removeFromShortlist(property.id)}
                                        className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                {/* Title */}
                                <div>
                                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{property.name}</h3>
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
                                        <span className="text-sm font-medium text-foreground">{property.configurations.join(', ')}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">{safePriceRange(property.priceRange)}</span>
                                </div>

                                {/* Added Date */}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Added on {property.addedDate ? new Date(property.addedDate).toLocaleDateString() : 'N/A'}</p>
                                    <div className="flex items-center gap-1 text-primary">
                                        <Heart className="w-4 h-4 fill-current" />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => navigate(`/properties/${property.id}`)}
                                        className="flex-1 btn-primary"
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        onClick={() => removeFromShortlist(property.id)}
                                        variant="outline"
                                        className="btn-outline"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-offwhite rounded-2xl">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="heading-card text-foreground mb-2">No Shortlisted Properties</h3>
                    <p className="text-muted-foreground mb-6">
                        Start shortlisting properties to compare and track them later.
                    </p>
                    <Button onClick={() => navigate('/properties')} className="btn-primary">
                        Explore Properties
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default DashboardShortlist;
