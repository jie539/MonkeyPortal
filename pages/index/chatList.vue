<template>
	<view class="cu-list menu-avatar">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">聊天列表</block>
		</cu-custom>
		<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in 4" :key="index"
		 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" @tap="ListListTouch" :data-target="'move-box-' + index">
			<view class="cu-avatar round lg" :style="[{backgroundImage:'url(https://ossweb-img.qq.com/images/lol/web201310/skin/big2100'+ (index+2) +'.jpg)'}]"></view>
			<view class="content">
				<view class="text-grey">文晓港</view>
				<view class="text-gray text-sm">
					<text class="cuIcon-infofill text-red  margin-right-xs"></text> 消息未送达</view>
			</view>
			<view class="action">
				<view class="text-grey text-xs">22:20</view>
				<view class="cu-tag round bg-grey sm">5</view>
			</view>
			<view class="move">
				<view class="bg-grey">置顶</view>
				<view class="bg-red">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,

			}
		},
		methods: {
			ListListTouch(e){
				  // 获取点击的元素
				  const targetElement = event.currentTarget;
			
				  // 通过操作 DOM 获取相应的值
				  const name = targetElement.querySelector('.text-grey').textContent;
				  const url = targetElement.querySelector('.cu-avatar').style.backgroundImage;
			
				  // 输出获取到的值
				  console.log('Name:', name);
				  console.log('URL:', url);
			},
			// ListTouch触摸开始，获取触摸点距盒子左侧的距离
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向，
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style>

</style>
