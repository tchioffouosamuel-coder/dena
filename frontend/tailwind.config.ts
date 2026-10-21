import type { Config } from 'tailwindcss';

const brand = {
  blue: '#006BB4',
  'blue-dark': '#00538D',
  green: '#B5E525',
  'green-dark': '#42631B',
  amber: '#F4A32B',
  'amber-dark': '#91430B',
  ink: '#142C35',
  mist: '#F6FAF0',
};

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand,
        navy: brand.ink,
        orange: brand['amber-dark'],
        cream: brand.mist,
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
};
export default config;
