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
	i18n,
	beforeMount() {
	    // 模拟路由守卫逻辑，例如检查用户是否登录
		//const currentPath = this.$route.path;
		//console.log(currentPath);
		const excludedPaths = [
		  '/pages/login/login/login',
		  '/pages/login/forgot/forgot',
		  '/pages/login/register/register'
		];
		//if ((!uni.getStorageSync('studentInfo') || uni.getStorageSync('expireTime') < new Date().getTime()) && !excludedPaths.includes(currentPath)) {		
	    if ((!uni.getStorageSync('studentInfo') || uni.getStorageSync('expireTime') < new Date().getTime()) ) {
	      // 用户未登录，并且当前页面不是登录页面，跳转到登录页面
		  setTimeout(()=>{
			  uni.showToast({ title: 'Login has expired', icon: 'none' });
			  setTimeout(()=>{
					uni.redirectTo({
						url:'/pages/login/login/login'
					})
			  },3000)
		  },1000)
	    }else{
			 this.$store.state.user.studentInfo = uni.getStorageSync('studentInfo');
			 this.$store.state.user.studentId = uni.getStorageSync('info').studentId;
			 this.$store.state.user.studentName = uni.getStorageSync('info').studentName;	
			 this.$store.state.user.info = uni.getStorageSync('info');
			 this.$i18n.locale = this.$store.getters.local;
			 
		}
		if(this.$store.getters.guardianId==''){
			this.$store.dispatch('setGuardianId', uni.getStorageSync('guardianId'));
			this.$store.dispatch('initWebSocket',this.$store.getters.guardianId);
		}
		if(this.$store.getters.guardianName==''){
			this.$store.dispatch('setGuardianName', uni.getStorageSync('guardianName'));		
		}
		if(this.$store.getters.local==''){
			this.$store.dispatch('setLang', uni.getStorageSync('lang'));		
		}
	},
})
app.$mount()
