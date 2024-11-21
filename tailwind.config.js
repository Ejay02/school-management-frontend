/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        eduSky: "#C3EBFA",
        eduSkyLight: "#EDF9FD",
        eduPurple: "#CFCEFF",
        eduPurpleLight: "#F1F0FF",
        eduYellow: "#FAE27C",
        eduYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
