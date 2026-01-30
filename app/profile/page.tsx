"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    Calendar,
    Users,
    Droplets,
    MapPin,
    Save,
    LogIn,
    Plus,
    Trash2,
    Phone,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([{ name: "Jane Doe", phone: "+1 234 567 890" }]);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Logic for saving (local or DB)
        }, 1000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0f1a] text-white p-6 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white/5">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-glow">Personal Info</h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            <main className="max-w-xl mx-auto w-full space-y-8 pb-20">
                {/* Info Note */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        This information is <span className="text-primary font-bold">optional</span> but helps emergency responders assist you better in critical situations.
                    </p>
                </div>

                {/* Basic Info Section */}
                <section className="glass p-6 rounded-3xl border-white/5 space-y-6">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                        <User className="w-4 h-4" /> Identification
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="John Doe" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Input type="number" placeholder="25" className="bg-white/5 border-white/10 h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select>
                                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                        <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-white/10">
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="none">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Blood Group</Label>
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
                    </div>
                </section>

                {/* Emergency Contacts */}
                <section className="glass p-6 rounded-3xl border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                            <Phone className="w-4 h-4" /> Emergency Contacts
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-white/5 gap-1">
                            <Plus className="w-4 h-4" /> Add
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {contacts.map((contact, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div>
                                    <p className="font-bold text-sm">{contact.name}</p>
                                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Permissions */}
                <section className="glass p-6 rounded-3xl border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                        <MapPin className="w-4 h-4" /> Location Permissions
                    </div>
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div>
                            <p className="text-sm font-bold">Real-time Tracking</p>
                            <p className="text-[10px] text-muted-foreground">Enabled for responders</p>
                        </div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    </div>
                </section>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    className="w-full h-14 bg-primary text-black font-black text-lg rounded-2xl glow-primary transition-all active:scale-[0.98]"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                    {!loading && <Save className="ml-2 w-5 h-5" />}
                </Button>

                <div className="h-px bg-white/5" />

                {/* Optional Auth Section */}
                <section className="text-center space-y-6 pt-4">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Save Data Perpetually</h3>
                        <p className="text-xs text-muted-foreground">Log in to sync your profile across all devices</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/login">
                            <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 rounded-xl hover:bg-white/10">
                                <LogIn className="mr-2 w-4 h-4" /> Sign In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="ghost" className="w-full h-12 rounded-xl hover:bg-white/5">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
