// 入口文件
import Vue from 'vue'
import App from './App'
import store from './stroe'
// 此处为引用自定义顶部
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom);
import TnCustom from './components/TnCustom/TnCustom.vue'
Vue.component('tn-custom', TnCustom)

// 引入:uView-UI
import uView from 'uview-ui';
Vue.use(uView);
//引入i18n
import i18n from './i18n';

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
	i18n
})
app.$mount()
