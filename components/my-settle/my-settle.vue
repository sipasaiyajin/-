<template>
	
	<!-- 只有当购物车有商品时才显示这个组件 -->
	<view class="my-settle-container" v-if="total !== 0" >
		
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			
			<!-- :checked 就是用来控制是否全选的 -->
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
			
		</label>
		
		<!-- 合计 -->
		<view class="amount-box">
			
			合计：<text class="amount">￥{{checkedGoodsAmount}}元</text>
			
		</view>
		
		<!-- 结算按钮 -->
		<!-- 这里显示已经勾选的商品总数量 -->
		<view class="btn-settle">结算{{checkedCount}}</view>
		
	</view>
	
</template>

<script>
	
	import {
		
		mapGetters,
		mapMutations,
		mapState
		
	} from 'vuex'
	
	export default {
		
		data(){
			
			return {
				
				// 倒计时的秒数
				seconds: 3,
				// 定时器的 Id
				timer: null
				
			}
			
		},
		computed:{
			
			// 解构出已勾选的商品的总数
			// 商品总数
			// 已选中商品的金额总数
			...mapGetters('m_cart', [
				'checkedCount',
				'total',
				'checkedGoodsAmount'
			]),
			...mapGetters('m_cart', ['cart']),
			// 当 vuex 中 保存的商品的数量 等于 已选中的商品的数量
			// 就返回 true 否则返回 false
			isFullCheck(){
				
				return this.total === this.checkedCount

			}
			
		},
		methods:{
			
			...mapMutations('m_cart',['updateAllGoodsState']),
			// ...mapMutations('m_user', ['updateRedirectInfo']),
			
			changeAllState(){
					
				// 将全选按钮的状态传给方法
				this.updateAllGoodsState(!this.isFullCheck)
				
			}
			
		}
		
	}
	
</script>

<style lang="scss">
	
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;

		.radio {
		  display: flex;
		  align-items: center;
		}

		.amount-box {
		  .amount {
			color: #C00000;
			font-weight: bold;
		}
    }

    .btn-settle {
		
      background-color: #C00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
	
  }
	
</style>
