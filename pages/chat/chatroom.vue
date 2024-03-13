<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" :class="popupLayerClass" scroll-y="true"
				:scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView"
				@scrolltoupper="loadHistory" upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="isHistoryLoading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
					<!-- 系统消息 -->
					<block v-if="row.type=='system'">
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.msg.type=='text' && row.msg.userinfo.uid==senderUid" class="text">
							    {{ '你' + row.msg.content.text }}
							</view>
							<view v-else-if="row.msg.type=='text'" class="text">
							    {{ '对方' + row.msg.content.text }}
							</view>


							<!-- 领取红包消息 -->
							<view v-if="row.msg.type=='redEnvelope'" class="red-envelope">
								<image src="/static/chat/red-envelope-chat.png"></image>
								{{row.msg.content.text}}
							</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<block v-if="row.type=='user'">
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.msg.userinfo.uid==senderUid">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble" @contextmenu.prevent="rightClickHandler">
									<uv-tooltip
										:buttons="button"
										@click="bubbleEvent"
										:showCopy="true"
										:isSlot="true"
										:id="row.msg.id"
										:copyText="extractText(row.msg.content.text)"
									>
									<!-- <rich-text :nodes="row.msg.content.text"></rich-text> -->
									<rich-text :nodes="row.msg.content.text"></rich-text>
									</uv-tooltip>
									<!-- <view v-html="testMsg"></view> -->
								</view>
								<!-- 语言消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
									:class="playMsgid == row.msg.id?'play':''">
									<view class="length">{{row.msg.content.length}}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url"
										:style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}">
									</image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope"
									@tap="openRedEnvelope(row.msg,index)">
									<image src="/static/chat/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>

							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.msg.userinfo.face"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.uid!=senderUid">
							<!-- 左-头像 -->
							<view class="left">
								<image :src="row.msg.userinfo.face"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{row.msg.userinfo.username}}</view>
									<view class="time">{{row.msg.time}}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble">								
									<rich-text :nodes="row.msg.content.text"></rich-text>
								</view>
								<!-- 语音消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
									:class="playMsgid == row.msg.id?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{row.msg.content.length}}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url"
										:style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}">
									</image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope"
									@tap="openRedEnvelope(row.msg,index)">
									<image src="/static/chat/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<!-- https://zhoukaiwen.com/img/icon/emojj1/1.png -->
						<image mode="widthFix" :src="'https://zhoukaiwen.com/img/icon/emojj1/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon tupian2"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
					<view class="box" @tap="handRedEnvelopes">
						<view class="icon hongbao"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box cu-bar tabbar" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
					@touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
					@touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image src="https://zhoukaiwen.com/img/qdpz/face/face_1.jpg"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	import timeFormat from '@/common/timeFormat.js';
	import request from '@/common/request.js';
	import { onlineEmoji, emojiList } from '@/tn_components/chat/emojiData/emojiData.js';
	import { stdout } from 'process';
	import { SourceTextModule } from 'vm';
import { data } from 'uview-ui/libs/mixin/mixin';
	export default {
		data() {
			return {
				userMessageId:0,
				logNum:0,
				text:'删除',
				button:['撤回'],
				testMsg:`<div><uv-tooltix :buttons="button" @click="bubbleEvent" :showCopy="true" :isSlot="true" :id="row.msg.id"><rich-text nodes="123">123</rich-text></uv-tooltip></div>`,
				testMsg2:`<div style="text-align:center;background-color: #007AFF;"><div >我是内容</div><img src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png"/></div>`,					
				//文字消息
				textMsg: '',
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: '',
				msgList: [],
				msgList2: [],
				msgImgList: [],
				senderUid: this.$store.getters.guardianId,
				senderFace:'https://zhoukaiwen.com/img/kevinLogo.png',
				senderName:this.$store.getters.guardianName,
				receiverUid:456,
				receiverFace:'',
				receiverName:'',
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER: uni.getRecorderManager(),
				// #endif
				isVoice: false,
				voiceTis: '按住 说话',
				recordTis: "手指上滑 取消发送",
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: null,
				recordLength: 0,

				//播放语音相关参数
				AUDIO: uni.createInnerAudioContext(),
				playMsgid: null,
				VoiceTimer: null,
				// 抽屉参数
				popupLayerClass: '',
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				emojiList: emojiList,
				//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
				onlineEmoji: onlineEmoji,
				//红包相关参数
				windowsState: '',
				redenvelopeData: {
					rid: null, //红包ID
					from: null,
					face: null,
					blessing: null,
					money: null
				}
			};
		},
		onUnload(){
			//取消监控
			if(this.watcher){
				this.watcher();
			}
			console.log('取消监控');
			this.$store.dispatch('exitChat', { receiverUid: this.receiverUid, senderUid: this.senderUid });
		},
		onLoad(option) {
			this.receiverUid = parseInt(option.guardianId);
			this.receiverFace = option.url;
			this.receiverName = option.name;
			this.userMessageId = option.userMessageId;
			this.getMsgList();
				
			//创建消息监控	
			this.createWatch();
	
			//语音自然播放结束
			this.AUDIO.onEnded((res) => {
				this.playMsgid = null;
			});
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e) => {
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e) => {
				this.recordEnd(e);
			})
			// #endif
			uni.setNavigationBarTitle({
				title:option.name,				
			})
		},
		onBackPress(options) {
			console.log('返回');
			//this.disconnectWebSocket();
		},
		onShow() {
			this.scrollTop = 9999999;

			//模板借由本地缓存实现发红包效果，实际应用中请不要使用此方法。
			//
			uni.getStorage({
				key: 'redEnvelopeData',
				success: (res) => {
					console.log(res.data);
					let nowDate = new Date();
					let lastid = this.msgList[this.msgList.length - 1].msg.id;
					lastid++;
					let row = {
						type: "user",
						msg: {
							id: lastid,
							type: "redEnvelope",
							time: nowDate.getHours() + ":" + nowDate.getMinutes(),
							userinfo: {
								uid: 123,
								username: "大黑哥",
								face: "https://zhoukaiwen.com/img/kevinLogo.png"
							},
							content: {
								blessing: res.data.blessing,
								rid: Math.floor(Math.random() * 1000 + 1),
								isReceived: false
							}
						}
					};
					this.screenMsg(row);
					uni.removeStorage({
						key: 'redEnvelopeData'
					});
				}
			});
		},
		methods: {
			extractText(html) {
			  // 使用正则表达式提取 HTML 中的纯文本
			  return html.replace(/<[^>]+>/g, '');
			},
			createWatch(){
				console.log(this.watcher);
				if(!this.watcher){
					this.watcher =this.$store.watch(
					  (state) => state.websocket.msg,
					  (msg) => {
					    console.log('state.websocket.msg发生变化:');
						if(msg != null){
							this.screenMsg(JSON.parse(msg))
						}				
					  },
					);
				}
				console.log(this.watcher);
				this.$store.dispatch('joinChat', { receiverUid: this.receiverUid, senderUid: this.senderUid });
			},
			rightClickHandler(event) {
			    event.preventDefault(); // 阻止默认的右键事件
			},
			bubbleEvent(e,msgId){
				const index = this.msgList.findIndex(message => message.msg.id === msgId);
				const desiredMessage = this.msgList[index];
				const {id,time} = desiredMessage.msg;
				// 将时间字符串转换为时间戳
				const messageTime = new Date(time).getTime();
				// 获取当前时间戳
				const currentTime = Date.now();
				
				// 计算时间差（单位：毫秒）
				const timeDiff = currentTime - messageTime;
				// 定义时间阈值（两分钟）
				const timeThreshold = 2 * 60 * 1000;
				
				// 判断时间差是否超过时间阈值
				if (timeDiff > timeThreshold) {
					uni.showToast({
					title: '超过两分钟不能撤回',
					icon:'none',
					duration: 2000
					});
				} else {
				    const newMessage = {
				    	type: "system",
				    	msg: {
				    		id: id,
				    		type: "text",
							userinfo:{
								uid:this.senderUid
							},
				    		content:{
				    			text:"撤回了一条消息"
				    		}
				    	}
				    };	
				    // 将找到的对象替换为新对象
				    this.$set(this.msgList, index, newMessage);
					this.send(newMessage);
					// let opts = {
					// 	url: 'chatMessage/edit',
					// 	method: 'post',
					// 	type :5
					// };
					
					// const chatMessage = {
					// 	id: id,
					// 	type: "system",
					// 	newText: "撤回了一条消息"
					// }
					
					// uni.showLoading({
					// 	title: '加载中!'
					// });
					
					// request.httpRequest(opts,chatMessage).then(res => {
					// 	uni.hideLoading();
					// 	if (res.data.code == 200) {					
							
					// 	} else {
					// 		console.log('error!');
					// 	}
					// });
				}							
			},
			// 接受消息(筛选处理)
			screenMsg(msg) {
				//从长连接处转发给这个方法，进行筛选处理
				if (msg.type == 'system') {
					// 系统消息
					switch (msg.msg.type) {
						case 'text':
							this.addSystemTextMsg(msg);
							break;
						case 'redEnvelope':
							this.addSystemRedEnvelopeMsg(msg);
							break;
					}
				} else if (msg.type == 'user') {
					// 用户消息
					switch (msg.msg.type) {
						case 'text':
							this.addTextMsg(msg);
							break;
						case 'voice':
							this.addVoiceMsg(msg);
							break;
						case 'img':
							this.addImgMsg(msg);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(msg);
							break;
					}
					//非自己的消息震动
					if (msg.msg.userinfo.uid != this.senderUid) {
						console.log('振动');
						uni.vibrateLong();
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg' + msg.msg.id
				});
			},

			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e) {
				console.log('触顶');	
				if (this.isHistoryLoading) {
					return;
				}
				this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false; //关闭滑动动画
				let Viewid = this.msgList[0].msg.id; //记住第一个信息ID
				//本地模拟请求历史记录效果
				setTimeout(() => {
					// 消息列表
					let list = [{
							type: "user",
							msg: {
								id: 1,
								type: "text",
								time: "12:56",
								userinfo: {
									uid: 123,
									username: "大黑哥",
									face: "https://zhoukaiwen.com/img/kevinLogo.png"
								},
								content: {
									text: "web前端开发该怎么学习？"
								}
							}
						},
						{
							type: "user",
							msg: {
								id: 2,
								type: "text",
								time: "12:57",
								userinfo: {
									uid: 1,
									username: "售后客服008",
									face: "https://zhoukaiwen.com/img/qdpz/face/face_2.jpg"
								},
								content: {
									text: "按照基本路线，从html、css、js三大基础开始，然后ajax、vue进阶学习，最后学习小程序、node、react。"
								}
							}
						},
						{
							type: "user",
							msg: {
								id: 3,
								type: "voice",
								time: "12:59",
								userinfo: {
									uid: 1,
									username: "售后客服008",
									face: "https://zhoukaiwen.com/img/qdpz/face/face_2.jpg"
								},
								content: {
									url: "/static/voice/1.mp3",
									length: "00:06"
								}
							}
						},
						{
							type: "user",
							msg: {
								id: 4,
								type: "voice",
								time: "13:05",
								userinfo: {
									uid: 123,
									username: "大黑哥",
									face: "https://zhoukaiwen.com/img/kevinLogo.png"
								},
								content: {
									url: "/static/voice/2.mp3",
									length: "00:06"
								}
							}
						},
					]
					// 获取消息中的图片,并处理显示尺寸
					for (let i = 0; i < list.length; i++) {
						if (list[i].type == 'user' && list[i].msg.type == "img") {
							list[i].msg.content = this.setPicSize(list[i].msg.content);
							this.msgImgList.unshift(list[i].msg.content.url);
						}
						list[i].msg.id = Math.floor(Math.random() * 1000 + 1);
						this.msgList.unshift(list[i]);
					}

					//这段代码很重要，不然每次加载历史数据都会跳到顶部
					this.$nextTick(function() {
						this.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
						this.$nextTick(function() {
							this.scrollAnimation = true; //恢复滚动动画
						});

					});
					this.isHistoryLoading = false;

				}, 1000)
			},
			// 加载初始页面消息
			getMsgList() {
				// 消息列表
				
				let list=[]
				let opts = {
					url: 'chatMessage/getChatHistory',
					method: 'post',
					type :5
				};
				
				let userIds = {
					userId1: this.senderUid,
					userId2: this.receiverUid
				}
				
				uni.showLoading({
					title: '加载中!'
				});
				request.httpRequest(opts,userIds).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {					
						list = res.data.chatMessage.userMessages
						if(list){
							// 获取消息中的图片,并处理显示尺寸
							for (let i = 0; i < list.length; i++) {
								if (list[i].type == 'user' && list[i].msg.type == "img") {
									list[i].msg.content = this.setPicSize(list[i].msg.content);
									this.msgImgList.push(list[i].msg.content.url);
								}
							}
							this.msgList = list;
						}
						
						// 滚动到底部
						this.$nextTick(function() {
							//进入页面滚动到底部
							this.scrollTop = 9999;
							this.$nextTick(function() {
								this.scrollAnimation = true;
								this.isHistoryLoading = false;
							});
						
						});
					} else {
						console.log('error!');
					}
				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},

			//更多功能(点击+弹出) 
			showMore() {
				this.isVoice = false;
				this.hideEmoji = true;
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer() {
				this.popupLayerClass = '';
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
				}, 150);
			},
			// 选择图片发送
			chooseImage() {
				this.getImage('album');
			},
			//拍照发送
			camera() {
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes() {
				uni.navigateTo({
					url: 'hand/hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type) {
				console.log("本地图片");
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image) => {
									console.log(image.width);
									console.log(image.height);
									let msg = {
										url: res.tempFilePaths[i],
										w: image.width,
										h: image.height
									};
									// 发送图片信息和图片文件到服务器
									//this.uploadImageToServer(msg);
									// uni.uploadFile({
									// 	url: 'https://appportal.monkeytree.com.hk/upload/image', //仅为示例，非真实的接口地址
									// 	filePath: res.tempFilePaths[i],
									// 	name: 'file',
									// 	formData: {
									// 		'user': 'test'
									// 	},
									// 	success: (uploadFileRes) => {
									// 		console.log(uploadFileRes.data);
									// 	}
									// });
									// 发送图片信息和图片文件到服务器
									// uploadImageRequest({
									//     type: 5, // 根据需要设置请求类型
									//     url: 'upload/image' // 上传图片的接口路径，不需要baseUrl
									// }, {
									//     file: res.tempFilePaths[i], // 将图片路径作为文件参数
									//     user: 'test' // 其他表单数据
									// }).then((uploadFileRes) => {
									//     console.log(uploadFileRes); // 上传成功后的处理
									// }).catch((error) => {
									//     console.error(error); // 发生错误时的处理
									// });
									
									let opts = {
										url: 'commmon/upload',
										method: 'post',
										type :5
									};
									
									let formData = new FormData();
									formData.append('file', res.tempFilePaths[i]); // 添加文件数据到FormData对象
									formData.append('user', 'test'); // 添加其他表单数据到FormData对象
					
									uni.showLoading({
										title: '加载中!'
									});
									request.uploadImageRequest(opts,formData).then(res => {
										uni.hideLoading();
										if (res.data.code == 200) {	
										} else {
											console.log('error!');
										}
									}).catch(error => {
										uni.hideLoading();
										console.error(error); // 发生错误时的处理
									});
									

									this.sendMsg(msg, 'img');
								}
							});
						}
					}
				});
			},
			// 将图片信息和图片文件一起上传到服务器
			uploadImageToServer(msg) {
			  let formData = new FormData();
			  formData.append('imageFile', msg.url);
			  formData.append('width', msg.w);
			  formData.append('height', msg.h);
			
			  // 将FormData对象转换为普通的对象
			  let data = {};
			  formData.forEach((value, key) => {
			    data[key] = value;
			  });
			  
			  // 发起网络请求
			  uni.request({
			    url: 'https://appbackend.monkeytree.com.hk/upload/image',
			    method: 'POST',
			    data: data, // 传递转换后的普通对象给data参数
			    header: {
			      'content-type': 'multipart/form-data'
			    },
			    success: res => {
			      console.log('上传成功', res);
			    },
			    fail: err => {
			      console.error('上传失败', err);
			    }
			  });
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.alt;
			},

			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus() {
				if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
					this.hideDrawer();
				}
			},
			// disconnectWebSocket() {
			// 	const ws = this.$store.state.websocket.ws;
			// 	  if (ws) {
			// 	  } else {
			// 		console.error('WebSocket 连接尚未建立');
			// 	  }
			// },
			send(msg){
				const ws = this.$store.state.websocket.ws;
			  if (ws) {
				  var messageObject = {
				          action: 'sendMessageToUser',
				          userId: this.receiverUid,
				          message: msg
				  };
				ws.send(JSON.stringify(messageObject));
				console.log('send');
			  } else {
				console.error('WebSocket 连接尚未建立');
			  }
			},
			// 发送文字消息
			sendText() {
				this.hideDrawer(); //隐藏抽屉
				if (!this.textMsg) {
					return;
				}
				let content = this.replaceEmoji(this.textMsg);
				let msg = {
					text: content
				}
				this.sendMsg(msg, 'text');
				this.textMsg = ''; //清空输入框
			},
			//替换表情符号为图片
			replaceEmoji(str) {
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					
					console.log("str: " + str);
					console.log("index: " + index);
					console.log("item: " + item);
					
					for (let i = 0; i < this.emojiList.length; i++) {
						let row = this.emojiList[i];
						for (let j = 0; j < row.length; j++) {
							let EM = row[j];
							if (EM.alt == item) {
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = 'https://zhoukaiwen.com/img/icon/emojj1/'
								let imgstr = '<img width="32rpx" src="' + onlinePath + this.onlineEmoji[EM.url] +
									'">';
								console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				return '<div style="display: flex;align-items: center;flex-wrap: wrap;">' + replacedStr + '</div>';
			},

			// 发送消息
			sendMsg(content, type) {
				console.log(content);
				//实际应用中，此处应该提交长连接，模板仅做本地处理。
				var nowDate = new Date();
				let lastid = this.msgList.length > 0 ? this.msgList[this.msgList.length - 1].msg.id : 1;
				lastid++;
				let msg = {
					type: 'user',
					msg: {
						id: lastid,
						userMessageId:this.userMessageId,
						time: timeFormat( nowDate, 'YYYY-MM-DD HH:mm:ss'),
						type: type,
						userinfo: {
							uid: this.senderUid,
							username: this.senderName,
							face: this.senderFace
						},
						content: content
					}
				}
				
				// 发送消息
				this.screenMsg(msg);
				this.send(msg)
			},

			// 添加文字消息到列表
			addTextMsg(msg) {				
				this.msgList.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg) {
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgImgList.push(msg.msg.content.url);
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg, index) {
				let rid = msg.content.rid;
				uni.showLoading({
					title: '加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(() => {
					//加载数据
					if (rid == 0) {
						this.redenvelopeData = {
							rid: 0, //红包ID
							from: "大黑哥",
							face: "https://zhoukaiwen.com/img/qdpz/face/face.jpg",
							blessing: "恭喜发财，大吉大利",
							money: "已领完"
						}
					} else {
						this.redenvelopeData = {
							rid: 1, //红包ID
							from: "售后客服008",
							face: "https://zhoukaiwen.com/img/qdpz/face/face_2.jpg",
							blessing: "恭喜发财",
							money: "0.01"
						}
						if (!msg.content.isReceived) {
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({
								text: "你领取了" + (msg.userinfo.uid == this.senderUid ? "自己" : msg.userinfo
									.username) + "的红包"
							}, 'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';

				}, 200)

			},
			// 关闭红包弹窗
			closeRedEnvelope() {
				this.windowsState = 'hide';
				setTimeout(() => {
					this.windowsState = '';
				}, 200)
			},
			sendSystemMsg(content, type) {
				let lastid = this.msgList[this.msgList.length - 1].msg.id;
				lastid++;
				let row = {
					type: "system",
					msg: {
						id: lastid,
						type: type,
						content: content
					}
				};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid) {
				uni.navigateTo({
					url: 'details/details?rid=' + rid
				})
			},
			// 预览图片
			showPic(msg) {
				uni.previewImage({
					indicator: "none",
					current: msg.content.url,
					urls: this.msgImgList
				});
			},
			// 播放语音
			playVoice(msg) {
				this.playMsgid = msg.id;
				this.AUDIO.src = msg.content.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 录音开始
			voiceBegin(e) {
				if (e.touches.length > 1) {
					return;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({
					format: "mp3"
				}); //录音开始,
			},
			//录音开始UI效果
			recordBegin(e) {
				this.recording = true;
				this.voiceTis = '松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(() => {
					this.recordLength++;
				}, 1000)
			},
			// 录音被打断
			voiceCancel() {
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true; //不发送录音
				this.RECORDER.stop(); //录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e) {
				if (!this.recording) {
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				} else {
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e) {
				if (!this.recording) {
					return;
				}
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop(); //录音结束
			},
			//录音结束(回调文件)
			recordEnd(e) {
				clearInterval(this.recordTimer);
				if (!this.willStop) {
					console.log("e: " + JSON.stringify(e));
					let msg = {
						length: 0,
						url: e.tempFilePath
					}
					let min = parseInt(this.recordLength / 60);
					let sec = this.recordLength % 60;
					min = min < 10 ? '0' + min : min;
					sec = sec < 10 ? '0' + sec : sec;
					msg.length = min + ':' + sec;
					this.sendMsg(msg, 'voice');
				} else {
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice() {
				this.hideDrawer();
				this.isVoice = this.isVoice ? false : true;
			},
			discard() {
				return;
			}
		}
	}
</script>
<style lang="scss">
	@import "css/style.scss";

	.content .showLayer {
		transform: translate3d(0, -43vw, 0);
	}
</style>
