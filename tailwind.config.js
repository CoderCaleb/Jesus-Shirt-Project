/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background:"#FFFFFF",
        primary:"#A6B1E1",
        secondary:"#DCD6F7",
        accent:"#424874",
        secondary2:"#597E52",
        cardColorOne:"#e5e1de",
        cardColorTwo:"#CEEDC7",
        cardColorThree:"#FFF6BD",
        cardColorFour:"#C0DEFF",
        darkenBg:"rgba(0, 0, 0, 0.6)",
        google: {
          'text-gray': '#3c4043',
          'button-blue': '#1a73e8',
          'button-blue-hover': '#5195ee',
          'button-dark': '#202124',
          'button-dark-hover': '#555658',
          'button-border-light': '#dadce0',
          'logo-blue': '#4285f4',
          'logo-green': '#34a853',
          'logo-yellow': '#fbbc05',
          'logo-red': '#ea4335',
        },
        successGreen:"#00b66d"
      },
      height:{
        lineBreakHeight: '1px',
        cardHeight:"300px"
      },
      width:{
        cardWidth:"300px",
        cartSummaryWidth:""
      },
      maxHeight:{
        bannerMaxHeight: "420px"
      },
      borderWidth:{
        1:"1px"
      },
      maxWidth:{
        maxImageGridWidth:"524px",
        emptyCartImg:"290px"
      },
      minWidth:{
        minPictureGrid: "350px"
      }

    },
  },
  plugins: [
    require('autoprefixer'),
    require('tailwindcss-animated')
  ],
}

