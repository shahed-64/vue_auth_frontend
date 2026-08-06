import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/',

  plugins: [
    vue(),

    // VitePWA({
    //   registerType: 'autoUpdate',

    //   manifest: {
    //     name: 'Coaching Management System',
    //     short_name: 'CMS',
    //     description: 'Coaching Management System App',

    //     theme_color: '#2563eb',
    //     background_color: '#ffffff',

    //     display: 'standalone',

    //     icons: [
    //       {
    //         src: '/app/pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: '/app/pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
