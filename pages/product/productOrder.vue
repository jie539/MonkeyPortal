<template>
	<view>
		<view class="justify-center bg-white">
			<view class="cu-list menu-avatar">
				<view class="cu-item ">
					<view class="cu-avatar radius lg"
						:style="{ 'background-image': 'url(' + product.uploadFile + ')' }">
					</view>
					<view class="content">
						<view class="text-pink">
							<view class="text-cut">{{product.productName}}</view>
						</view>
						<view class="text-gray text-sm flex">
							<!-- <view class="text-cut">{{product.description}}</view> -->
							<rich-text :nodes="product.description"></rich-text>
						</view>
						<view class="text-gray text-xs flex" @click="toggleInput">
							<view class="text-cut" style="text-decoration: underline;">{{address}}</view>
						</view>
					</view>
					<view class="count">
						<!-- <view class="text-grey text-xs">22:20</view> -->
						<u-count-down font-size="22" separator-size="22" color="#aaaaaa" :timestamp="timestamp"
							:show-days="false" :show-hours="false" @end="end"></u-count-down>
						<view class="round sm">x1</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar bg-white tabbar border shop foot">
			<view class="padding-lr bg-white">
				<view class="solid-bottom padding">
					<text class="text-xl">合计：</text>
					<text class="text-price text-xxl">{{product.price}}</text>
				</view>
			</view>
			<view class="bg-orange submit" @click="cancelOrderTip">取消订单</view>
			<view class="bg-red submit" @click="payTip">付款</view>
		</view>
		<u-modal v-model="payShow" @confirm="pay" :content="content" :show-cancel-button="true"></u-modal>
		<u-modal v-model="cancelShow" @confirm="cancel" :content="content" :show-cancel-button="true"></u-modal>
		<u-modal v-model="pdfShow" @confirm="pdf" :content="content" :show-cancel-button="true"></u-modal>
		<u-modal v-model="inputShow" title="自定义地址" @confirm="verify">
			<u-field v-model="addressTemp" label="地址:" placeholder="请填写自定义地址" />
		</u-modal>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				timestamp: 1800,
				inputShow: false,
				address: this.$store.state.user.info.address,
				addressTemp: '',
				pdfShow:false,
				payShow: false,
				cancelShow: false,
				content: '',
				product:''
			}
		},
		onLoad(option){
			this.product = JSON.parse(decodeURIComponent(option.item));
		},
		methods: {
			openDocument() {
				uni.downloadFile({
					url: 'http://localhost:8085/system/detail/generate-pdf',
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								console.log('打开文档成功');
							}
						});
					}
				})
			},
			end() {
				console.log('倒计时结束');
			},
			verify() {
				this.address = this.addressTemp == "" ? this.address : this.addressTemp;
			},
			toggleInput() {
				this.inputShow = !this.inputShow;
			},
			cancelOrderTip() {
				this.cancelShow = true;
				this.content = '确定取消订单吗';
			},
			payTip() {
				this.payShow = true;
				this.content = '确定支付订单吗';
			},
			pay(){
				this.updateOder(1);
			},
			cancel() {
				this.updateOder(5);
				uni.navigateBack()
			},
			pdf(){
				this.openDocument();
			},
			updateOder(status) {
				let opts = {
					url: 'system/detail/updateOrder',
					method: 'post',
					type :5
				};
				
				let orderDetail = {
					id: this.product.id,
					address:this.address,
					status: status
				}
				
				uni.showLoading({
					title: '加载中!'
				});
				
				request.httpRequest(opts,orderDetail).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {	
						if(status == 1  ){
							uni.showToast({
								title: '成功支付',
								icon: 'success',
								duration: 1500
							})
							setTimeout(()=>{
								this.pdfShow  = true;
								this.content = '是否下载订单pdf.'
							},1500);
						}						  							
					} else {
						if(status == 2){
							uni.showToast({
								title: '成功失败',
								icon: 'error',
								duration: 1500
							}) 
						}					
					}
				});
			}
			
		}
	}
</script>

<style>
	.count{
		width: 55px;
		text-align: center;
	}
</style>