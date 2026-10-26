import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// La actividad se publica en el subdirectorio /t3_act8_eq05/
export default defineConfig({
  base: "/t3_act8_eq05/",
  plugins: [react()],
});
