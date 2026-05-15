import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmos: {
          void: "#03030a",
          deep: "#0a0a1f",
          night: "#10103a",
          nebula: "#1a1245",
          aurora: "#7c5cff",
          plasma: "#c084fc",
          nova: "#f0abfc",
          star: "#e0f2fe",
          ember: "#fb7185",
        },
        badge: {
          fact: "#22d3ee",
          established: "#a78bfa",
          probable: "#fbbf24",
          speculative: "#fb7185",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "cosmic-gradient":
          "radial-gradient(ellipse at top, #1a1245 0%, #0a0a1f 45%, #03030a 100%)",
        "aurora-gradient":
          "linear-gradient(135deg, #7c5cff 0%, #c084fc 50%, #f0abfc 100%)",
      },
      animation: {
        "drift-slow": "drift 60s linear infinite",
        "twinkle": "twinkle 4s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-200px, -200px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.95" },
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 92, 255, 0.35)",
        "glow-lg": "0 0 80px rgba(192, 132, 252, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
