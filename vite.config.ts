import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
        }
      }
    }),
    vuetify({
      autoImport: true
    }),
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'css', 'html', 'typescript', 'json'],
      customDistPath(root, buildOutDir) {
        return path.join(root, buildOutDir, 'monacoeditorwork');
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    chunkSizeWarningLimit: 1024 * 1024 // Set the limit to 1 MB
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue']
  }
});
