// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Deadline/HTTM/chess-website/client/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Deadline/HTTM/chess-website/client/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///D:/Deadline/HTTM/chess-website/client/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/Deadline/HTTM/chess-website/client/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  define: {
    "process.env": {
      VITE_API_URL: process.env.VITE_API_URL,
      VITE_CLOUDINARY_NAME: process.env.VITE_CLOUDINARY_NAME,
      VITE_CLOUDINARY_API_KEY: process.env.VITE_CLOUDINARY_API_KEY,
      VITE_CLOUDINARY_API_SECRET_KEY: process.env.VITE_CLOUDINARY_API_SECRET_KEY,
      VITE_CLOUDINARY_FOLDER: process.env.VITE_CLOUDINARY_FOLDER,
      VITE_CLOUDINARY_UPLOAD_PRESET: process.env.VITE_CLOUDINARY_UPLOAD_PRESET
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZWFkbGluZVxcXFxIVFRNXFxcXGNoZXNzLXdlYnNpdGVcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZWFkbGluZVxcXFxIVFRNXFxcXGNoZXNzLXdlYnNpdGVcXFxcY2xpZW50XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZWFkbGluZS9IVFRNL2NoZXNzLXdlYnNpdGUvY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgJ3Byb2Nlc3MuZW52Jzoge1xyXG4gICAgICBWSVRFX0FQSV9VUkw6IHByb2Nlc3MuZW52LlZJVEVfQVBJX1VSTCxcclxuICAgICAgVklURV9DTE9VRElOQVJZX05BTUU6IHByb2Nlc3MuZW52LlZJVEVfQ0xPVURJTkFSWV9OQU1FLFxyXG4gICAgICBWSVRFX0NMT1VESU5BUllfQVBJX0tFWTogcHJvY2Vzcy5lbnYuVklURV9DTE9VRElOQVJZX0FQSV9LRVksXHJcbiAgICAgIFZJVEVfQ0xPVURJTkFSWV9BUElfU0VDUkVUX0tFWTogcHJvY2Vzcy5lbnYuVklURV9DTE9VRElOQVJZX0FQSV9TRUNSRVRfS0VZLFxyXG4gICAgICBWSVRFX0NMT1VESU5BUllfRk9MREVSOiBwcm9jZXNzLmVudi5WSVRFX0NMT1VESU5BUllfRk9MREVSLFxyXG4gICAgICBWSVRFX0NMT1VESU5BUllfVVBMT0FEX1BSRVNFVDogcHJvY2Vzcy5lbnYuVklURV9DTE9VRElOQVJZX1VQTE9BRF9QUkVTRVRcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUyxTQUFTLGVBQWUsV0FBVztBQUU5VSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFKbUssSUFBTSwyQ0FBMkM7QUFPNU8sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDYixjQUFjLFFBQVEsSUFBSTtBQUFBLE1BQzFCLHNCQUFzQixRQUFRLElBQUk7QUFBQSxNQUNsQyx5QkFBeUIsUUFBUSxJQUFJO0FBQUEsTUFDckMsZ0NBQWdDLFFBQVEsSUFBSTtBQUFBLE1BQzVDLHdCQUF3QixRQUFRLElBQUk7QUFBQSxNQUNwQywrQkFBK0IsUUFBUSxJQUFJO0FBQUEsSUFDN0M7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K