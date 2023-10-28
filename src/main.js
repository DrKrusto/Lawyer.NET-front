import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { createI18n } from 'vue-i18n';
// import { icons } from "oh-vue-icons/icons";

addIcons();

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: require('./locales/en.json'),
      fr: require('./locales/fr.json'),
      it: require('./locales/it.json'),
      de: require('./locales/de.json'),
    }
});

createApp(App)
    .component("v-icon", OhVueIcon)
    .use(router)
    .use(i18n  )
    .mount('#app')
