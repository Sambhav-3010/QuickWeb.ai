import { useEffect, useState, useRef } from "react";
import { WebContainer } from "@webcontainer/api";

export const useWebContainer = () => {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const bootStartedRef = useRef(false);

    useEffect(() => {
        async function boot() {
            if (bootStartedRef.current) return;
            bootStartedRef.current = true;

            try {
                const instance = await WebContainer.boot();
                setWebcontainer(instance);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to boot WebContainer:", err);
                setError(err as Error);
                setIsLoading(false);
            }
        }

        boot();
    }, []);

    return { webcontainer, isLoading, error };
}