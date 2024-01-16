<template>
	<view>
		<view class="cu-form-group margin-top">
				<view class="title">id</view>
				<input placeholder="输入用户id" name="input" v-model="userId"></input>
		</view>
		<button class="cu-btn round bg-red shadow" @tap="init">连接</button>
		<view class="cu-form-group margin-top">
				<view class="title">发送信息</view>
				<input placeholder="输入信息" name="input" v-model="sendMsg"></input>
		</view>
		<button class="cu-btn round bg-red shadow margin-top" @tap="send">发送</button>
		<view class="cu-form-group margin-top">
				<view class="title">接收信息</view>
				<input placeholder="等待返回信息信息" name="input" v-model="getMsg"></input>
		</view>
		<button class="cu-btn round bg-red shadow margin-top" @tap="disconnectWebSocket">断开</button>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				userId:'',
				targetUserId:'',
				ws: null,
				sendMsg:'',
				getMsg:'',
			}
		},
		methods: {
			async init(){
				let that = this;
				// 初始化 WebSocket 连接
				this.ws = new WebSocket('ws://localhost:8085/chat');
			
				// WebSocket 连接成功时的回调
				this.ws.onopen = function (event) {
					if(that.userId === '369'){
						that.targetUserId = '147'
					}else{
						that.targetUserId = '369'
					}
					console.log(that.targetUserId);	
					setTimeout(()=>{
						that.ws.send(JSON.stringify({ action: 'setUserId', userId: that.userId }));
					},1000)
					
					console.log('WebSocket 连接已打开');
					// 这里可以添加其他逻辑，例如发送欢迎消息等
				};
			
				// 接收到消息时的回调
				this.ws.onmessage = function (event) {
					console.log('收到消息:', event.data);
					that.getMsg = event.data;
					// 处理接收到的消息，可以根据需要进行操作
				};
			
				// WebSocket 连接关闭时的回调
				this.ws.onclose = function (event) {
					console.log('WebSocket 连接已关闭', event);
			
					// 如果需要自动重连，可以在这里添加重连逻辑
					// 例如，重新调用 init() 方法
			
					// 注意：在生产环境中，要注意控制重连频率，避免过于频繁的重连
				};
				this.ws.onerror = (error) => {
				  console.error('WebSocket 连接发生错误:', error);
				};
			},
			disconnectWebSocket() {
			    if (this.ws) {
			        // 关闭 WebSocket 连接
			        this.ws.close();
			        console.log('WebSocket 连接已断开');
			    } else {
			        console.log('WebSocket 连接不存在');
			    }
			},
			send(){
				//this.ws.send(this.sendMsg);
				var messageObject = {
				        action: 'sendMessageToUser',
				        userId: this.targetUserId,
				        message: this.sendMsg
				    };
				this.ws.send(JSON.stringify(messageObject));
			}
		}
	}
</script>

<style>

</style>
