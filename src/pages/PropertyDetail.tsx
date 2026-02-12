'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MapPin, ArrowLeft, Share2, Heart, Check, Shield, Car, Trees, Dumbbell, Waves, Building2, Users, Calendar, TrendingDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast'; // Ensure you have this hook
import RegisterInterestModal from '@/components/properties/RegisterInterestModal';
import OTPAuthModal from '@/components/auth/OTPAuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useShortlist } from '@/contexts/ShortlistContext'; // Import Context
import { propertyApi, userFavoritesApi } from '@/services/userApi';
import type { Property } from '@/types/index';

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

// --- ICONS MAPPING ---
const amenityIcons: Record<string, React.ElementType> = {
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Garden': Trees,
  'Security': Shield,
  'Clubhouse': Building2,
  'Parking': Car,
};

// --- COMPONENT: FLOATING LEFT NAVIGATION (FIXED) ---
const FloatingLeftNav = ({
  onBack,
  onShare,
  onToggleShortlist,
  isShortlisted
}: {
  onBack: () => void,
  onShare: () => void,
  onToggleShortlist: () => void,
  isShortlisted: boolean
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-start gap-4">
      {/* 1. Expandable Back Button */}
      {/* 'items-start' on parent ensures this expansion doesn't move siblings */}
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onBack}
        animate={{ width: isHovered ? '160px' : '48px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-12 bg-white border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full flex items-center overflow-hidden group relative z-10"
      >
        <div className="w-12 h-12 flex items-center justify-center shrink-0 text-gray-700 group-hover:text-black">
          <ArrowLeft size={20} />
        </div>
        <span className="whitespace-nowrap text-sm font-bold text-gray-900 pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Back to List
        </span>
      </motion.button>

      {/* 2. Quick Actions (Vertical Stack) */}
      <div className="flex flex-col gap-3 items-center w-12">
        <motion.button
          onClick={onShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-[#D92228] transition-colors"
          title="Share Property"
        >
          <Share2 size={16} />
        </motion.button>

        <motion.button
          onClick={onToggleShortlist}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-10 h-10 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center transition-colors ${isShortlisted ? 'text-[#D92228] border-[#D92228]' : 'text-gray-500 hover:text-[#D92228]'
            }`}
          title={isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
        >
          <Heart size={16} fill={isShortlisted ? "currentColor" : "none"} />
        </motion.button>
      </div>
    </div>
  );
};

// --- STICKY NAV COMPONENT ---
const StickySubNav = ({ activeSection, scrollTo }: { activeSection: string, scrollTo: (id: string) => void }) => (
  <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 hidden md:block">
    <div className="container-section max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex gap-8 h-full">
        {['Overview', 'Amenities', 'Location'].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item.toLowerCase())}
            className={`text-sm font-medium h-full border-b-2 transition-all px-2 ${activeSection === item.toLowerCase()
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <LayoutGrid size={14} /> Property Details
      </div>
    </div>
  </div>
);

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Hooks
  const { addToShortlist, removeFromShortlist, isShortlisted } = useShortlist();
  const { toast } = useToast();

  // State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await propertyApi.getById(id);
        // Normalize: API may return { success, data } or the property directly
        const raw = response?.data ?? response;
        // Ensure both _id and id are available
        const normalized = {
          ...raw,
          _id: raw._id || raw.id || id,
          id: raw.id || raw._id || id,
          priceRange: safePriceRange(raw.priceRange),
          configurations: safeConfigurations(raw.configurations),
          estimatedSavings: safeSavings(raw.estimatedSavings),
          joinBefore: safeDate(raw.joinBefore),
          image: raw.image || raw.gallery?.[0]?.url || '/placeholder.svg',
          amenities: Array.isArray(raw.amenities) ? raw.amenities.map((a: any) => typeof a === 'string' ? a : a?.name || String(a)) : [],
          buyersJoined: raw.buyersJoined || 0,
          totalPositions: raw.totalPositions || 1,
        };
        setProperty(normalized as Property);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching property:', err);
        setError(err.response?.data?.message || 'Failed to load property details');
        toast({
          title: 'Error',
          description: 'Could not load property details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D92228]/20 border-t-[#D92228] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Button onClick={() => navigate('/properties')} className="bg-[#D92228] hover:bg-[#B11920] text-white">
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const handleJoinGroup = () => {
    if (isAuthenticated) { setInterestModalOpen(true); }
    else { setAuthModalOpen(true); }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // --- LOGIC: SHORTLIST ---
  const propertyId = property._id || property.id || '';
  const isSaved = isShortlisted(propertyId);

  const handleToggleShortlist = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    try {
      if (isSaved) {
        await userFavoritesApi.remove(propertyId);
        removeFromShortlist(propertyId);
        toast({ title: "Removed", description: "Property removed from your shortlist." });
      } else {
        await userFavoritesApi.add(propertyId);
        addToShortlist({
          id: propertyId,
          name: property.name || '',
          developer: property.developer || '',
          location: property.location || '',
          priceRange: safePriceRange(property.priceRange),
          image: property.image || property.gallery?.[0]?.url || "/placeholder.svg",
          configurations: property.configurations || [],
          addedDate: new Date().toISOString()
        });
        toast({ title: "Saved", description: "Property added to your shortlist." });
      }
    } catch (error: any) {
      console.error('Error toggling shortlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shortlist',
        variant: 'destructive',
      });
    }
  };

  // --- LOGIC: SHARE ---
  const handleShare = async () => {
    const shareData = {
      title: property.name,
      text: `Check out ${property.name} on Let's Buy!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Property link copied to clipboard." });
    }
  };

  const percentageJoined = property.totalPositions > 0 ? Math.round((property.buyersJoined / property.totalPositions) * 100) : 0;

  return (
    <div className="bg-white min-h-screen font-sans text-stone-900 selection:bg-stone-900 selection:text-white pb-20">

      {/* 1. FLOATING NAVIGATION (Fixed) */}
      <FloatingLeftNav
        onBack={() => navigate('/properties')}
        onShare={handleShare}
        onToggleShortlist={handleToggleShortlist}
        isShortlisted={isSaved}
      />

      {/* Mobile Back Button */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50 flex justify-between pointer-events-none">
        <Button
          size="icon"
          className="rounded-full bg-white/90 backdrop-blur shadow-lg text-black hover:bg-white pointer-events-auto"
          onClick={() => navigate('/properties')}
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex gap-2 pointer-events-auto">
          <Button size="icon" onClick={handleShare} className="rounded-full bg-white/90 backdrop-blur shadow-lg text-black hover:bg-white">
            <Share2 size={18} />
          </Button>
          <Button size="icon" onClick={handleToggleShortlist} className="rounded-full bg-white/90 backdrop-blur shadow-lg text-black hover:bg-white">
            <Heart size={18} fill={isSaved ? "#D92228" : "none"} className={isSaved ? "text-[#D92228]" : ""} />
          </Button>
        </div>
      </div>

      {/* 2. HERO GALLERY */}
      <section className="relative pt-0 md:pt-10 px-0 md:px-6 max-w-7xl mx-auto">
        <div className="relative w-full h-[50vh] md:h-[75vh] md:rounded-[2rem] overflow-hidden group shadow-none md:shadow-2xl">
          <img src={property.image || "/placeholder.svg"} alt={property.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute top-20 md:top-6 left-6">
            <Badge className="bg-white/90 backdrop-blur text-black border-0 shadow-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
              {(property.status || 'available').replace('-', ' ')}
            </Badge>
          </div>

          <div className="absolute bottom-6 right-6">
            <Button className="bg-white/90 text-black hover:bg-white shadow-xl gap-2 text-xs font-bold uppercase tracking-wider rounded-full h-12 px-6">
              View Gallery <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 2.5 PROPERTY GALLERY GRID */}
      {property.gallery && property.gallery.length > 0 && (
        <section className="relative py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Gallery</h3>
            <p className="text-gray-500">Explore more photos of this property</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {property.gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-xl overflow-hidden h-48 md:h-64 cursor-pointer"
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{image.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 3. STICKY SUB-NAV */}
      <StickySubNav activeSection={activeSection} scrollTo={scrollToSection} />

      {/* 4. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* LEFT COLUMN: CONTENT (66%) */}
        <div className="lg:col-span-2 space-y-20">

          {/* Header Info */}
          <div id="overview">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-3 tracking-tight leading-none">{property.name}</h1>
                <div className="flex items-center text-gray-500 font-medium text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-[#D92228]" /> {property.location}
                </div>
              </div>
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                <Building2 className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Type</p>
                <p className="font-bold text-gray-900 text-lg">{property.configurations?.[0] || 'N/A'}</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                <TrendingDown className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Savings</p>
                <p className="font-bold text-green-600 text-lg">{property.estimatedSavings}</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                <Users className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Joined</p>
                <p className="font-bold text-gray-900 text-lg">{property.buyersJoined} Investors</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                <Calendar className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Deadline</p>
                <p className="font-bold text-gray-900 text-lg">{property.joinBefore}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">The Property</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Experience premium living at {property.name}, developed by the renowned {property.developer}.
              Located in the prime sector of {property.location}, this project offers a blend of luxury and connectivity.
              Designed for the modern homeowner, every unit maximizes space, light, and ventilation.
              <br /><br />
              By joining the syndicate, you gain access to exclusive wholesale pricing, saving significantly compared to individual market rates.
            </p>
          </div>

          {/* Amenities */}
          <div id="amenities" className="scroll-mt-28 border-t border-gray-100 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(property.amenities || []).map((amenity) => {
                const Icon = amenityIcons[amenity] || Check;
                return (
                  <div key={amenity} className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-2xl hover:border-gray-300 hover:bg-stone-50 transition-all cursor-default text-center group h-32">
                    <Icon className="w-8 h-8 text-gray-400 group-hover:text-black mb-3 transition-colors" />
                    <span className="font-medium text-gray-700 text-sm">{amenity}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Map */}
          <div id="location" className="scroll-mt-28 border-t border-gray-100 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>
            <div className="h-[450px] w-full bg-gray-100 rounded-[2rem] overflow-hidden relative shadow-inner">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117433.35461978728!2d72.45051898437499!3d23.020474000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1706000000000!5m2!1sen!2sin`}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.2) opacity(0.8)' }}
                allowFullScreen
                loading="lazy"
                title="Map"
              />
              <div className="absolute bottom-6 left-6 bg-white px-5 py-3 rounded-xl shadow-xl font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D92228] rounded-full animate-pulse" />
                {property.location}
              </div>
            </div>
          </div>

        </div>


        {/* RIGHT COLUMN: STICKY SIDEBAR (33%) */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-24">
            <div className="p-8 rounded-[2rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white relative overflow-hidden">

              {/* Price Header */}
              <div className="mb-8 text-center border-b border-gray-100 pb-8">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Syndicate Price</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">{safePriceRange(property.priceRange).split('-')[0]?.trim() || 'Contact for Price'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Estimated market value is higher</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-gray-900">{percentageJoined}% Funded</span>
                  <span className="text-[10px] font-bold text-[#D92228] bg-red-50 px-2 py-1 rounded">
                    {property.totalPositions - property.buyersJoined} SPOTS LEFT
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentageJoined}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gray-900 rounded-full"
                  />
                </div>
              </div>

              {/* Form / Button */}
              <div className="space-y-4">
                <div className="bg-stone-50 rounded-xl border border-stone-100 divide-y divide-stone-200">
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-gray-500">Developer</span>
                    <span className="font-bold text-gray-900">{property.developer}</span>
                  </div>
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-gray-500">Possession</span>
                    <span className="font-bold text-gray-900">Dec 2027</span>
                  </div>
                </div>

                <Button onClick={handleJoinGroup} className="w-full h-14 bg-[#D92228] hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-100 transition-all mt-2">
                  I'm Interested
                </Button>

                <div className="flex items-start gap-2 justify-center mt-6">
                  <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-xs text-gray-400 text-center leading-relaxed max-w-[200px]">
                    Vetted Property. No payment required to express interest.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <OTPAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <RegisterInterestModal isOpen={interestModalOpen} onClose={() => setInterestModalOpen(false)} property={property} />

    </div>
  );
};

export default PropertyDetail;
