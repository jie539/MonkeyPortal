<template>
	<view class="login-box position-relative flex align-center justify-center">
		<view class="login_back" @click="back">
			<u-icon name="arrow-left" size="50"></u-icon>
		</view>
		<view class="login_bg">
			<view class="h2 text-center mb-2 font-weight-bold">{{ type == 'login' ? 'Login' : 'Sign Up'}}</view>
			<text class="text-please flex justify-center font-sm text-light-black text-center">
				{{ type == 'login' ? 'Please login to continue using our app' : 'Enter the email address associated with your account'}}
			</text>
			<view class="login_form" v-if="type == 'reg'">
				<view class="cuIcon cuIcon-myfill"></view>
				<input type="text" v-model="loginForm.name" placeholder="User Name" maxlength="25" class="rounded font-sm" />
			</view>
			<view class="login_form">
				<!-- <view class="cuIcon cuIcon-newsfill"></view> -->
				<u-icon name="email-fill" size="28"></u-icon>
				<input type="text" v-model="loginForm.login" placeholder="StevenSm0145@gmail.com" maxlength="25" class="rounded font-sm" />
			</view>
			<view class="login_form position-relative">
				<!-- <view class="cuIcon cuIcon-commandfill"></view> -->
				<u-icon name="lock-fill" size="28"></u-icon>
				<input type="text" v-model="loginForm.password" :password="eyeFill" placeholder="Passward" maxlength="20" class="rounded font-sm" />
				<view v-if="eyeFill" class="cuIcon-attentionfavorfill"  @click="eyeFilled"></view>
				<view v-else class="cuIcon-attentionfavor"  @click="eyeFilled"></view>
			</view>
			<view class="login_form position-relative" v-if="type == 'reg'">
		     	<view class="cuIcon cuIcon-dianhua"></view>
				<input type="text" v-model="loginForm.number" placeholder="Mobile Number" maxlength="11" class="rounded font-sm" />
			</view>
			<view class="flex justify-between mt-1">
				<text class="sign-up font-sm" @click="changType">{{ type == 'login' ? 'Sign Up' : 'Login'}}</text>
				<text class="forgot-password font-sm" color="#83BEAC" @click="Forgot">Forgot Password?</text>
			</view>
			<button @click="signIn">{{ type == 'login' ? 'Login' : 'Sign Up'}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				eyeFill:true,
				loginForm:{
					name:'',
					login:'',
					password:'',
					number:''
				},
				type:"login",
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			eyeFilled() {
				this.eyeFill = !this.eyeFill
			},
			changType() {
				this.type = this.type == 'login' ? 'reg' : 'login'
			},
			Forgot() {
				uni.navigateTo({
					url:'/pages/login/forgot/forgot/forgot'
				})
			}
		}
	}
</script>

<style>
	.login-box {
		width: 100%;
		height: 100vh;
	}
	.login-box .login_back {
		position: absolute;
		top: 20rpx;
		left: 10rpx;
	}
	.login-box .login_bg  {
		width: 70%;
		/* background-color: aquamarine; */
	}
	.login-box .login_bg .login_form {
		display: flex;
		align-items: center;
		border: 1px solid #f5f5f5;
		margin-top: 30rpx;
		border-radius: 10rpx;
		box-shadow: 1px 1px 10px #c6c8ca;
	}
	.login-box .login_bg .text-please {
		margin-bottom: 80rpx;
	}
	.login-box .login_form .u-icon,
	.login-box .login_form .cuIcon{
		padding: 25rpx;
	}
	.login-box .login_form input {
	    width: 70%;
		/* background-color: aqua; */
	}
	.login-box .forgot-password {
		color: darkred;
	}
	.login-box .sign-up {
		color: deepskyblue;
	}
	.login-box button {
		width: 50%;
		margin-top: 10%;
		border: none;
		box-shadow: 1px 1px 10px #c6c8ca;
		background-color: orangered;
		color: white;
		font-weight: bold;
	}
</style>
