<template>
	<view class="login-box position-relative flex align-center justify-center">
		<view class="login_back" @click="back">
			<u-icon name="arrow-left" size="50"></u-icon>
			<view class="h3 font-weight-bold pt-1">{{ type == 'send' ? 'Forgot Password' : 'Check Your Email'}}</view>
		</view>
		<view class="login_bg">
			<view class="h3 text-center mb-2 font-weight-bold">{{ type == 'send' ? 'Forgot Password?' : 'Check Your Mail'}}</view>
			<text class="text-please flex justify-center font-sm text-light-black text-center">
				{{ type == 'send' ? 'Enter the email address associated with your account' : 'We have sent a OTP to your mail piease verify'}}
			</text>
			<view class="login_form" v-if="type == 'send'">
				<!-- <view class="cuIcon cuIcon-newsfill"></view> -->
				<u-icon name="email-fill" size="28"></u-icon>
				<input type="text" v-model="loginForm.login" placeholder="StevenSm0145@gmail.com" maxlength="25" class="rounded font-sm" />
			</view>
			<view class=""  v-if="type == 'ver'">
				<u-message-input mode="box"  :breathe="true" :focus="true" @change="changeInput"></u-message-input>
			</view>
			<button @click="verifyIn">{{ type == 'send' ? 'Send' : 'Verify'}}</button>
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
					number:'',
					ver:'',
				},
				type:"send",
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
			verifyIn() {
				this.type = this.type == 'send' ? 'ver' : 'send';
				if(this.loginForm.ver.length) {
					uni.navigateTo({
						url:'/pages/login/save/save/save'
					})
				}
			},
			changeInput(e) {
				// console.log(e)
				this.loginForm.ver = e;
			}
		}
	}
</script>

<style>
	@import url("../../../../Free/free.css");
	.login-box {
		width: 100%;
		height: 100vh;
	}
	.login-box .login_back {
		width: 100%;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login-box .login_back .u-icon {
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
	.login-box .login_form .cuIcon {
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
		margin-top: 20%;
		border: none;
		box-shadow: 1px 1px 10px #c6c8ca;
		background-color: orangered;
		color: white;
		font-weight: bold;
	}
</style>
