import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";
const useWebContainers = async () => {

    const [webContainers ,setWebContainers] = useState<WebContainer>();
    async function main() {
        const webcontainerInstance = await WebContainer.boot();
        setWebContainers(webcontainerInstance);
    }

    useEffect(()=>{
        main();
    },[])

    return webContainers;
}

export default useWebContainers
