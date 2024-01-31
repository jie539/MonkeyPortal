<template>
	<view class="cu-list menu-avatar">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">聊天列表</block>
		</cu-custom>
<!-- 		<view class="cu-item" :class="{ 'move-cur': modalName === 'move-box-' + index, 'bottom': index === chatRecords.length - 1+10 }" v-for="(item, index) in chatRecords" :key="index" -->
		<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in chatRecords" :key="index"  
		  @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" @tap="ListListTouch" :data-target="'move-box-' + index">
		  <view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + item.avatar + ')' }"></view>
		  <view class="content">
			<view class="text-grey">{{ item.senderName }}</view>
			<view class="text-gray text-sm">
			  <text class="cuIcon-infofill text-red margin-right-xs" v-if="!item.isSuccess"></text> {{ item.message }}
			</view>
		  </view>
		  <view class="action">
			<view class="text-grey text-xs">{{ item.timestamp }}</view>
			<view class="cu-tag round bg-grey sm">{{ item.unreadCount }}</view>
		  </view>
		  <view class="move">
			<view class="bg-grey" @tap.stop="Topping(index)">置顶</view>
			<view class="bg-red" @tap.stop="deleteItem(index)">删除</view>
		  </view>
		</view>
		<cu-custom/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				chatRecords: [
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21002.jpg',
					  senderName: '文晓港',
					  message: '消息未送达',
					  timestamp: '22:20',
					  unreadCount: 5,
					  isSuccess:false
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21003.jpg',
					  senderName: '张三',
					  message: '你好，有空吗？',
					  timestamp: '23:45',
					  unreadCount: 2,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},
					{
					  avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21004.jpg',
					  senderName: '李四',
					  message: '晚上一起吃饭吗？',
					  timestamp: '00:30',
					  unreadCount: 1,
					  isSuccess:true
					},					
				]
			}
		},
		methods: {
			deleteItem(index){
				this.chatRecords.splice(index, 1);
			},
			Topping(index){
				const selectedRecord = this.chatRecords.splice(index, 1)[0];
				this.chatRecords.unshift(selectedRecord);
			},
			ListListTouch(e){
				  // 获取点击的元素
				  const targetElement = event.currentTarget;
			
				  // 通过操作 DOM 获取相应的值
				  const name = targetElement.querySelector('.text-grey').textContent;
				  const url = targetElement.querySelector('.cu-avatar').style.backgroundImage;
			
				  // 输出获取到的值
				  console.log('Name:', name);
				  console.log('URL:', url);
				  uni.navigateTo({
				  	url:'/pages/chat/chatroom?url='+url+'&name='+name,
				  })
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
	.bottom{
		margin-bottom: 100upx;
	}
</style>
