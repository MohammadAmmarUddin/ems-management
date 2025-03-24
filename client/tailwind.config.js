/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A237E',  // Navy Blue
        secondary: '#FF8C00', // Peach
        accent: '#FFC107',    // Amber/Gold
        background: '#F3F4F6', // Light Gray
        text: '#212121', // Dark Gray for Text
        view: '#4CAF50',  // Green for View
        delete: '#F44336', // Red for Delete
        edit: '#FF9800',   // Amber for Edit
        add: '#2196F3',    // Blue for Add
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
