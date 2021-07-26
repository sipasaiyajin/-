<template>
	<view class="search-box">
		
		<uni-search-bar
			@input="input"
			:radius="100"
			cancelButton="none"
		></uni-search-bar>
		
	</view>
	
	<!-- 搜索建议列表  当搜索结果不为0的时候就显示-->
	
	<view class="sugg-list" >	
		<!-- 这是出来的商品列表 -->
		<view 
			class="sugg-item"
			v-for="(item, i) in searchResults"
			:key="i"
			@click="gotoDetail(item)"
		>
			<view class="goods-name">{{item.goods_name}}</view>
			<uni-icons type="arrowright" size="16"></uni-icons>
			
		</view>
		
	</view>
		
		
</template>

<script>
	
	import { getSearchList } from '../../api/search.js'
	
	export default {
		data() {
			return {
				// 定时器默认为null
				timer: null,
				kw: '',
				// 搜索的关键字数组
				searchResults: [],
				// 历史关键字数组
				historyList: []
				
			};
		},
		onLoad() {
			
		},
		methods:{
			
			// 输入事件的处理函数
			// 这就是input输入框的change事件
			// 这里我们要做一个防抖，每隔500毫秒才去发送一次请求
			input(e){
				
				// 先清除定时器
				clearTimeout(this.timer)
				
				this.timer = setTimeout(() =>{
					
					console.log(e.value)
					// 将 input 输入的值 赋值给 kw
					this.kw = e.value
					// 根据 kw 去请求数据
					this.getSearchList()
					
				}, 500)
				
			},
			// 获取搜索记录
			async getSearchList(){
				
				// 判断搜索关键词是否为空
				if(this.kw.length === 0){
					
					this.searchResults = []
					return 
				}
				
				const {data: res} =  await getSearchList({query: this.kw})
				
				if(res.meta.status !== 200) return uni.$showMsg()
				
				// console.log(res)
				this.searchResults = res.message
				
				// 将搜索词持久化保存
				this.saveSearchHistory()
				
			},
			// 跳转到指定搜索列表的商品详情页面
			gotoDetail(item){
				
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
				
			},
			// 保存到搜索历史记录中
			saveSearchHistory(){
				
				// 创建 set 集合
				const set = new Set(this.historyList)
				
				// 将set集合中相同的kw删除
				set.delete(this.kw)
				
				// 将kw添加到 set 集合中去
				set.add(this.kw)
				
				// 将set集合转成数组，然后赋值给 historyList
				this.historyList = Array.from(set)
				
				// 对搜索历史数据，进行持久化存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
				
			}
			
		}
	}
</script>

<style lang="scss">

</style>
