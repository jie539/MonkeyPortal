<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">用户列表</block>
		</cu-custom>
		<view class="page-main">
		    <liu-indexed-list :dataList="dataList" @click="click" @search="handleSearch"></liu-indexed-list>
		</view>
		<cu-custom/>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				dataList: [{
					id: '1',
					name: '刘**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png'
				}, {
					id: '2',
					name: '税**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg'
				}, {
					id: '3',
					name: '柴**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg'
				}, {
					id: '4',
					name: '王**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg'
				}, {
					id: '5',
					name: '马**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2023/03/07/12/45/child-7835677_1280.jpg'
				}, {
					id: '6',
					name: '韩**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2022/11/29/19/05/boho-7625140_1280.jpg'
				}, {
					id: '7',
					name: '张**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg'
				}, {
					id: '8',
					name: '王**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg'
				}, {
					id: '9',
					name: '张**',
					phone: '18198045576',
					img: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg'
				}, {
					id: '10',
					name: '李**',
					phone: '181****5576',
					img: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png'
				}]				            
			}
		},
		methods: {
			//点击列表回调事件
			click(e) {
				console.log('点击列表回调：', e)
				if(e.id !== this.$store.getters.guardianId){
					let opts = {
						url: 'userMessage/add',
						method: 'post',
						type :5
					};
					
					let userMessage = {
						userId1: this.$store.getters.guardianId,
						userId2: e.id
					}; 
					
					uni.showLoading({
						title: '加载中!'
					});
					
					request.httpRequest(opts,userMessage).then(res => {
						uni.hideLoading();
						if (res.data.code == 200) {					
							console.log(res.data.data);
							uni.navigateTo({
								url:'/pages/chat/chatroom?url='+e.img+'&name='+e.name+'&guardianId='+e.id+'&userMessageId='+res.data.data.id,
							})
						} else {
							console.log('error!');
						}

					});  
				}			
			},
			//搜索聊天对象
			handleSearch(searchStr) {
			  console.log('Search string:', searchStr);
			  if(searchStr){
				let opts = {
					url: 'userMessage/getUserList?fuzzyConditions='+searchStr,
					method: 'post',
					type :5
				};
				
				uni.showLoading({
					title: '加载中!'
				});
				
				request.httpRequest(opts).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {					
						console.log(res.data.data);
						//this.dataList = this.dataList.concat(res.data.data);
						this.dataList = res.data.data;
					} else {
						console.log('error!');
					}
				});  
			  }
			}
		},
		created() {
			//插入伪造数据
			const generatedData = [];
			for (let i = 0; i < 50; i++) {
			    const randomIndex = Math.floor(Math.random() * this.dataList.length);
			    const randomItem = this.dataList[randomIndex];
			    
			    // 创建新的数据对象，修改id，确保每条数据唯一
			    const newData = { ...randomItem, id: (this.dataList.length + i + 1).toString() };
			    
			    generatedData.push(newData);
			}
			
			// 将生成的数据插入到原本的 dataList 中
			 this.dataList = this.dataList.concat(generatedData);
		}	
	}
</script>

<style lang="scss" scoped>
	.bottom{
		margin-bottom: 100upx;
	}
</style>
