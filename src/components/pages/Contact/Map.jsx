import React, { useEffect, useRef, useState } from 'react';
import styles from './Map.module.css';

/**
 * Minimal Map Component using Google Maps API
 * Displays a static, non-interactive map with a marker for the office location
 */
export const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const callbackNameRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  const initMap = () => {
    if (mapInstanceRef.current || !mapRef.current) {
      return;
    }

    // Check if Google Maps API is fully loaded
    if (!window.google || !window.google.maps || !window.google.maps.Map) {
      console.warn('Google Maps API not fully loaded yet');
      return;
    }

    // Coordinates for Scorpius 161, 2132 LR Hoofddorp, Nederland
    const coordinates = { lat: 52.3000, lng: 4.6500 };

    try {
      // Initialize map with minimal styling
      const map = new window.google.maps.Map(mapRef.current, {
      center: coordinates,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      keyboardShortcuts: false,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#f0f0f0' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e0e0e0' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#d0d0d0' }, { lightness: 50 }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#999999' }],
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    // Use classic Marker (AdvancedMarkerElement requires mapId which conflicts with custom styles)
    // The deprecation warning is acceptable since we need custom styles
    const marker = new window.google.maps.Marker({
      position: coordinates,
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 16,
        fillColor: '#33A27B',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    });
    markerRef.current = marker;

      mapInstanceRef.current = map;
      setMapError(false);
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      setMapError(true);
    }
  };

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is not set. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      setMapError(true);
      return;
    }

    const tryInitMap = () => {
      if (window.google && window.google.maps && typeof window.google.maps.Map === 'function') {
        initMap();
        return true;
      }
      return false;
    };

    // Check if Google Maps is already loaded
    if (tryInitMap()) {
      return;
    }

    // Load Google Maps script if not already loaded
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Create unique callback name to avoid conflicts
      callbackNameRef.current = `initGoogleMaps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const callbackName = callbackNameRef.current;
      
      // Set up callback on window BEFORE creating script
      // Use a persistent function that won't be deleted until after it's called
      window[callbackName] = function() {
        window.googleMapsLoaded = true;
        // Try to initialize map after a short delay to ensure everything is ready
        setTimeout(() => {
          if (mapRef.current && !mapInstanceRef.current) {
            tryInitMap();
          }
        }, 100);
        // Clean up callback after use (but wait longer to ensure it's fully called)
        setTimeout(() => {
          if (callbackNameRef.current && window[callbackNameRef.current]) {
            delete window[callbackNameRef.current];
            callbackNameRef.current = null;
          }
        }, 2000);
      };

      // Create and load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        if (callbackNameRef.current && window[callbackNameRef.current]) {
          delete window[callbackNameRef.current];
          callbackNameRef.current = null;
        }
        setMapError(true);
      };
      document.head.appendChild(script);
    }

    // Poll as fallback
    let checkCount = 0;
    const maxChecks = 50; // 5 seconds max wait
    
    const checkGoogle = setInterval(() => {
      checkCount++;
      
      if (tryInitMap()) {
        clearInterval(checkGoogle);
      } else if (checkCount >= maxChecks) {
        clearInterval(checkGoogle);
        console.error('Google Maps API failed to load. Please check API key restrictions.');
        setMapError(true);
      }
    }, 100);

    return () => {
      clearInterval(checkGoogle);
      // Only clean up callback if component is actually unmounting (not just re-rendering)
      // Wait a bit to ensure Google Maps has had a chance to call it
      setTimeout(() => {
        if (callbackNameRef.current && window[callbackNameRef.current]) {
          delete window[callbackNameRef.current];
          callbackNameRef.current = null;
        }
      }, 100);
      if (markerRef.current) {
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fallback display if map fails to load
  if (mapError) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.fallbackMap}>
          <div className={styles.fallbackContent}>
            <div className={styles.markerFallback}></div>
            <p className={styles.fallbackText}>Scorpius 161<br />2132 LR Hoofddorp<br />Nederland</p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={styles.mapContainer} />;
};
