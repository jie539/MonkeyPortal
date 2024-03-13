import Vue from 'vue'
// 引入自己的语言包
import chinese from "./zh_cn"; // 简中
import raditionalChinese  from "./zh_hk"; // 繁中
import english from "./en"; // 英文
// 国际化
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

// 配置i18n语言包
const messages = {
  'zh_cn': {
    ...chinese
  },
  'zh_hk':{
	...raditionalChinese
  },
  en: {
    ...english
  }
}

export const getStorage = function(key){
	const str = uni.getStorage(key);
	// const str = localStorage.getItem(key)
	return str
}

const lang = getStorage('lang') || 'en'

// 国际化配置
const i18n = new VueI18n({
  locale: lang, // 默认英文
  messages
})

export default i18n
