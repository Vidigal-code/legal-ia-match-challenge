import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: isVercel ? '/' : '/legal-ia-match-challenge/',
})
