"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    User,
    Phone,
    Mic,
    ShieldCheck,
    Zap,
    MapPin,
    MessageCircle,
    AlertTriangle,
    Lock,
    Sun,
    Activity,
    Navigation,
    ArrowLeft,
    Ambulance as LucideAmbulance
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LeafletMap } from "@/components/emergency/leaflet-map";
import { LocationTracker } from "@/components/emergency/location-tracker";
import type { UserLocation, Hospital, Ambulance } from "@/lib/emergency-types";

export default function LandingPage() {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSosActive, setIsSosActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Emergency Data States
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [dispatchedAmbulance, setDispatchedAmbulance] = useState<Ambulance | null>(null);
    const [dataSource, setDataSource] = useState<string>("");
    const [locationError, setLocationError] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Send live location to emergency API (Port 3000)
    const sendLocationToAPI = async (location: UserLocation) => {
        try {
            await fetch("http://localhost:3000/api/emergency", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: location.accuracy,
                    speed: location.speed,
                    heading: location.heading,
                    timestamp: location.timestamp
                }),
            });
            console.log("[SOS] Sent to Port 3000:", location.latitude, location.longitude);
        } catch (error) {
            console.error("[SOS] API Error:", error);
        }
    };

    const getCurrentLocation = useCallback((): Promise<UserLocation> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location: UserLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        speed: position.coords.speed,
                        heading: position.coords.heading,
                        timestamp: position.timestamp,
                    };
                    try {
                        const response = await fetch(`/api/geocode?lat=${location.latitude}&lng=${location.longitude}`);
                        const data = await response.json();
                        if (data.address) location.address = data.address;
                    } catch (e) { }
                    resolve(location);
                },
                (err) => reject(new Error("Failed to get location")),
                { enableHighAccuracy: true, timeout: 15000 }
            );
        });
    }, []);

    const fetchNearbyHospitals = useCallback(async (location: UserLocation): Promise<Hospital[]> => {
        try {
            const response = await fetch(`/api/hospitals?lat=${location.latitude}&lng=${location.longitude}`);
            const data = await response.json();
            if (data.hospitals) {
                setDataSource(data.source);
                return data.hospitals;
            }
        } catch (e) { }
        return [];
    }, []);

    const generateMockAmbulances = (location: UserLocation): Ambulance[] => {
        const callSigns = ["AMB-101", "AMB-102", "AMB-103"];
        return callSigns.map((cs, i) => ({
            id: `amb-${i}`,
            callSign: cs,
            location: {
                lat: location.latitude + (Math.random() - 0.5) * 0.02,
                lng: location.longitude + (Math.random() - 0.5) * 0.02,
            },
            status: "available",
            eta: Math.floor(Math.random() * 10) + 3,
            distance: Math.random() * 3 + 0.5,
            crew: 2,
            equipment: ["AED", "Oxygen"],
        }));
    };

    const activateEmergency = async () => {
        setIsLoading(true);
        setLocationError(null);
        try {
            const loc = await getCurrentLocation();
            setUserLocation(loc);
            await sendLocationToAPI(loc);
            setIsSosActive(true);

            const nearbyHospitals = await fetchNearbyHospitals(loc);
            setHospitals(nearbyHospitals);
            if (nearbyHospitals.length > 0) setSelectedHospital(nearbyHospitals[0]);

            const nearbyAmbs = generateMockAmbulances(loc);
            setAmbulances(nearbyAmbs);
            const nearest = [...nearbyAmbs].sort((a, b) => a.distance - b.distance)[0];
            nearest.status = "dispatched";
            setDispatchedAmbulance(nearest);
        } catch (err) {
            setLocationError("Enable location to request help");
        } finally {
            setIsLoading(false);
        }
    };

    const startHold = () => {
        setIsHolding(true);
        let current = 0;
        timerRef.current = setInterval(() => {
            current += 2;
            setProgress(current);
            if (current >= 100) {
                clearInterval(timerRef.current!);
                activateEmergency();
                setIsHolding(false);
            }
        }, 60);
    };

    const endHold = () => {
        setIsHolding(false);
        setProgress(0);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Live updates while active
    useEffect(() => {
        if (!isSosActive) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const loc = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    speed: pos.coords.speed,
                    heading: pos.coords.heading,
                    timestamp: pos.timestamp,
                    address: userLocation?.address
                };
                setUserLocation(loc);
                sendLocationToAPI(loc);
            },
            null,
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [isSosActive, userLocation?.address]);

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0f1a] text-white font-sans overflow-hidden">
            {/* Background Glows */}
            {!isSosActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            )}

            {/* Header */}
            <header className="flex items-center justify-between p-6 z-50 bg-[#0a0f1a]/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center gap-2">
                    <LucideAmbulance className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="font-bold text-lg leading-none tracking-tight">LIFELINK</h1>
                        <p className="text-[10px] text-primary font-bold tracking-[0.2em] mt-1 uppercase">Responder Network</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSosActive ? "bg-red-500 animate-pulse" : "bg-primary animate-pulse"}`} />
                        <span className={`text-[10px] font-bold tracking-wider ${isSosActive ? "text-red-400" : "text-primary"}`}>
                            {isSosActive ? "EMERGENCY ACTIVE" : "SYSTEM ACTIVE"}
                        </span>
                    </div>
                    <Link href="/profile">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full bg-white/5">
                            <User className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {!isSosActive ? (
                        <motion.div
                            key="sos-idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center space-y-12 p-6"
                        >
                            <div className="relative">
                                <div className="relative group">
                                    <div className="absolute inset-[-40px] border border-white/5 rounded-full" />
                                    <div className="absolute inset-[-80px] border border-white/5 rounded-full opacity-50" />

                                    <svg className="absolute inset-[-15px] w-[calc(100%+30px)] h-[calc(100%+30px)] -rotate-90 pointer-events-none">
                                        <circle cx="50%" cy="50%" r="48%" className="fill-none stroke-primary/10 stroke-[2]" />
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            className="fill-none stroke-primary stroke-[3] transition-all duration-75"
                                            style={{ strokeDasharray: "100 100", strokeDashoffset: 100 - progress }}
                                        />
                                    </svg>

                                    <motion.button
                                        onMouseDown={startHold}
                                        onMouseUp={endHold}
                                        onMouseLeave={endHold}
                                        onTouchStart={startHold}
                                        onTouchEnd={endHold}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isLoading}
                                        className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${isHolding ? "bg-red-600 glow-destructive" : "bg-red-500/90 hover:bg-red-500 glow-destructive"
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <AlertTriangle className="w-12 h-12 mb-2 text-white" />
                                                <span className="text-2xl font-black tracking-tighter italic text-white uppercase">SOS</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            <div className="max-w-[200px] text-center">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Press and hold for 3 seconds to request{" "}
                                    <span className="text-primary font-bold">immediate emergency assistance</span>
                                </p>
                            </div>

                            {locationError && (
                                <div className="text-red-400 text-xs font-bold animate-bounce">{locationError}</div>
                            )}

                            {/* Action Cards */}
                            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                                <ActionCard icon={<Phone className="w-5 h-5" />} label="Call 112" sublabel="Direct line" href="tel:112" />
                                <ActionCard icon={<Mic className="w-5 h-5" />} label="Voice SOS" sublabel="Describe via AI" />
                                <ActionCard icon={<ShieldCheck className="w-5 h-5" />} label="Safe Mode" sublabel="Live tracking" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sos-active-map"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col lg:flex-row w-full h-[calc(100vh-80px)] overflow-hidden"
                        >
                            {/* Map View */}
                            <div className="flex-1 relative border-r border-white/5">
                                <LeafletMap
                                    userLocation={userLocation}
                                    hospitals={hospitals}
                                    ambulances={ambulances}
                                    selectedHospital={selectedHospital}
                                    dispatchedAmbulance={dispatchedAmbulance}
                                    onHospitalSelect={setSelectedHospital}
                                />

                                {/* Float Back Button */}
                                <Button
                                    onClick={() => setIsSosActive(false)}
                                    className="absolute top-4 left-4 z-[1000] bg-black/50 backdrop-blur-md border border-white/10"
                                    variant="outline"
                                    size="sm"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Cancel SOS
                                </Button>
                            </div>

                            {/* Sidebar Info */}
                            <aside className="w-full lg:w-96 p-4 bg-black/20 backdrop-blur-xl overflow-y-auto space-y-4">
                                <LocationTracker
                                    userLocation={userLocation}
                                    dispatchedAmbulance={dispatchedAmbulance}
                                />

                                {/* Hospital List Mini */}
                                <div className="glass p-4 rounded-2xl border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-primary tracking-widest uppercase">Nearby Hospitals</h3>
                                        <span className="text-[10px] text-muted-foreground">{dataSource}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {hospitals.slice(0, 5).map((h) => (
                                            <button
                                                key={h.id}
                                                onClick={() => setSelectedHospital(h)}
                                                className={`w-full text-left p-2.5 rounded-xl border transition-all ${selectedHospital?.id === h.id
                                                    ? "bg-primary/10 border-primary/30"
                                                    : "bg-white/5 border-transparent hover:border-white/10"
                                                    }`}
                                            >
                                                <div className="font-bold text-xs truncate">{h.name}</div>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/80">
                                                    <span className="text-primary">{h.distance.toFixed(1)} km</span>
                                                    <span>~{h.duration} min</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
                                    <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs text-white">Responder Dispatched</p>
                                </div>
                            </aside>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer (Hidden when map active to maximize space) */}
            {!isSosActive && (
                <footer className="mt-auto p-8 space-y-8 z-10 w-full max-w-lg mx-auto">
                    <div className="h-px bg-white/5 w-full" />
                    <div className="flex justify-between items-center text-muted-foreground italic">
                        <FeatureItem icon={<Zap className="w-4 h-4" />} label="Instant Response" />
                        <FeatureItem icon={<MapPin className="w-4 h-4" />} label="GPS Tracking" />
                        <FeatureItem icon={<MessageCircle className="w-4 h-4" />} label="24/7 Support" />
                    </div>
                    <div className="flex justify-center items-center gap-2 text-[10px] text-muted-foreground/30 tracking-widest uppercase">
                        <Lock className="w-3 h-3" /> Secure Encrypted Connection
                    </div>
                </footer>
            )}
        </div>
    );
}

function ActionCard({ icon, label, sublabel, href }: { icon: React.ReactNode, label: string, sublabel: string, href?: string }) {
    const content = (
        <>
            <div className="p-2 bg-primary/10 rounded-xl text-primary">{icon}</div>
            <div className="text-center">
                <p className="text-xs font-bold whitespace-nowrap">{label}</p>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{sublabel}</p>
            </div>
        </>
    );

    return (
        <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center p-4 glass rounded-2xl border-white/5 space-y-3 hover:bg-white/10 transition-all w-full"
            onClick={() => href && (window.location.href = href)}
        >
            {content}
        </motion.button>
    );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-primary">{icon}</div>
            <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
        </div>
    );
}
