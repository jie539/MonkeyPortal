<template>
	<view>
		<view class="u-absolute cf margin-top-xl" style="z-index: 1;width: 100%;">
			<u-icon name="arrow-leftward" class="fl padding-sm" color="#ffffff" size="58" @click="back"></u-icon>
			<u-icon name="home" class="fr padding-sm" color="#ffffff" size="58" @click="back"></u-icon>
		</view>
		<u-image :src="productImg" width="100%" :lazy-load="true" mode="widthFix">
			<u-loading slot="loading"></u-loading>
		</u-image>
		<view class="padding-xl">
			<view class="text-xxl" style="color: #5C3A14;">
				Free Medical Benfits for Children
			</view>
			<view class="text-sm" style="color: #6F5934;">
				by HSBC Life*
			</view>
			<view class="margin-top-lg margin-bottom-lg" style="color: #4D4D4D;">
				Students can enjoy the Worldwide Medical Coverage by HSBCLife.*HSBC Life (international) Limited (incorporated inBermuda with limited liability).
			</view>
			<u-divider color="#E1E1E1" half-width="500" :use-slot="false"></u-divider>
		</view>
		<view class="margin-left-xl margin-right-xl content">
			<view class="text-position padding-bottom-lg padding-top-lg text-white" style="border-top-left-radius: 49rpx;
			border-top-right-radius: 49rpx;font-size: 35rpx;font-weight: 600;background-color: #DE0012;">
				Outpatient</br>
				(An overall maximum of10x)
			</view>
			<view class="padding-xl text text-bold">
				i.5x General Medical Practitioner<br/>
				1.<span>$50</span> per consult for network doctors.<br/>
				2.100% deductible for up to <span>$50</span>.<br/>
				ii.5x Children Specialist<br/>
				1.<span>$50</span> per consult for network doctors.<br/>
				2.100% deductible for up to <span>$50</span>.<br/>
			</view>
			<view class="text-position padding-bottom-lg padding-top-lg text-white" style="font-size: 35rpx;font-weight: 600;background-color: #DE0012;">
				Hospitalization Benefits
			</view>
			<view class="padding-xl text text-bold">
				i.Room and Board of up to <span>$50</span> per day.<br/>
				ii.Government Hospital Cash <span>$50</span> per day.<br/>
				iii.Hospitalization Benefits ofup to <span>$50.000</span>.<br/>
			</view>
		</view>
		<view class="margin-xl flex justify-center">
			<button class="cu-btn bg-yellow lg round " style="width: 80%;">
				<view class="text-white  text-bold">Button</view>
			</button>
		</view>
		<view class="margin-xl" style="color: #B43A48;font-weight: 600;">
			Please refer to the complete HSBC Benefits schedule for details.
		</view>
		<view class="margin-xl text-xxl text-bold" style="color: #B43A48;">
			Forms Download
		</view>
		<view class="margin-left-xl text-sm" style="color: #B43A48;font-weight: 600;">
			<u-icon name="download" size="48"></u-icon>HSBC Benefits Schedule<br/>
			<u-icon name="download" size="48"></u-icon>HSBC Hospitalisation and Surgical Medical Claim Form<br/>
			<u-icon name="download" size="48"></u-icon>HSBC Outpatient Benefit Claim Form<br/>
		</view>
		<u-divider color="#E1E1E1" half-width="500" :use-slot="false" class="padding"></u-divider>
		<view class="margin-left-xl padding-bottom-xl text-xl" style="color: #B43A48;font-weight: 600;">
			Terms and Conditions
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productImg:'http://194.233.70.163:8080/monkeyTreeTest20211104/p3.jpg'
			}
		},
		onLoad(option){
			this.productImg = option.productImg;
		},
		methods: {
			back(){
				console.log('back');
				//uni.navigateBack();
				uni.navigateTo({
					url:'/pages/index/tabbar'
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
	.content{
		border-radius: 60rpx;
		border-width: 10rpx;
		border-style: solid;
		border-color: #BB0D25;
	}
	.text-position{
		text-align: center;
	}
	span{
		color:#BB0D25;
		font-size: 35rpx;
	}
</style>
