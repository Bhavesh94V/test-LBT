'use client';

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// FIXED: Added missing icons (TrendingDown, Home, Users, Calendar)
import { Filter, Search, ArrowUpRight, MapPin, Locate, List, Map as MapIcon, Plus, Minus, BedDouble, Ruler, Heart, Share2, Sparkles, Building2, TrendingDown, Home, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RegisterInterestModal from '@/components/properties/RegisterInterestModal';
import OTPAuthModal from '@/components/auth/OTPAuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { locations } from '@/data/properties';
import type { Property } from '@/types/index';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useShortlist } from '@/contexts/ShortlistContext';
import { useToast } from '@/hooks/use-toast';
import { propertyApi } from '@/services/userApi';
import { properties as fallbackProperties } from '@/data/properties';

// --- HELPER: Safely convert priceRange to string ---
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

// --- CONFIGURATION ---
const configurations = ['2 BHK', '2.5 BHK', '3 BHK', '4 BHK'];
const budgetRanges = [
  { label: '₹0 - ₹60L', min: 0, max: 6000000 },
  { label: '₹60L - ₹1Cr', min: 6000000, max: 10000000 },
  { label: '₹1Cr - ₹2.5Cr', min: 10000000, max: 25000000 },
  { label: '₹2.5Cr+', min: 25000000, max: Infinity },
];
const statuses = [
  { value: 'newly-launched', label: 'Newly Launched' },
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'ready-to-move', label: 'Ready to Move' },
];

interface Filters {
  configurations: string[];
  budgets: string[];
  locations: string[];
  statuses: string[];
  search: string;
}

// --- COMPONENT: NEO-ARCHITECTURAL CARD ---
const ExplorerCard = ({
  property,
  active,
  onHover,
  onJoin,
  onView,
  isSaved,
  onToggleSave,
  onShare
}: {
  property: Property;
  active: boolean;
  onHover: (id: string) => void;
  onJoin: (p: Property) => void;
  onView: (p: Property) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}) => {

  const pid = property._id || property.id || '';
  const percentageFilled = property.totalPositions > 0 ? (property.buyersJoined / property.totalPositions) * 100 : 0;
  const positionsLeft = property.totalPositions - property.buyersJoined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      onMouseEnter={() => onHover(pid)}
      className={`
        group relative flex flex-col bg-white transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl h-full
        border ${active ? 'border-[#D92228] ring-1 ring-[#D92228] shadow-2xl' : 'border-stone-200 hover:border-stone-300 hover:shadow-xl'}
      `}
      onClick={() => onView(property)}
    >
      {/* 1. IMAGE HEADER */}
      <div className="relative w-full h-64 overflow-hidden bg-stone-100">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Status Tag (Top Left) */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white text-stone-900 font-bold border-0 shadow-sm px-3 py-1 text-[10px] uppercase tracking-wide hover:bg-white">
            {property.status.replace('-', ' ')}
          </Badge>
        </div>

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={onShare}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-stone-600 hover:text-black flex items-center justify-center transition-all shadow-sm hover:scale-105"
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={onToggleSave}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all shadow-sm hover:scale-105"
          >
            <Heart size={14} className={isSaved ? "fill-[#D92228] text-[#D92228]" : "text-stone-600"} />
          </button>
        </div>

        {/* Savings Tag (Floating Bottom Right) */}
        <div className="absolute bottom-4 right-0">
          <div className="bg-[#D92228] text-white py-1.5 px-4 rounded-l-full shadow-lg flex items-center gap-2 transform transition-transform group-hover:-translate-x-1">
            <TrendingDown size={14} className="text-white" />
            <span className="text-xs font-bold">{safeSavings(property.estimatedSavings)} savings</span>
          </div>
        </div>
      </div>

      {/* 2. DETAILS BODY */}
      <div className="flex-1 p-5 flex flex-col bg-white">

        {/* Title & Developer */}
        <div className="mb-4">
          <h3 className="font-serif text-2xl text-stone-900 leading-tight mb-1 group-hover:text-[#D92228] transition-colors">
            {property.name}
          </h3>
          <p className="text-sm text-stone-500 font-medium">{property.developer}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-stone-500 text-xs font-medium mb-4 pb-4 border-b border-stone-100">
          <MapPin size={14} className="mr-1.5 text-[#D92228]" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Config & Price Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-stone-700">
            <Home size={16} className="text-[#D92228]" />
            <span className="text-xs font-bold">{safeConfigurations(property.configurations).join(', ')}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-stone-900">{safePriceRange(property.priceRange)}</span>
          </div>
        </div>

        {/* Buyer Interest Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2 text-xs">
            <div className="flex items-center gap-2 text-[#D92228]">
              <Users size={14} />
              <span className="font-semibold text-stone-700">Buyer Interest</span>
            </div>
            <div className="text-stone-500">
              <span className="font-bold text-stone-900">{property.buyersJoined} joined</span> • {positionsLeft} left
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D92228] rounded-full transition-all duration-1000"
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Calendar size={14} className="text-[#D92228]" />
          <span>Join before: <span className="text-stone-900 font-bold">{safeDate(property.joinBefore)}</span></span>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <Button
            onClick={(e) => { e.stopPropagation(); onJoin(property); }}
            className="bg-[#D92228] hover:bg-[#b01c21] text-white text-xs font-bold h-10 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Join Group
          </Button>
          <Button
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onView(property); }}
            className="border-stone-200 text-stone-700 hover:text-[#D92228] hover:border-[#D92228] hover:bg-red-50 text-xs font-bold h-10 rounded-lg transition-all"
          >
            View More
          </Button>
        </div>
      </div>
    </motion.div>
  );
};


// --- MAIN PAGE COMPONENT ---
const Properties: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Hooks
  const { addToShortlist, removeFromShortlist, isShortlisted } = useShortlist();

  // API State
  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // MAP STATE
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  // Filters
  const [filters, setFilters] = useState<Filters>({
    configurations: [], budgets: [], locations: [], statuses: [], search: '',
  });

  // Fetch properties from API on mount
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoadingProperties(true);
        const response = await propertyApi.getAll({ page: 1, limit: 50 });
        const props = response.data?.properties || response.data?.items || response.data || [];
        // Normalize: ensure both _id and id fields exist on every property
        const normalized = (Array.isArray(props) ? props : []).map((p: any) => ({
          ...p,
          _id: p._id || p.id || '',
          id: p.id || p._id || '',
          configurations: safeConfigurations(p.configurations),
          amenities: p.amenities || [],
          priceRange: safePriceRange(p.priceRange),
          estimatedSavings: safeSavings(p.estimatedSavings),
          joinBefore: safeDate(p.joinBefore),
          image: p.image || p.gallery?.[0]?.url || '/placeholder.svg',
          buyersJoined: p.buyersJoined || 0,
          totalPositions: p.totalPositions || 1,
        }));
        setApiProperties(normalized);
        setPropertiesError(null);
      } catch (error: any) {
        console.error('[Properties] Error fetching:', error);
        setPropertiesError(error?.message || 'Failed to load properties');
        setApiProperties(fallbackProperties);
        toast({
          title: 'Error',
          description: 'Failed to load properties. Using limited data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const toggleFilter = (category: keyof Omit<Filters, 'search'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value) ? prev[category].filter(v => v !== value) : [...prev[category], value],
    }));
  };

  const clearFilters = () => setFilters({ configurations: [], budgets: [], locations: [], statuses: [], search: '' });

  const filteredProperties = useMemo(() => {
    const dataToFilter = apiProperties.length > 0 ? apiProperties : [];
    return dataToFilter.filter(property => {
      if (filters.search && !property.name.toLowerCase().includes(filters.search.toLowerCase()) && !property.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.configurations.length > 0 && property.configurations && !property.configurations.some(c => filters.configurations.some(fc => c.includes(fc.replace(' BHK', ''))))) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(property.location.split(', ')[0])) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(property.status)) return false;
      return true;
    });
  }, [filters, apiProperties]);

  const activeFiltersCount = filters.configurations.length + filters.budgets.length + filters.locations.length + filters.statuses.length;

  const handleJoinGroup = (property: Property) => {
    if (isAuthenticated) { setSelectedProperty(property); setInterestModalOpen(true); }
    else { setAuthModalOpen(true); }
  };

  // --- ACTIONS LOGIC ---
  const handleToggleSave = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    const pid = property._id || property.id || '';
    const shortlistItem = {
      id: pid,
      name: property.name || '',
      developer: property.developer || '',
      location: property.location || '',
      priceRange: safePriceRange(property.priceRange),
      image: property.image || '/placeholder.svg',
      configurations: property.configurations || [],
      addedDate: new Date().toISOString()
    };

    if (isShortlisted(pid)) {
      removeFromShortlist(pid);
      toast({ title: "Removed", description: `${property.name} removed from shortlist` });
    } else {
      addToShortlist(shortlistItem);
      toast({ title: "Shortlisted", description: `${property.name} saved successfully` });
    }
  };

  const handleShare = async (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    const shareData = {
      title: property.name,
      text: `Check out ${property.name} on Let's Buy!`,
      url: window.location.origin + `/properties/${property._id || property.id}`
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast({ title: "Copied", description: "Property link copied to clipboard" });
    }
  };

  const FilterContent = () => (
    <div className="space-y-8 pr-4">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 block">Smart Search</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 group-focus-within:text-[#D92228] transition-colors" />
          <input
            placeholder="Search by name, area..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-10 text-sm focus:outline-none focus:border-[#D92228] focus:ring-4 focus:ring-red-50 transition-all shadow-sm"
          />
        </div>
      </div>

      {[
        { title: "Configuration", data: configurations, key: 'configurations' },
        { title: "Budget Range", data: budgetRanges.map(b => b.label), key: 'budgets' },
        { title: "Project Status", data: statuses.map(s => s.label), valueMap: statuses, key: 'statuses' },
        { title: "Locations", data: locations, key: 'locations' }
      ].map((section: any) => (
        <div key={section.key}>
          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-[#D92228] rounded-full" />
            {section.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {section.data.map((item: string) => {
              const value = section.valueMap ? section.valueMap.find((s: any) => s.label === item).value : item;
              const isChecked = filters[section.key as keyof Filters].includes(value);
              return (
                <button
                  key={item}
                  onClick={() => toggleFilter(section.key, value)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${isChecked
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md transform scale-105'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {activeFiltersCount > 0 && (
        <Button onClick={clearFilters} variant="outline" className="w-full border-dashed border-[#D92228] text-[#D92228] hover:bg-red-50 h-12 uppercase text-xs font-bold tracking-widest bg-transparent">
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans selection:bg-[#D92228] selection:text-white">

      {/* 1. HEADER (Filters Bar) */}
      <header className="mt-[60px] h-20 border-b border-stone-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Explorer</h1>
            <p className="text-xs text-stone-500 font-medium">Map View • {filteredProperties.length} Results</p>
          </div>
          <div className="hidden md:flex h-8 w-px bg-stone-200 mx-2" />
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-stone-500 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
            <MapPin size={12} className="text-[#D92228]" />
            <span>Ahmedabad, Gujarat</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 rounded-full border-stone-200 hover:border-stone-300 hover:bg-stone-50 px-5 font-medium text-stone-700 bg-transparent">
                <Filter size={14} /> Filters
                {activeFiltersCount > 0 && <span className="bg-[#D92228] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">{activeFiltersCount}</span>}
              </Button>
            </SheetTrigger>
            {/* FIXED: Changed bg-stone-50/50 to bg-white for clean white background */}
            <SheetContent side="right" className="w-full sm:w-[450px] overflow-y-auto bg-white backdrop-blur-xl border-l border-stone-100">
              <SheetHeader className="mb-8 text-left">
                <SheetTitle className="text-2xl font-serif">Refine Search</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>

          <Button className="md:hidden rounded-full w-10 h-10 p-0" onClick={() => setShowMapMobile(!showMapMobile)}>
            {showMapMobile ? <List size={18} /> : <MapIcon size={18} />}
          </Button>
        </div>
      </header>

      {/* 2. SPLIT VIEW CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT: LIST VIEW (Wider & Grid) */}
        <div className={`
            w-full md:w-[55%] lg:w-[60%] bg-[#FAFAFA] flex flex-col border-r border-stone-200 z-10 transition-transform duration-300 absolute md:relative h-full
            ${showMapMobile ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
         `}>
          {/* List Container - PREMIUM GRID */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-24">
                {filteredProperties.map((property) => {
                  const pid = property._id || property.id || '';
                  return (
                    <ExplorerCard
                      key={pid}
                      property={property}
                      active={activePropertyId === pid}
                      onHover={setActivePropertyId}
                      onJoin={handleJoinGroup}
                      onView={(p) => navigate(`/properties/${p._id || p.id}`)}
                      isSaved={isShortlisted(pid)}
                      onToggleSave={(e) => handleToggleSave(e, property)}
                      onShare={(e) => handleShare(e, property)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-4">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
                  <Search size={32} className="opacity-20" />
                </div>
                <p className="font-medium">No properties match your criteria.</p>
                <Button variant="link" onClick={clearFilters} className="text-[#D92228]">Clear Filters</Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: MAP VIEW */}
        <div className="flex-1 bg-stone-200 relative h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117433.35461978728!2d72.45051898437499!3d23.020474000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1706000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(1.2)' }}
            allowFullScreen
            loading="lazy"
            title="Map"
            className="w-full h-full object-cover"
          />

          {/* Simulated Pins */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative group cursor-pointer pointer-events-auto">
                <div className="w-12 h-12 bg-[#D92228]/20 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-4 h-4 bg-[#D92228] rounded-full border-2 border-white shadow-xl relative z-10 mx-auto transition-transform group-hover:scale-125" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-stone-900 text-xs font-bold px-4 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  {filteredProperties[0]?.name || "Property"}
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3">
            <Button size="icon" className="rounded-full shadow-xl bg-white hover:bg-stone-50 h-12 w-12 text-stone-700 border border-stone-100">
              <Locate size={20} />
            </Button>
            <div className="flex flex-col rounded-full shadow-xl bg-white overflow-hidden divide-y divide-stone-100 border border-stone-100">
              <Button size="icon" variant="ghost" className="h-12 w-12 hover:bg-stone-50 rounded-none text-stone-700">
                <Plus size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="h-12 w-12 hover:bg-stone-50 rounded-none text-stone-700">
                <Minus size={20} />
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <OTPAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <RegisterInterestModal isOpen={interestModalOpen} onClose={() => setInterestModalOpen(false)} property={selectedProperty} />
    </div>
  );
};

export default Properties;
