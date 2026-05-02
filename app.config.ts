export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      secondary: 'violet',
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
