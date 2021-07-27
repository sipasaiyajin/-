<template>
	<!-- 商品列表页 -->
	<view>
		
		<view class="goods-list">
			
			<view v-for="(goods, i) in goodsList"
				:key="i"
				@click="gotoDetail(goods)"
			>
				<my-goods :goods="goods"></my-goods>
			
			</view>
			
		</view>
		
	</view>
</template>

<script>
	
	import {getGoodsList} from '../../api/goodsList.js'

	export default {
		data() {
			return {
				// 定义请求参数对象
				queryObj: {
					
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
					
				},
				// 接收商品列表的数组
				goodsList: [],
				// 商品总数
				total: 0,
				// 节流阀
				isloading: false
			};
		},
		onLoad(options){
			
			// console.log(options)
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
			
		},
		methods: {
			
			// 获取商品列表数据的方法
			// 传入一个回调函数
			async getGoodsList(cb){
				
				// 打开节流阀
				this.isloading = true 
				// 将参数对象传入，然后请求数据
				const {data:res} = await getGoodsList(this.queryObj)
				
				// 判断如果有传入回调函数就执行回调函数
				cb && cb()
				
				// console.log(res)
				if(res.meta.status !== 200)	return uni.$showMsg()
				
				// 将原有的商品列表和加载的商品列表进行合并
				this.goodsList = [...this.goodsList, ...res.message.goods]
				
				this.total = res.message.total
				
				
			},
			// 跳转到商品详情页
			gotoDetail(goods){
				
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
				
			},
			// 当滚动条触底的时候就去请求最新的数据
			// 这也是声明周期函数
			onReachBottom(){
				
				console.log('haha')
				
				// 如果数据页面 * 每页条数 大于 数据总量 说明说明数据加载完了
				if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
				 
				if(this.isloading) return
				
				// 让页码自增1
				this.queryObj.pagenum++
				this.getGoodsList()
				
			},
			// 下拉刷新，获取最新的数据
			onPullDownRefresh() {
			   // console.log('haha')
			   // 重置关键数据
			   this.queryObj.pagenum = 1
			   this.total = 0
			   this.isloading = false
			   this.goodsList = []
		
			   // 重新发起数据请求
			   // 回调函数是官方给出的，停止继续加载数据
			   this.getGoodsList(() => uni.stopPullDownRefresh())
			}
			
		}
	}
</script>

<style lang="scss">

</style>
