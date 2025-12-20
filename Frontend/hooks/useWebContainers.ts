import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

declare global {
    var webcontainerInstance: WebContainer | undefined;
    var bootPromise: Promise<WebContainer> | undefined;
}

export const useWebContainer = () => {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(globalThis.webcontainerInstance || null);
    const [isLoading, setIsLoading] = useState(!globalThis.webcontainerInstance);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (globalThis.webcontainerInstance) {
            setWebcontainer(globalThis.webcontainerInstance);
            setIsLoading(false);
            return;
        }

        async function boot() {
            try {
                if (!globalThis.bootPromise) {
                    globalThis.bootPromise = WebContainer.boot();
                }
                const instance = await globalThis.bootPromise;
                globalThis.webcontainerInstance = instance;
                setWebcontainer(instance);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to boot WebContainer:", err);
                setError(err as Error);
                setIsLoading(false);
                globalThis.bootPromise = undefined;
            }
        }

        boot();
    }, []);

    return { webcontainer, isLoading, error };
}