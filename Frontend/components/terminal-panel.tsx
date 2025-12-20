"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TerminalPanelProps {
    logs: string[];
}

function LoadingDots() {
    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((d) => (d.length >= 3 ? "." : d + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return <span className="inline-block w-4 text-left">{dots}</span>;
}


export function TerminalPanel({ logs }: TerminalPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 50; // 50px threshold
            setShouldAutoScroll(isAtBottom);
        }
    };

    useEffect(() => {
        if (shouldAutoScroll && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [logs, shouldAutoScroll]);


    const cleanLog = (text: string) => text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
    const isSpinner = (text: string) => /^[\\|/\-\s]+$/.test(cleanLog(text));

    const processLogs = () => {
        const cleanedLogs = logs.map(l => ({ original: l, text: cleanLog(l) }));
        const filtered = cleanedLogs.filter(l => !isSpinner(l.text));

        return filtered.map((logItem, i) => {
            const isInstalling = logItem.text.includes("Installing dependencies");
            const isLast = i === filtered.length - 1;

            if (isInstalling) {
                return (
                    <div key={i} className="text-blue-400">
                        Installing dependencies
                        {isLast ? <LoadingDots /> : "..."}
                    </div>
                );
            }

            return (
                <span key={i} className="break-all">{logItem.text}</span>
            );
        });
    };

    return (
        <div className="h-[50%] w-[80%] bg-[#1e1e1e] flex flex-col text-sm rounded-lg">
            <div className="flex-none flex items-center px-4 h-10 select-none">
                <div className="flex gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-3 text-lg text-muted-foreground font-mono font-medium">Terminal</span>
            </div>
            <div className="h-[1px] w-full bg-white/50"></div>
            <div className="flex-1 min-h-0 relative">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full w-full overflow-y-auto"
                >
                    <div className="p-4 font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {processLogs()}
                        <div ref={scrollRef} className="pb-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}