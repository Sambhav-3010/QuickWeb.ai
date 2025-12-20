"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TerminalPanelProps {
    logs: string[];
}

export function TerminalPanel({ logs }: TerminalPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [logs]);

    return (
        <div className="h-[50%] w-[80%] bg-[#1e1e1e] rounded-lg border border-border overflow-hidden flex flex-col">
            <div className="flex items-center px-4 py-2 border-b border-white/10 bg-white/5">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-3 text-xs text-muted-foreground font-mono">Terminal Output</span>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                    {logs.map((log, i) => (
                        <span key={i}>{log}</span>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
}