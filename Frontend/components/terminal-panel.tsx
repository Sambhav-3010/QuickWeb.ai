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
        <div className="h-full w-full bg-[#1e1e1e] flex flex-col text-sm border-t border-border/50">
            <div className="flex-none flex items-center px-4 h-10 border-b border-white/10 bg-white/5 select-none">
                <div className="flex gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-3 text-xs text-muted-foreground font-mono font-medium">Terminal</span>
            </div>
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full w-full">
                    <div className="p-4 font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {logs.map((log, i) => (
                            <span key={i} className="break-all">{log.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")}</span>
                        ))}
                        <div ref={scrollRef} className="pb-4" />
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}