<template>
	<!-- 商品详情页 -->
	<view class="goods-detail-container">
		
		<!-- 轮播图区域 -->
		<swiper 
			:indicator-dots="true" 
			:autoplay="true" 
			:interval="3000" 
			:duration="1000"
			:circular="true"
		>	
			<!-- 遍历轮播图，并且显示 -->
			<swiper-item
				v-for="(item, i) in goods_info.pics"
				:key="i"
			>
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
			
		</swiper>
		
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price || ''}}</view>
			
			<!-- 商品信息主体区域 -->
			<view class="goods-info-body">
				
				<!-- 商品名字 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
					
				</view>
				
			</view>
			
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
			
		</view>
		
		<!-- 富文本解析器，专门解析 html 代码中的东西 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航组件区域 -->
		<view class="goods_nav">
			
			<!-- 使用这个商品按钮组 -->
			<uni-goods-nav 
				:fill="true" 
				:options="options" 
				:buttonGroup="buttonGroup"
				@click="onClick"
				@buttonClick="buttonClick"
			></uni-goods-nav>
			
		</view>
		
	</view>
</template>

<script>
		
	import { getGoodsDetail } from '../../api/goodsDetail.js'
	import { mapState, mapMutations, mapGetters } from 'vuex'
	
	export default {
		data() {
			return {
				goods_info: {},
				options: [
					{
					
						icon: 'shop',
						text: '商铺',
						infoBackgroundColor: '#007aff',
						infoColor: 'red'
					
					},
					// info 就是购物车要显示的商品数量
					{
						icon: 'cart',
						text: '购物车',
						info: 0
						
					}
				],
				buttonGroup: [
					
					{
							
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
						
					},
					{
							
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
						
					}
					
				]
				
			}
		},
		// 监听最新的total商品总数,然后缓存
		computed:{
			
			...mapState('m_cart', ''),
			...mapGetters('m_cart', ['total'])
			
		},
		watch: {
		   // 对 getters 中的商品总数进行监听
		   // 然后将 vuex 中的 最新的 total 总数
		   // 赋值给 购物车的 info 属性
		   // 定义 total 侦听器，指向一个配置对象
		   total: {
		      // handler 属性用来定义侦听器的 function 处理函数
		      handler(newVal) {
				  // 获取购物车按钮的配置对象
		         const findResult = this.options.find(x => x.text === '购物车')
		         // 如果存在购物车按钮就将新值给更新
				 if (findResult) {
		            findResult.info = newVal
		         }
		      },
		      // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
		      immediate: true
		   }
		},
		onLoad(options){
			
			console.log(options)
			// 从options中获取goods_id
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
			
		},
		methods: {
			// 解构出 vuex 中的 m_cart 模块下的 
			// addToCart 方法，用来添加商品 到 vuex 中的 state中保存
			...mapMutations('m_cart', ['addToCart']),
			async getGoodsDetail(goods_id){
				
				const {data: res} = await getGoodsDetail({goods_id:goods_id})
				 
				// console.log(res)
				
				if(res.meta.status !== 200) return uni.$showMsg()
				
				// 将goods_introduce 这个标签中的 img标签 替换成我们提供的img标签
				// 然后将img里面的图片的webp格式替换成 jpg的格式
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g, '<img style="display:block;"').replace(/webp/g, 'jpg')
				
				this.goods_info = res.message
				
			},
			// 这是点击生成图片预览
			preview(i){
				
				uni.previewImage({
					current: i,
					// 将大图保存下来
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
				
			},
			onClick(e){
				
				if(e.content.text === '购物车'){
					
					// 跳转到导航页的购物车，这里要用到 switchTab
					uni.switchTab({
						url: '/pages/cart/cart'
					})
					
				}
				
			},
			buttonClick(e){
				
				if(e.content.text === '加入购物车'){
					
					// 组织商品的信息对象
					// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
					const goods = {
						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_small_logo: this.goods_info.goods_small_logo,
						goods_state: false
					}
		                 
					// 调用 addToCart 方法
				    this.addToCart(goods)
					
				}
				
			}
			
		}
		
	}
</script>

<style lang="scss">

// 这是轮播图容器样式
swiper{
	
	height: 750rpx;
	// 图片宽高和父标签一样
	image{
		
		width: 100%;
		height: 100%;
		
	}
	
}

// 商品信息容器样式
.goods-info-box{
	
	padding: 10px;
	padding-right: 0;
	
	// 商品价格样式
	.price{
		
		color: #C00000;
		font-size: 18px;
		margin: 10px 0;
		
	}
	
	// 商品信息主体样式
	.goods-info-body{
		
		display: flex;
		justify-content: space-between;
		
		.goods-name{
			
			font-size: 13px;
			margin-right: 10px;
			
		}
		
		.favi{
			
			width: 120px;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-left: 1px solid #efefef;
			color: gray;
			
			
		}
		
	}
	
	.yf{
		
		font-size: 12px;
		color: gray;
		margin: 10px 0;
		
	}
	
}


.goods_nav{
	
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	
}

.goods-detail-container{
	
	padding-bottom: 50px;
	
}

</style>
