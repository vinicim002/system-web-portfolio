import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes só da lógica pura do admin (serviço local e validação), sem DOM
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
