<!-- 蓝色简洁登录页面 -->
<template>
	<view class="t-login">
		<!-- 页面装饰图片 -->
		<image class="img-a" src="https://zhoukaiwen.com/img/loginImg/2.png"></image>
		<!-- 标题 -->
		<view class="t-b">{{ title }}</view>
		<view class="t-b2">Enter the phone your've registered at Monkey Tree</view>
		<form class="cl">
			<view class="t-a">
				<picker @change="PickerChange" :value="index" :range="picker">
					<image :src="require('@/static/login/local.png')"></image>
					<view class="line"></view>
					<input type="text" placeholder="请选择地区" v-model="local"/>
				</picker>			
			</view>
			<view class="t-a">
				<image src="https://zhoukaiwen.com/img/loginImg/user.png"></image>
				<view class="line"></view>
				<input type="text" name="account" placeholder="Please enter your account" maxlength="20" v-model="account" />
			</view>
			<view class="t-a">
				<image src="https://zhoukaiwen.com/img/loginImg/pwd.png"></image>
				<view class="line"></view>
				<input type="password" name="code" maxlength="16" placeholder="Please enter your password" v-model="pwd" />
			</view>
			<view class="t-a">
				<image src="https://zhoukaiwen.com/img/loginImg/yz.png"></image>
				<view class="line"></view>
				<input type="number" name="code" maxlength="6" placeholder="Please enter code" v-model="yzm" />
				<view v-if="showText" class="t-c" @tap="send()">send</view>
				<view v-else class="t-c" style="background-color: #A7A7A7;">Resend({{ second }})</view>
			</view>
			<button @tap="verify()">Confirm</button>
		</form>
		<view class="t-f"><text>————— Back —————</text></view>
		<view class="t-e cl">
			<u-icon v-if="loginType === 'phone'" name="account-fill" color="#b4b3b1" size="56" @tap="phoneLogin"></u-icon>
		</view>
		
	</view>
</template>
<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				interval:null,
				index:0,
				picker: ['CN-HK', 'CN-MO'],
				areaCode: ['852','853'],
				title: 'Forgot Password?', //填写logo或者app名称，也可以用：欢迎回来，看您需求
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
		onUnload() {
			this.stopTimer();
		},
		computed:{
			local(){
				return this.picker[this.index]
			},
			getPhone(){
				return this.areaCode[this.index] + this.account;
			}
		},
		methods: {
			PickerChange(e) {
			    this.index = e.detail.value
			},
			//当前登录按钮操作
			verify() {
				if (!this.account) {
					uni.showToast({ title: 'Please enter your account', icon: 'none' });
					return;
				}
				
				if (!this.pwd) {
					uni.showToast({ title: 'Please enter your password', icon: 'none' });
					return;
				}
				
				if (!this.yzm) {
					uni.showToast({ title: 'Please enter your code', icon: 'none' });
					return;
				}
				this.verifyAccount();
				this.updataPassword();
			},
			verifyAccount(){
				if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.account)) {
					this.email = this.account;
				}else if(/^([6|9|5])\d{7}$/.test(this.account) || /^1[3-9]\d{9}$/.test(this.account)){
					this.phone = this.getPhone;
				}else{
					uni.showToast({ title: 'Please enter your phone or email', icon: 'none' });
				}
			},
			//获取短信验证码
			send() {
				var that = this;
				this.interval = setInterval(() => {
					that.showText = false;
					var times = that.second - 1;
					//that.second = times<10?'0'+times:times ;//小于10秒补 0
					that.second = times;
					console.log(times);
				}, 1000);
				setTimeout(() => {
					this.stopTimer();
				}, 60000);
				//这里请求后台获取短信验证码
				this.sendCode();
			},
			stopTimer() {
				clearInterval(this.interval);
				this.second = 60;
				this.showText = true;
			},
			//短信验证码接口
			sendCode() {
				this.verifyAccount();
				let that = this;
				const userInfo = {
					email: that.email,
					telephone: that.phone,
				}
				
				let opts = {
					url: 'portal/send',
					method: 'post',
					type :5
				};
				
				uni.showLoading({
					title: 'Loading!'
				});
				
				request.httpRequest(opts,userInfo).then(res => {
					uni.hideLoading();
					if (res.data.code === 200) {					
						uni.showToast({ title: 'Sent successfully', icon: 'none' });
					} else {
						uni.showToast({ title: res.data.msg, icon: 'none' });
					}
				});
			},
			//验证code
			updataPassword(){
				let that = this;
				const userInfo = {
					email: that.email,
					telephone: that.phone,
					password: that.pwd
				}
				
				let opts = {
					url: `portal/register?code=${that.yzm}`,
					method: 'post',
					type :5
				};
				
				uni.showLoading({
					title: 'Loading!'
				});
				
				request.httpRequest(opts,userInfo).then(res => {
					uni.hideLoading();
					if (res.data.code === 200) {					
						console.log(res.data);
						uni.showToast({ title: 'Password changed successfully!', icon: 'success' });
						setTimeout(()=>{
							uni.redirectTo({
								url:'/pages/login/login/login'
							})
						},3000)
					} else {
						console.log(res.data.msg);
						uni.showToast({ title: res.data.msg, icon: 'none' });
					}
				});
			},
			phoneLogin(){
				uni.redirectTo({
					url:'/pages/login/login/login'
				})
			},
		},
	};
</script>
<style>
.area-code{
	position: absolute;
	top:30rpx;
	left: 24rpx;
}	
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
	left: 108rpx;
}

.t-login .t-b {
	text-align: left;
	font-size: 46rpx;
	color: #000;
	padding: 290rpx 0 30rpx 0;
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
