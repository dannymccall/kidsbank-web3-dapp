module.exports = {
    theme: {
      extend: {
        animation: {
          "slide-in": "slideIn 0.5s ease-out forwards",
        },
        keyframes: {
          slideIn: {
            "0%": { opacity: "0", transform: "translateY(40px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
        },
      },
    },
    plugins: [],
  };
  