/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        home: "url('/home.jpg')",
        home2: "url('/home2.jpg')",
        home4: "url('/home4.jpg')",
        home3: "url('/home3.jpg')",
      },
      screens: {
        xsm: "400px",
      },
      colors: {
        blacktrans: "rgb(0,0,0,0.5)",
      },
      keyframes: {
        fadein: {
          "0%": { opacity: 0.5 },
          "100%": { opacity: 1 },
        },
        slideinleft: {
          "0%": { transform: "translatex(100%)" },
          "100%": { transform: "translatex(0%)" },
        },
        slideoutleft: {
          "0%": { transform: "translatex(0%)" },
          "100%": { transform: "translatex(100%)" },
        },

        slideoutright: {
          "0%": { transform: "translatex(0)" },
          "100%": { transform: "translatex(-100%)" },
        },
        slideinright: {
          "0%": { transform: "translatex(-100%)" },
          "100%": { transform: "translatex(0)" },
        },
        growleft: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "80%": { transform: "scaleX(1.1)", opacity: "1" },
          "100%": { transform: "scaleX(1)" },
        },
        growright: {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
        growdown: {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "80%": { transform: "scaleY(1.1)", opacity: "1" },
          "100%": { transform: "scaleY(1)" },
        },
        growup: {
          "0%": { transform: "scaleY(1)" },
          "100%": { transform: "scaleY(0)" },
        },
        flytocart: {
          "0%": {
            opacity: 1,
            top: 0,
            right: 0,
          },
          "80%": {
            opacity: "0.8",
            transform: "scale(0.4)",
          },
          "100%": { transform: "scale(0.3)", opacity: "0.2", top: "var(--img-top)", right: "var(--img-right)" },
        },
        imgmount: {
          "0%": {
            opacity: 0.2,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        slideinleft: "slideinleft 500ms forwards",
        slideoutleft: "slideoutleft 500ms forwards",
        slideoutright: "slideoutright 500ms  forwards",
        slideinright: "slideinright 500ms forwards",
        growright: "growright 300ms ease-in forwards",
        growleft: "growleft 300ms ease-in forwards",
        growdown: "growdown 200ms ease-in forwards",
        growup: "growup 150ms ease-out forwards",
        flyto: "flytocart 500ms ease-in-out forwards",
        imgmount: "imgmount 500ms ease-in-out forwards",
        fadein: "fadein 500ms forwards",
      },
    },
  },
  plugins: [],
};
