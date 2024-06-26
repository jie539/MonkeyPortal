
// const baseUrl = 'https://gamejava.monkeytree.com.hk/';
// const baseUrl = 'http://localhost:8080/monkeytownHK/';
let baseUrl;

// 不带token请求
const httpRequest = (opts, data) => {
	if(opts.type == 2){
		baseUrl = 'https://www.zhoukaiwen.com/';
	}else if(opts.type == 3){
		baseUrl = 'https://gamejava.monkeytree.com.hk/';
	}else if(opts.type == 4){
		baseUrl = 'http://localhost:8080/monkeytownHK/';
	}else if(opts.type == 5){
		//baseUrl = 'http://localhost:8085/';
		baseUrl = 'https://appbackend.monkeytree.com.hk/';
	}else{
		baseUrl = 'https://api.zhoukaiwen.com/';
	}
	uni.onNetworkStatusChange(function(res) {
		if (!res.isConnected) {
			uni.showToast({
				title: '网络连接不可用！',
				icon: 'none'
			});
		}
		return false
	});
	let httpDefaultOpts = {
		url: baseUrl + opts.url,
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			//'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json; charset=UTF-8'
		},
		dataType: 'json',
		//保证接口 的session和websocket的session保持一致
		withCredentials: true
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(httpDefaultOpts).then(
			(res) => {
				resolve(res[1])
			}
		).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
};

//带Token请求
const httpTokenRequest = (opts, data) => {
	if(opts.type == 2){
		baseUrl = 'https://www.zhoukaiwen.com/';
	}else{
		baseUrl = 'https://api.zhoukaiwen.com/';
	}
	uni.onNetworkStatusChange(function(res) {
		if (!res.isConnected) {
			uni.showToast({
				title: '网络连接不可用！',
				icon: 'none'
			});
		}
		return false
	});
	let token = uni.getStorageSync('token');
	// hadToken()
	if (token == '' || token == undefined || token == null) {
		uni.showToast({
			title: '账号已过期，请重新登录',
			icon: 'none',
			complete: function() {
				uni.reLaunch({
					url: '/pages/login/index'
				});
			}
		});
	} else {
		let httpDefaultOpts = {
			url: baseUrl + opts.url,
			data: data,
			method: opts.method,
			header: opts.method == 'get' ? {
				'X-Access-Token': token,
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": "application/json; charset=UTF-8"
			} : {
				'X-Access-Token': token,
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json; charset=UTF-8'
			},
			dataType: 'json',
			withCredentials: true
		}
		let promise = new Promise(function(resolve, reject) {
			uni.request(httpDefaultOpts).then(
				(res) => {
					if (res[1].data.code == 200) {
						resolve(res[1])
					} else {
						if (res[1].data.code == 5000) {
							// uni.showModal({
							// 	title: '提示',
							// 	content: res[1].data.message,
							// 	success: function (res) {
							// 		if (res.confirm) {
							// 			uni.reLaunch({
							// 				url: '/pages/login/login'
							// 			});
							// 			uni.clearStorageSync();
							// 		} 
							// 	}
							// });
							uni.reLaunch({
								url: '/pages/login/index'
							});
							uni.clearStorageSync();
						} else {
							resolve(res[1])
							// uni.showToast({
							// 	title: '' + res[1].data.message,
							// 	icon: 'none'
							// })
						}
					}
				}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise
	}
	// let token = uni.getStorageSync('token')
	//此token是登录成功后后台返回保存在storage中的

};

// 拦截器
const hadToken = () => {
	let token = uni.getStorageSync('token');

	if (token == '' || token == undefined || token == null) {
		uni.showToast({
			title: '账号已过期，请重新登录',
			icon: 'none',
			complete: function() {
				uni.reLaunch({
					url: '/pages/login/index'
				});
			}
		});
		return false;
	}
	return true
}
export default {
	baseUrl,
	httpRequest,
	httpTokenRequest,
	hadToken
}
