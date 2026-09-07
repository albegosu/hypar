export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neutral',
      secondary: 'neutral',
      neutral: 'neutral',
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
