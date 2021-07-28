<template>
	<view>
		
		<!-- 搜索框组件 -->
		<view class="search-box">
			<!-- 使用自己定义的搜索框 -->
			<my-search @click="gotoSearch"></my-search>
			
		</view>
		
		<!-- 轮播图的代码片段 -->
		<!-- usw 就是 轮播图的代码片段指令 -->
		<swiper 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="3000" 
			:duration="1000"
			:circular="true"
		>
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				
				<!-- 声明式导航，:url 就是 vue 中的 :to -->
				<!-- 点击后跳转到指定的商品详情页面 -->
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					
					<img :src="item.image_src" alt="">
					
				</navigator >
				
			</swiper-item>
			
		</swiper>
		
		<!-- 分类导航区 -->
		<view class="nav-list">
			
			<!-- 传入点击事件 -->
			<view 
				class="nav-item" 
				v-for="(item, index) in navList" 
				:key="index"
				@click="navClickHandler(item)"
			>
				
				<img class="nav-img" :src="item.image_src" alt="">
				
			</view>
			
		</view>
		
		<!-- 楼层区域 -->
		<!-- 楼层的容器 -->
		<view class="floor-list">
			
			<!-- 每一个楼层的 item 项 -->
			<view 
				class="floor-item"
				v-for="(item, i) in floorList"
				:key="i"
			>
				
				<!-- 楼层的标题 -->
				<image 
					:src="item.floor_title.image_src"
					class="floor-title"
				></image>
				
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
						
					<!-- 左侧的大图片 -->
					<!-- 要使用打图的url,所以这里时 product_list【0】.url -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						
						<image 
							:src="item.product_list[0].image_src" 
							alt=""
							:style="{width: item.product_list[0].image_width + 'rpx'}"
							mode="widthFix"
						></image>
						
					</navigator>
					
					<!-- 右侧4个小图片的容器 -->
					<view class="right-img-box">
						
						<!-- 遍历小图片数组 -->
						<!-- 将图片索引为0的图片过滤掉，因为那是大图 -->
						<navigator 
							class="right-img-item" 
							v-for="(item2, i2) in item.product_list"
							:key="i2"
							v-if="i2 !== 0"
							:url="item2.url"
						>
							
							<image 
								:src="item2.image_src" alt=""
								:style="{width: item2.image_width + 'rpx'}"
								mode="widthFix"
							></image>
							
						</navigator>
						
					</view>
					
				</view>
				
			</view>
			
		</view>		
		
				
	</view>
</template>

<script>
		
	import { getSwiper } from '../../api/swiper.js'
	import { getNavList } from '../../api/category.js'
	import { getFloorList } from '../../api/floor.js'
	
	export default {
		data() {
			return {
				// 接收轮播图数据的数组
				swiperList: [],
				// 接收分类数据的数组
				navList: [],
				// 接收楼层的数据数组
				floorList: []
			};
		},
		onLoad() {
			
			console.log('haha')
			// 调用方法获取轮播图数据
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
			
		},
		methods: {
			
			// 获取轮播图数据
			async getSwiperList(){
				
				// const res = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 将 data 解构出来，然后改个名字叫 res
				const {data: res} = await getSwiper()
				// console.log(res)
				// 请求失败的情况
				if(res.meta.status !== 200){
					
					// return uni.showToast({
					// 	title: '数据请求失败',
					// 	duration: 1500,
					// 	// 指定是否需要图标
					// 	icon: 'none'
					// })
					
					// 调用封装好的弹窗
					return uni.$showMsg()
					
				}
				
				// 请求成功, 将轮播图数据保存在本地变量
				this.swiperList = res.message
					
			},
			
			// 获取分类数据
			async getNavList(){
				
				const {data: res}  = await getNavList()
				
				// console.log(res)
				if(res.meta.status !== 200){
					
					return uni.$showMsg()
					
				}
				
				// 将对象添加到数组中
				this.navList = res.message	
				
			},
			// 如果点击的时分类，则跳转到 导航栏分类页面上
			// 使用 switchTab 只能使用这个
			navClickHandler(item){
				
				if(item.name === '分类'){
					
					uni.switchTab({
						url: '/pages/cate/cate'
					})
					
				}
				
			},
			// 获取首页楼层数据
			async getFloorList(){
				
				const {data: res} = await getFloorList() 
				
				console.log(res)
				
				if(res.meta.status !== 200) return uni.$showMsg()
				
				// 遍历数据, 遍历 message数组
				res.message.forEach(floor => {
					
					// 遍历message数组中的 product_list 数组
					// 给该数组对象添加属性 url 然后将新的地址赋值给
					// 这个url属性
					floor.product_list.forEach(prod => {
						
						// 拼接字符串，将navigator_url: "/pages/goods_list?query=服饰" 的query参数获取到
						// 和现在的路径进行拼接
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
						
					})
					
				})
				
				this.floorList = res.message
				
			},
			
			gotoSearch(){
				
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
				
			}
			
		}
	}
	
</script>

<style lang="scss">

swiper{
	
	height: 330rpx;
	
	.swiper-item,
	image{
		width: 100%;
		height: 100%;
		
	}
	
}

// 容器样式
.nav-list{
	
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
	// 图片样式
	.nav-img{
		
		width: 128rpx;
		height: 140rpx;
		
	}
	
}

// 楼层的标题样式
.floor-title{
	
	width: 100%;
	height: 60rpx;
	
}

// 左侧图片样式
.floor-img-box {
   display: flex;
   padding-left: 10rpx;
}

// 右侧四个小图片的容器
.right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

// 搜索框样式
.search-box{
	
	position: sticky;
	top: 0;
	z-index: 999;
	
}

</style>
