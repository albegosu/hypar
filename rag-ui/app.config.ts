export default defineAppConfig({
  ui: {
    primary: 'violet',
    gray: 'slate',
    button: {
      rounded: 'rounded-lg',
      default: {
        size: 'md',
      },
    },
    card: {
      rounded: 'rounded-xl',
      background: 'bg-white dark:bg-slate-900/60',
      ring: 'ring-1 ring-slate-200 dark:ring-white/10',
      shadow: 'shadow-none',
      divide: 'divide-y divide-slate-200 dark:divide-white/5',
    },
    input: {
      rounded: 'rounded-lg',
      color: {
        white: {
          outline:
            'shadow-sm bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-white/10 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400',
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
