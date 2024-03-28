// Tailwind config
const plugin = require('tailwindcss/plugin');

// Let's create a plugin that adds utilities!
export const capitalizeFirst = plugin(function ({ addUtilities }) {
  const capitalizeFirstStyle = {
    '.capitalize-first:first-letter': {
      textTransform: 'uppercase',
    },
  };
  addUtilities(capitalizeFirstStyle);
});
