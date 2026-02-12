'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ShortlistedProperty {
    id: string;
    name: string;
    developer: string;
    location: string;
    priceRange: string;
    image: string;
    configurations: string[];
    addedDate: string;
}

interface ShortlistContextType {
    shortlistedProperties: ShortlistedProperty[];
    addToShortlist: (property: ShortlistedProperty) => void;
    removeFromShortlist: (propertyId: string) => void;
    isShortlisted: (propertyId: string) => boolean;
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

export const ShortlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [shortlistedProperties, setShortlistedProperties] = useState<ShortlistedProperty[]>(() => {
        const saved = localStorage.getItem('letsbuy_shortlist');
        return saved ? JSON.parse(saved) : [];
    });

    const addToShortlist = (property: ShortlistedProperty) => {
        setShortlistedProperties((prev) => {
            if (prev.find((p) => p.id === property.id)) return prev;
            const updated = [...prev, { ...property, addedDate: new Date().toLocaleDateString() }];
            localStorage.setItem('letsbuy_shortlist', JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromShortlist = (propertyId: string) => {
        setShortlistedProperties((prev) => {
            const updated = prev.filter((p) => p.id !== propertyId);
            localStorage.setItem('letsbuy_shortlist', JSON.stringify(updated));
            return updated;
        });
    };

    const isShortlisted = (propertyId: string) => {
        return shortlistedProperties.some((p) => p.id === propertyId);
    };

    return (
        <ShortlistContext.Provider value={{ shortlistedProperties, addToShortlist, removeFromShortlist, isShortlisted }}>
            {children}
        </ShortlistContext.Provider>
    );
};

export const useShortlist = () => {
    const context = useContext(ShortlistContext);
    if (context === undefined) {
        throw new Error('useShortlist must be used within a ShortlistProvider');
    }
    return context;
};
