import tailwindcssPrimeui from 'tailwindcss-primeui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Include the parent library source files
    '../src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssPrimeui],
};
