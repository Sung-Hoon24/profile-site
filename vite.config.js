import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist_prod',
        // Leaving optimizeDeps exclude as it is generally good practice for heavy libs, even if it didn't solve the Node 24 crash
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    }
})
