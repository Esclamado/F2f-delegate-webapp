require('dotenv').config();
const enablePurge = process.env.ENABLE_PURGE || false;
module.exports = {
  darkMode: 'class',
  purge :[],
  // purge: {
  //   enabled: enablePurge,
  //   content: [
  //     './src/**/*.html',
  //     './src/**/*.scss'
  //   ]
  // },
  theme: {
    extend: { },
  },
  variants: { },
  plugins: [],
}