import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DocMicroLead from './components/DocMicroLead.vue'
import Layout from './Layout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('DocMicroLead', DocMicroLead)
  },
} satisfies Theme
