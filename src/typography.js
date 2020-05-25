import Typography from "typography"

const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: ["Roboto", "sans-serif"],
  bodyFontFamily: ["Open Sans", "sans-serif"],
  googleFonts: [
    {
      name: "Roboto",
      styles: ["400", "700"],
    },
    {
      name: "Open Sans",
      styles: ["400"],
    },
  ],
})

export default typography
