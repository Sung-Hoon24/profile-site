import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true,
    },
    build: {
        outDir: 'dist_test',
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            input: {
                main: 'index.html',
            },
        },
    },
})
