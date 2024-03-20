import Vue from 'vue'
// 引入自己的语言包
import chinese from "./zh_cn"; // 简中
import raditionalChinese  from "./zh_hk"; // 繁中
import english from "./en"; // 英文
// 国际化
import VueI18n from 'vue-i18n'
import store from 'stroe'

import { SourceTextModule } from 'vm';
Vue.use(VueI18n,store)

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
	if(store.getters.local==''){
		store.dispatch('setLang', 'en');		
	}
	return store.getters.local;
}
getStorage();

// 国际化配置
const i18n = new VueI18n({
  locale: 'en', // 默认英文
  messages
})

export default i18n
