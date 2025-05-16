import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     mode === 'development' &&
//     componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

export default defineConfig({
  plugins: [react()],
  preview: {
    port: parseInt(process.env.PORT || "4173"),
    host: "0.0.0.0",
    allowedHosts: (process.env.ALLOWED_HOSTS || "").split(",").filter(Boolean),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
});