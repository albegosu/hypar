export default defineAppConfig({
  ui: {
    primary: 'emerald',
    gray: 'slate',
    button: {
      rounded: 'rounded-lg',
      default: {
        size: 'md',
      },
    },
    card: {
      rounded: 'rounded-xl',
      background: 'bg-black/35',
      ring: 'ring-1 ring-emerald-300/20',
      shadow: 'shadow-none',
      divide: 'divide-y divide-emerald-300/15',
    },
    input: {
      rounded: 'rounded-lg',
      color: {
        white: {
          outline:
            'shadow-sm bg-black/35 text-emerald-100 ring-1 ring-inset ring-emerald-300/25 focus:ring-2 focus:ring-emerald-400',
        },
      },
    },
    textarea: {
      rounded: 'rounded-lg',
    },
    select: {
      rounded: 'rounded-lg',
    },
  },
})
