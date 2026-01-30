"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Apple, Chrome, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock login delay
        setTimeout(() => {
            router.push("/");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0f1a]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 glow-primary">
                            <Shield className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-glow">LifeLink</h1>
                    <p className="text-muted-foreground">Responder Network Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 glass p-8 rounded-3xl border-white/5">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Keep me logged in
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-black rounded-xl transition-all glow-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Authenticating..." : "Sign In"}
                        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0a0f1a] px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 h-11 text-white">
                            <Chrome className="mr-2 h-5 w-5" /> Google
                        </Button>
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 h-11 text-white">
                            <Apple className="mr-2 h-5 w-5" /> Apple
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    New to LifeLink?{" "}
                    <Link href="/signup" className="text-primary font-semibold hover:underline">
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
