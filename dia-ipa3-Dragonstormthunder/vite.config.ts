/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        reporters: ['verbose'],
        environment: 'jsdom', 
    },
})
