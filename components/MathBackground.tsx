"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MathSymbol {
    id: number;
    char: string;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    color: string;
}

const MATH_SYMBOLS = [
    "∫", "∑", "π", "e^{iπ}+1=0", "∞", "√x", "f'(x)", "lim_{x→0}", 
    "∇×B", "φ=1.618", "d/dx", "λ", "θ", "Δx", "∪", "∩", "≠", "≈", 
    "x² + y² = r²", "E=mc²", "sin²θ+cos²θ=1", "a²+b²=c²"
];

export default function MathBackground() {
    const [symbols, setSymbols] = useState<MathSymbol[]>([]);

    useEffect(() => {
        // Generate a fixed number of ambient floating symbols
        const generated: MathSymbol[] = MATH_SYMBOLS.map((char, index) => {
            const colors = ["#F0C040", "#38BDF8", "#A78BFA", "#F59E0B", "#10B981"];
            return {
                id: index,
                char,
                x: (index * 13 + 5) % 92, // distributed horizontally
                y: (index * 19 + 7) % 88, // distributed vertically
                size: Math.floor(Math.random() * 12) + 14,
                duration: Math.floor(Math.random() * 10) + 16,
                delay: (index * 0.4) % 5,
                opacity: 0.12 + (index % 4) * 0.04,
                color: colors[index % colors.length],
            };
        });
        setSymbols(generated);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {/* Subtle Mathematical Grid */}
            <div className="absolute inset-0 math-grid-pattern opacity-40" />

            {/* Ambient Cosmic Radial Orbs */}
            <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
            <div className="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[150px]" />
            <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-sky-500/10 rounded-full blur-[140px]" />

            {/* Geometric SVG Golden Spiral & Vector Elements */}
            <svg 
                className="absolute top-10 right-10 w-[450px] h-[450px] opacity-[0.06] text-amber-400 animate-math-spin"
                viewBox="0 0 200 200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.75"
            >
                <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
                <circle cx="100" cy="100" r="70" />
                <circle cx="100" cy="100" r="45" strokeDasharray="2 4" />
                <polygon points="100,10 180,150 20,150" />
                <polygon points="100,190 180,50 20,50" />
            </svg>

            {/* Floating Math Symbols */}
            {symbols.map((sym) => (
                <motion.div
                    key={sym.id}
                    className="absolute font-mono font-bold tracking-wider"
                    style={{
                        left: `${sym.x}%`,
                        top: `${sym.y}%`,
                        fontSize: `${sym.size}px`,
                        color: sym.color,
                        opacity: sym.opacity,
                    }}
                    animate={{
                        y: [-12, 12, -12],
                        x: [-8, 8, -8],
                        rotate: [-6, 6, -6],
                    }}
                    transition={{
                        duration: sym.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: sym.delay,
                    }}
                >
                    {sym.char}
                </motion.div>
            ))}
        </div>
    );
}
