/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        'primary-bg-light': '#FFFFFF',
        'secondary-bg-light': '#F9FAFB',
        'primary-text-light': '#1F2937',
        'secondary-text-light': '#6B7280',
        'accent-light': '#2563EB',
        'destructive-light': '#DC2626',
        'my-message-bg-light': '#DBEAFE',
        'their-message-bg-light': '#F3F4F6',

        'primary-bg-dark': '#111827',
        'secondary-bg-dark': '#1F2937',
        'primary-text-dark': '#F9FAFB',
        'secondary-text-dark': '#9CA3AF',
        'accent-dark': '#3B82F6',
        'destructive-dark': '#EF4444',
        'my-message-bg-dark': '#056162',
        'my-message-text-dark': '#FFFFFF',
        'my-message-bg-light': '#DCF8C6',
        'my-message-text-light': '#000000',
        'their-message-bg-dark': '#374151',
      }
    },
  },
  plugins: [],
}
