import { createI18n } from 'vue-i18n'
import en from '~/i18n/locales/en.json'
import es from '~/i18n/locales/es.json'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, es },
  })

  nuxtApp.vueApp.use(i18n)
})
