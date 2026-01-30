"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, Calendar, Users, Droplets, MapPin, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleComplete = () => {
        setLoading(true);
        setTimeout(() => {
            router.push("/");
        }, 2000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0f1a]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-xl"
            >
                <div className="text-center mb-8 space-y-2">
                    <div className="flex justify-center mb-2">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-glow">Create Profile</h1>
                    <p className="text-muted-foreground text-sm">Before saving your life, the system learns who you are</p>

                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${step >= i ? "w-8 bg-primary" : "w-4 bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-primary" /> Full Name
                                        </Label>
                                        <Input
                                            placeholder="John Doe"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-primary" /> Age
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="18"
                                                className="bg-white/5 border-white/10 h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-primary" /> Gender
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                                    <SelectValue placeholder="Selection" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#0f172a] border-white/10">
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={nextStep} className="w-full h-12 bg-primary text-black font-bold rounded-xl glow-primary">
                                    Next Step <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 mb-2">
                                            <Droplets className="w-4 h-4 text-primary" /> Blood Group
                                        </Label>
                                        <Select>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                                <SelectValue placeholder="Select group" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0f172a] border-white/10">
                                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Emergency Contact (Name)</Label>
                                        <Input placeholder="Contact Name" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Emergency Contact (Phone)</Label>
                                        <Input placeholder="+1 234 567 890" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="ghost" onClick={prevStep} className="h-12 border border-white/10 rounded-xl">
                                        <ArrowLeft className="mr-2 w-5 h-5" /> Back
                                    </Button>
                                    <Button onClick={nextStep} className="h-12 bg-primary text-black font-bold rounded-xl glow-primary">
                                        Next <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-4 py-4">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                                            <MapPin className="w-10 h-10 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold">Enable Permissions</h3>
                                    <p className="text-muted-foreground">To provide instant response, LifeLink needs access to your real-time location and background tracking.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/20 rounded-lg"><MapPin className="w-5 h-5 text-primary" /></div>
                                            <div>
                                                <p className="font-medium">Location Services</p>
                                                <p className="text-xs text-muted-foreground">Required for dispatcher lookup</p>
                                            </div>
                                        </div>
                                        <Check className="text-primary w-6 h-6 border-2 border-primary rounded-full p-1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="ghost" onClick={prevStep} className="h-12 border border-white/10 rounded-xl">
                                        Back
                                    </Button>
                                    <Button onClick={handleComplete} disabled={loading} className="h-12 bg-primary text-black font-bold rounded-xl glow-primary">
                                        {loading ? "Finalizing..." : "Complete Setup"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
