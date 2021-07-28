<template>
	<view class="cart-container" v-if="cart.length !== 0">
	
		<!-- 收获地址组件 -->
		
		<!-- 商品列表的标题区域 -->
		<view class="cart-title">
			
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
				
		</view>
		
		<!-- 循环渲染购物车中的商品信息 -->
		<uni-swipe-action>
			
			<block v-for="(goods, i) in cart" :key="i">
				
				<!-- 这个组件可以让列表左滑动删除 
					options 就是通过滑动左侧，展示的按钮
				-->
				<uni-swipe-action-item
					:options="options"
					@click="swipeItemClickHandler(goods)"
				>
					<my-goods
						:goods="goods"
						:show-radio="true"
						:show-num="true"
						@radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"
					></my-goods>
					
				</uni-swipe-action-item>
				
			</block>
			
		</uni-swipe-action>
		
		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	
	</view>
	
	<!-- 空白购物车的区域 -->
	<view class="empty-cart" v-else>
		
		<image src="/static/cart_empty@2x.png"
			class="empty-img"
		></image>
		
		<text class="tip-text">空空如也</text>
		
	</view>
	
</template>

<script>
		
	import { 
		mapState, 
		mapGetters, 
		mapMutations 
	} from 'vuex'
	
	export default {
		computed:{
			// 获取购物车的商品总数
			...mapGetters('m_cart', ['total']),
			// 获取购物车的商品列表
			...mapState('m_cart', ['cart'])
		},
		onShow() {
			
			this.setBadge()
			
		},
		data() {
			return {
				
				options: [
					
					{
						
						text: '删除',
						style: {
							
							backgroundColor: '#c00000'
							
						}
						
					}
					
				]
				
			};
		},
		methods: {
			...mapMutations('m_cart', [
				'updateGoodsState', 
				'updateGoodsCount', 
				'removeGoodsById',
			]),
			// 设置导航栏索引为2的购物车text 为 total
			setBadge(){
				
				// 当有商品列表的时候才显示
				if(this.total){
					
					uni.setTabBarBadge({
						index: 2,
						text: this.total + ''
					})
					
				}
				
			},
			// 点击单选框选中和取消事件
			radioChangeHandler(e){
				
				console.log(e)
				this.updateGoodsState(e)
				
			},
			// 点击事件后对商品总数进行修改
			numberChangeHandler(e){
				
				this.updateGoodsCount(e)
				
			},
			// 左滑动删除商品事件
			swipeItemClickHandler(goods) {
				
				var that = this
				
				// 这是删除商品的一个提示框
				uni.showModal({
				    content: '是否删除该商品',
					// confirmText: '确定',
					// cancelText: '取消',
				    success: function (res) {
				        if (res.confirm) {
				            
							// console.log('用户点击确定');
							that.removeGoodsById(goods.goods_id)
							
							// 提示信息
							uni.showToast({
							    title: '商品删除成功',
							    duration: 1500
							});
							
						} else if (res.cancel) {
				            
							// console.log('用户点击取消');
							return 
						
						}
				    }
				});
				
				// this.removeGoodsById(goods.goods_id)
			}
			
		}
	}
</script>

<style lang="scss">

.cart-container{
	
	padding-bottom: 50px;
	
}

.cart-title{
	
	display: flex;
	align-items: center;
	padding-left: 5px;
	height: 40px;
	border-bottom: 1px solid #EFEFEF;
	
	.cart-title-text{
		
		font-size: 14px;
		margin-left: 10px;
		
	}
}

// 购物车空为空时容器样式
.empty-cart{
	
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
	
	// 图片的样式
	.empty-img{
		
		width: 90px;
		height: 90px;
		
	}
	
	// 显示的文字样式
	.tip-text{
		
		font-size: 12px;
		color: gray;
		margin-top: 15px;
		
	}
	
}

</style>
