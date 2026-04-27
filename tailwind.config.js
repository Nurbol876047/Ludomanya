/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        panel: "#0b0f14",
        line: "rgba(255,255,255,0.12)",
        neon: {
          cyan: "#19f6ff",
          lime: "#b7ff39",
          red: "#ff3d57",
          amber: "#ffb020",
          violet: "#9d7cff"
        }
      },
      boxShadow: {
        cyan: "0 0 34px rgba(25, 246, 255, 0.24)",
        danger: "0 0 40px rgba(255, 61, 87, 0.28)",
        lime: "0 0 34px rgba(183, 255, 57, 0.22)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
