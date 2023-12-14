/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background:"#eeeeee",
        primary:"#A6B1E1",
        secondary:"#DCD6F7",
        accent:"#424874",
        secondary2:"#c77135",
        cardColorOne:"#e5dcd7",
        cardColorTwo:"#CEEDC7",
        cardColorThree:"#FFF6BD",
        cardColorFour:"#C0DEFF",
        darkenBg:"rgba(0, 0, 0, 0.3)"
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
  plugins: [],
}

