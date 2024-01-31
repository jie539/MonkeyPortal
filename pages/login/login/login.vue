<!-- 蓝色简洁登录页面 -->
<template>
	<view class="t-login" @keydown.enter="login()">
		<!-- 页面装饰图片 -->
		<image class="img-a" src="https://zhoukaiwen.com/img/loginImg/2.png"></image>
		<!-- 标题 -->
		<view class="t-b">{{ title }}</view>
		<view class="t-b2">Please login to continue using our app</view>
		<form class="cl">
			<view class="t-a">
				<image src="https://zhoukaiwen.com/img/loginImg/user.png"></image>
				<view class="line"></view>
				<input type="text" name="account" placeholder="Please enter your account" maxlength="20" v-model="account" />
			</view>
			<view class="t-a">
				<image src="https://zhoukaiwen.com/img/loginImg/pwd.png"></image>
				<view class="line"></view>
				<input type="password" name="code" maxlength="16" placeholder="Please enter your password" v-model="pwd"/>
			</view>
			<button @tap="login()">Login</button>
			<view class="text-gray flex justify-between padding-lr-sm padding-top-sm">
				<text @click="reg">Sign Up</text>
				<text @click="forget">forgot</text>
			</view>
		</form>
		
	</view>
</template>
<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				title: 'Welcome!', //填写logo或者app名称，也可以用：欢迎回来，看您需求
				second: 60, //默认60秒
				showText: true, //判断短信是否发送
				account:'',
				phone: '', //手机号码
				email:'', //邮箱号
				yzm: '' ,//验证码
				pwd:'', //密码
				loginType:'phone' //登录类型
			};
		},
		onLoad() {},
		methods: {
			//当前登录按钮操作
			login() {
				if (!this.account) {
					uni.showToast({ title: 'Please enter your account', icon: 'none' });
					return;
				}
				
				if (!this.pwd) {
					uni.showToast({ title: 'Please enter your password', icon: 'none' });
					return;
				}
					
				if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.account)) {
					this.email = this.account;
				}else if(/^([6|9|5])\d{7}$/.test(this.account) || /^1[3-9]\d{9}$/.test(this.account)){
					this.phone = this.account;
				}else{
					uni.showToast({ title: 'Please enter your phone or email', icon: 'none' });
				}
				this.getData();
			},
			//登录接口
			getData() {
				let that = this;
				const userInfo = {
					email: that.email,
					telephone: that.phone,
					password: that.pwd
				}
				
				let opts = {
					url: 'portal/login',
					method: 'post',
					type :5
				};
				
				uni.showLoading({
					title: 'Loading!'
				});
				
				request.httpRequest(opts,userInfo).then(res => {
					uni.hideLoading();
					if (res.data.code === 200) {					
						const userInfo = res.data.studentInfo
						console.log(userInfo);
						uni.setStorageSync('guardianId',res.data.guardianId)
						uni.setStorageSync('token',res.data.token)
						this.$store.dispatch('setUserInfo', userInfo);
						uni.navigateTo({
							url:'/',
						})
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none' });
					}
				});
			},
			reg(){
				uni.navigateTo({
					url:'/pages/login/register/register'
				})
			},
			forget(){
				uni.navigateTo({
					url:'/pages/login/forgot/forgot'
				})
			},
		}
	};
</script>
<style>
.img-a {
	position: absolute;
	width: 100%;
	top: -150rpx;
	right: 0;
}
.img-b {
	position: absolute;
	width: 50%;
	bottom: 0;
	left: -50rpx;
	/* margin-bottom: -200rpx; */
}
.t-login {
	width: 650rpx;
	margin: 0 auto;
	font-size: 28rpx;
	color: #000;
}

.t-login button {
	font-size: 28rpx;
	background: #5677fc;
	color: #fff;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 50rpx;
	box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
}

.t-login input {
	padding: 0 20rpx 0 120rpx;
	height: 90rpx;
	line-height: 90rpx;
	margin-bottom: 50rpx;
	background: #f8f7fc;
	border: 1px solid #e9e9e9; 
	font-size: 28rpx;
	border-radius: 50rpx;
}

.t-login .t-a {
	position: relative;
}


.t-login .t-a image {
	width: 40rpx;
	height: 40rpx;
	position: absolute;
	left: 40rpx;
	top: 28rpx;
	/* border-right: 2rpx solid #dedede; */
	margin-right: 20rpx;
}
.t-login .t-a .line{
	width: 2rpx;
	height: 40rpx;
	background-color: #dedede;
	position: absolute;
	top: 28rpx;
	left: 98rpx;
}

.t-login .t-b {
	text-align: left;
	font-size: 46rpx;
	color: #000;
	padding: 300rpx 0 30rpx 0;
	font-weight: bold;
}
.t-login .t-b2 {
	text-align: left;
	font-size: 32rpx;
	color: #aaaaaa;
	padding: 0rpx 0 120rpx 0;
}

.t-login .t-c {
	position: absolute;
	right: 22rpx;
	top: 22rpx;
	background: #5677fc;
	color: #fff;
	font-size: 24rpx;
	border-radius: 50rpx;
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 25rpx;
}

.t-login .t-d {
	text-align: center;
	color: #999;
	margin: 80rpx 0;
}

.t-login .t-e {
	text-align: center;
	width: 250rpx;
	margin: 80rpx auto 0;
}

.t-login .t-g {
	float: left;
	width: 50%;
}

.t-login .t-e image {
	width: 50rpx;
	height: 50rpx;
}

.t-login .t-f {
	text-align: center;
	margin: 200rpx 0 0 0;
	color: #666;
}

.t-login .t-f text {
	margin-left: 20rpx;
	color: #aaaaaa;
	font-size: 27rpx;
}

.t-login .uni-input-placeholder {
	color: #aeaeae;
}

.cl {
	zoom: 1;
}

.cl:after {
	clear: both;
	display: block;
	visibility: hidden;
	height: 0;
	content: '\20';
}
</style>
