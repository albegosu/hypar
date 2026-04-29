import { useI18n } from 'vue-i18n'

type Theme = 'dark' | 'light'
type Locale = 'en' | 'es'

const THEME_KEY = 'rag-ui-theme'
const LOCALE_KEY = 'rag-ui-locale'

const theme = ref<Theme>('dark')
let initialized = false

export function useTerminalPrefs() {
  const { locale } = useI18n()

  if (!initialized && import.meta.client) {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme.value = savedTheme
    } else {
      theme.value = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
    }

    const savedLocale = localStorage.getItem(LOCALE_KEY)
    const browserLocale = navigator.language.toLowerCase().startsWith('es')
      ? 'es'
      : 'en'
    locale.value =
      savedLocale === 'es' || savedLocale === 'en' ? savedLocale : browserLocale

    initialized = true
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) localStorage.setItem(THEME_KEY, theme.value)
  }

  function setLocale(value: Locale) {
    locale.value = value
    if (import.meta.client) localStorage.setItem(LOCALE_KEY, value)
  }

  return {
    theme,
    locale: locale as Ref<Locale>,
    toggleTheme,
    setLocale,
  }
}
