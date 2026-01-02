import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiNavigation, FiClock, FiMaximize2, FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    google: any;
  }
}

const SCHOOL_LOCATION = { lat: 12.9716, lng: 77.5946 }; // Bangalore Center
const BUS_START_LOCATION = { lat: 12.9600, lng: 77.5800 };

const TransportTracker = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [busMarker, setBusMarker] = useState<any>(null);
  const [eta, setEta] = useState("15 mins");
  const [distance, setDistance] = useState("4.2 km");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.maps) {
      initMap();
      return;
    }

    // Check if script is already in DOM to avoid duplicates
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      // Script exists but might not be ready. Ensure callback is set.
      (window as any).initMapFunc = () => initMap();
      return;
    }

    // Load Google Maps Script
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setLoadError("Google Maps API Key is missing. Please restart the dev server.");
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapFunc&libraries=geometry`;
    script.async = true;
    script.defer = true;

    // Define global callback
    (window as any).initMapFunc = () => {
      initMap();
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: We don't remove the script to avoid reloading it unnecessarily
      // but we clean up the callback
      delete (window as any).initMapFunc;
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    try {
      const google = window.google;
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: SCHOOL_LOCATION,
        zoom: 14,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#242f3e" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "lightness": -80 }]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#746855" }]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#2b3544" }]
          }
        ], // Dark mode style
        disableDefaultUI: false,
        zoomControl: true,
      });

      setMap(mapInstance);
      setIsMapLoaded(true);

      // School Marker
      new google.maps.Marker({
        position: SCHOOL_LOCATION,
        map: mapInstance,
        icon: {
          url: "https://maps.google.com/mapfiles/kml/edu/school.png",
          scaledSize: new google.maps.Size(40, 40)
        },
        title: "School",
      });

      // Bus Marker
      const bus = new google.maps.Marker({
        position: BUS_START_LOCATION,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#FFC107", // Yellow bus
          fillOpacity: 1,
          strokeWeight: 2,
          rotation: 45, // Initial heading
        },
        title: "School Bus",
      });

      setBusMarker(bus);

      // Simulate movement
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.01;
        if (progress > 1) progress = 0;

        const newLat = BUS_START_LOCATION.lat + (SCHOOL_LOCATION.lat - BUS_START_LOCATION.lat) * progress;
        const newLng = BUS_START_LOCATION.lng + (SCHOOL_LOCATION.lng - BUS_START_LOCATION.lng) * progress;
        const newPos = { lat: newLat, lng: newLng };

        bus.setPosition(newPos);

        // Update generic ETA/Distance logic
        setEta(`${Math.round(15 * (1 - progress))} mins`);
        setDistance(`${(4.2 * (1 - progress)).toFixed(1)} km`);

      }, 1000);

      return () => clearInterval(interval);

    } catch (error) {
      console.error("Error initializing map:", error);
      setLoadError("Failed to load Google Maps");
    }
  };

  if (loadError) {
    return (
      <div className="glass-card h-[500px] flex items-center justify-center bg-red-50 dark:bg-red-900/10 border-red-200">
        <div className="text-center p-6">
          <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-bold mb-2">Map Could Not Load</p>
          <p className="text-sm text-red-500 max-w-xs mx-auto">{loadError}</p>
          <p className="text-xs text-muted-foreground mt-4">Check your internet connection and API Key.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-0 overflow-hidden relative h-[500px] flex flex-col bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-background/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border/50 pointer-events-auto">
          <h3 className="font-bold flex items-center gap-2 text-foreground">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live School Bus Tracking
          </h3>
          <p className="text-sm text-muted-foreground">Route #42 • Morning Pickup</p>
        </div>
        <Button size="icon" variant="secondary" className="pointer-events-auto shadow-lg bg-background/90 backdrop-blur">
          <FiMaximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full mix-blend-normal"
        style={{ minHeight: '500px', display: isMapLoaded ? 'block' : 'none' }}
      />

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100 dark:bg-slate-800">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground">Initializing Satellite Uplink...</p>
              <p className="text-xs text-muted-foreground mt-1">Connecting to tracking system...</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Driver Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-background/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-border/50 pointer-events-auto flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden ring-2 ring-background shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=driver"
                alt="Driver"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Mr. Rajesh Kumar</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FiPhone className="w-3 h-3" /> +91 98765 43210
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ETA</p>
              <p className="font-bold text-blue-600 dark:text-blue-400 text-lg leading-none">{eta}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Distance</p>
              <p className="font-bold text-foreground text-lg leading-none">{distance}</p>
            </div>
            <a href="tel:+919876543210">
              <Button size="icon" className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all">
                <FiPhone className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default TransportTracker;
