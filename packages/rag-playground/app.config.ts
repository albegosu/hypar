export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',
      secondary: 'purple',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'rounded-lg font-medium',
      },
    },
    card: {
      slots: {
        root: 'rounded-xl',
      },
    },
  },
})
