import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/once-timer-card.ts",
  output: {
    file: "dist/once-timer-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [resolve(), typescript()],
  // Bundle everything including lit — HA does not expose lit as a module
  external: [],
};
