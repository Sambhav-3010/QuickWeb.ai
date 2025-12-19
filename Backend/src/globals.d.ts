declare global{
    namespace NodeJS{
        interface ProcessENV{
            NVIDIA_API_KEY? : string,
            PORT?: number
        }
    }
}

export {}