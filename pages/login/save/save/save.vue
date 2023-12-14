<template>
	<view class="login-box position-relative flex align-center justify-center">
		<u-popup v-model="show" mode="center" width="450rpx" height="200px" closeable border-radius="20">
			<view class="popup">
				<view class="pb-1">Passwords are inconsistent</view>
				<view>Please enter a unified password !</view>
			</view>
		</u-popup>
		<u-popup v-model="isClose" mode="center" width="450rpx" height="200px" border-radius="20">
			<view class="popup">
				<view>Password set successfully !</view>
			</view>
		</u-popup>
		<view class="login_back" @click="back">
			<u-icon name="arrow-left" size="50"></u-icon>
			<view class="h3 font-weight-bold pt-1">Create New Password</view>
		</view>
		<view class="login_bg">
			<view class="h3 text-center mb-2 font-weight-bold">Change Password</view>
			<text class="text-please flex justify-center font-sm text-light-black text-center">Enter the email address associated with your account</text>
			<view class="login_form position-relative">
				<u-icon name="lock-fill" size="28"></u-icon>
				<input type="text" v-model="loginForm.new_password" :password="eyeFill" placeholder="New Passward" maxlength="20" class="rounded font-sm" />
				<view v-if="eyeFill" class="cuIcon-attentionfavorfill"  @click="eyeFilled"></view>
				<view v-else class="cuIcon-attentionfavor"  @click="eyeFilled"></view>
			</view>
			<view class="login_form position-relative">
				<u-icon name="lock-fill" size="28"></u-icon>
				<input type="text" v-model="loginForm.con_password" :password="eyeFills" placeholder="Conform Passward" maxlength="20" class="rounded font-sm" />
				<view v-if="eyeFills" class="cuIcon-attentionfavorfill"  @click="eyeFilleds"></view>
				<view v-else class="cuIcon-attentionfavor"  @click="eyeFilleds"></view>
			</view>
			<button @click="saveIn">Save</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				eyeFill:true,
				eyeFills:true,
				loginForm:{
					name:'',
					login:'',
					password:'',
					number:'',
					ver:'',
					new_password:'',
					con_password:'',
				},
				type:"send",
				show:false,
				isClose:false,
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
			eyeFilleds() {
				this.eyeFills = !this.eyeFills
			},
			saveIn() {
				if(this.loginForm.new_password == this.loginForm.con_password && this.loginForm.new_password !== " " && this.loginForm.con_password ) {
					this.isClose = true;
					setTimeout(() => {
						this.isClose = true
						uni.navigateTo({
							url:'/pages/login/login/login'
						})
					},1500)
				}else {
					this.show = true
				}
			},
		}
	}
</script>

<style>
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
	.login-box .popup {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
