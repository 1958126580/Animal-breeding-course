import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/Animal-breeding-course/',
    plugins: [react()],
})
