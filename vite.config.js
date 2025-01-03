import { defineConfig } from 'vite';

export default defineConfig({
    root: './',
    build: {
        outDir: '../dist',
    },
    server: {
        port: 3000, // Replace 3000 with your desired port number
    }
});