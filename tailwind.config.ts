import type { Config } from 'tailwindcss';
import { capitalizeFirst } from './src/plugins/tailwind/capitalize-first';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        brandColor: '#3c7c8c',
        h1Color: '#3c7c8c',
        defaultAppBgColor: '#ffffff',
        defaultTextColor: '#333',
        lightGrey: '#b8c1c9',
      },
    },
  },
  plugins: [capitalizeFirst],
};
export default config;
