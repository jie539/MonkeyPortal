<template>
	<view class="cu-list menu-avatar">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">聊天列表</block>
		</cu-custom>
		<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in chatRecords" :key="index"  
		  @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" @tap="ListListTouch(item)" :data-target="'move-box-' + index">
		  <view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + item.avatar + ')' }"></view>
		  <view class="content">
			<view class="text-grey">{{ item.senderName }}</view>
			<view class="text-gray text-sm">
			  <text class="cuIcon-infofill text-red margin-right-xs" v-if="!item.isSuccess"></text>
			  <rich-text style="display: contents;" :nodes="item.message ? item.message : '&ZeroWidthSpace;'"></rich-text>
			</view>
		  </view>
		  <view class="action">
			<view class="text-grey text-xs">{{ item.timestamp }}</view>
			<view class="cu-tag round sm" :class="item.unreadCount === 0 ? 'bg-w' : 'bg-grey'">{{ item.unreadCount }}</view>
		  </view>
		  <view class="move">
			<view class="bg-grey" @tap.stop="Topping(index,item)">置顶</view>
			<view class="bg-red" @tap.stop="deleteItem(index,item)">删除</view>
		  </view>
		</view>
		<cu-custom/>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				chatRecords:[],
				chatRecords2: [
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
		created() {
			this.getChatList();
		},
		computed:{
			getMessage(){
				return this.$store.getters.msg;
			},
		},
		watch: {
		  getMessage(newValue, oldValue) {
		    // 在 getMessage 的值发生变化时执行相应的操作
			let { msg: { id, userMessageId, time, type, userinfo: { uid, username, face }, content: { text } } } = JSON.parse(newValue);
			// 查找是否存在 guardianId 等于 uid 的对象
			const existingRecordIndex = this.chatRecords.findIndex(record => record.guardianId === uid);
			if (existingRecordIndex !== -1) {
			    // 如果存在，则将该对象移到数组的第一个位置，其他对象依次往后移动
				const existingRecord = this.chatRecords[existingRecordIndex];
				// 删除原位置的对象
				this.chatRecords.splice(existingRecordIndex, 1);
				// 将该对象插入数组的第一个位置
				this.chatRecords.unshift(existingRecord);
				//修改对象未读数量和信息
				existingRecord.unreadCount += 1;
				existingRecord.message = text;
			  } else {
				  if (text.includes("img")) {
				    text = '<div style="display: flex;align-items: center;flex-wrap: wrap;">[动画表情]</div>';
				  }
			    // 如果不存在，则创建新对象并插入数组的第一个位置
				this.chatRecords.unshift({ 
					avatar: face,
					senderName: username,
					message: text,
					timestamp: time.split(' ')[1], // 提取时间部分
					unreadCount: 1,
					guardianId: uid,
					userMessageId: userMessageId,
					isSuccess: true ,// 这里没有原始数据中的字段，我假设为 true
					});
			  }
		  }
		},

		methods: {
			getChatList(){
				let opts = {
					url: 'chatMessage/getChatList?receiverUid='+this.$store.getters.guardianId,
					method: 'post',
					type :5
				};
				
				uni.showLoading({
					title: '加载中!'
				});
				request.httpRequest(opts).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {					
						const items = res.data.chatMessage.map(({ face, username, text, createTime, unreadNum, uid, userMessageId }) => {
						    return {
						        avatar: face,
						        senderName: username,
						        message: text,
						        timestamp: createTime.split(' ')[1], // 提取时间部分
						        unreadCount: unreadNum,
						        guardianId: uid,
						        userMessageId: userMessageId,
						        isSuccess: true // 这里没有原始数据中的字段，我假设为 true
						    };
						});
						this.chatRecords.push(...items);
					} else {
						console.log('error!');
					}
				});
			},
			deleteItem(index,item){
				this.chatRecords.splice(index, 1);
				let opts = {
					url: 'userMessage/updateUserListDetail',
					method: 'post',
					type :5
				};
				
				const userMessageDetail = {
					tUserMessageId: item.userMessageId,
					uid: item.guardianId,
					status: 0
				}
				
				uni.showLoading({
					title: '加载中!'
				});
				
				request.httpRequest(opts,userMessageDetail).then(res => {
					//关闭加载框
					uni.hideLoading();
					//判断返回状态码
					if (res.data.code == 200) {					
						//强制更新组件
						this.$forceUpdate()			
					} else {
						//打印错误信息
						console.log('error!');
					}
				});
			},
			Topping(index,item){
				const selectedRecord = this.chatRecords.splice(index, 1)[0];
				this.chatRecords.unshift(selectedRecord);
				let opts = {
					url: 'userMessage/updateUserListDetail',
					method: 'post',
					type :5
				};
				
				const userMessageDetail = {
					tUserMessageId: item.userMessageId,
					uid: item.guardianId,
					topSort: 1
				}
				
				uni.showLoading({
					title: '加载中!'
				});
				
				request.httpRequest(opts,userMessageDetail).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {					
						console.log(res.data);			
						this.$forceUpdate()
					} else {
						console.log('error!');
					}
				});
			},
			ListListTouch(item){
				  uni.navigateTo({
				  	url:'/pages/chat/chatroom?url='+item.avatar+'&name='+item.senderName+'&guardianId='+item.guardianId+'&userMessageId='+item.userMessageId,
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
	.bg-w{
		color: #ffffff;
	}
</style>
