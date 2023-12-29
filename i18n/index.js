import Vue from 'vue'
// 引入自己的语言包
import chinese from "./zh"; // 中文
import english from "./en"; // 英文
// 国际化
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

// 配置i18n语言包
const messages = {
  zh: {
    ...chinese
  },
  en: {
    ...english
  }
}

export const getStorage = function(key){
	const str = localStorage.getItem(key)
	return str
}

const lang = getStorage('lang') || 'en'

// 国际化配置
const i18n = new VueI18n({
  locale: lang, // 默认中文
  messages
})

export default i18n
