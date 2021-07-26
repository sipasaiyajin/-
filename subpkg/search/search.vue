<template>
	<view>
		
		<view class="search-box">
			
			<uni-search-bar
				@input="input"
				:radius="100"
				cancelButton="none"
			></uni-search-bar>
			
		</view>
		
		<!-- 搜索建议列表  当搜索结果不为0的时候就显示-->
		<view 
			class="sugg-list"
			v-if="searchResults.length !== 0"
		>
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
		
		<!-- 显示搜索历史记录 -->
		<view class="history-box" v-else>
			
			<!-- 标题 -->
			<view class="history-title">
				
				<text>搜索历史</text>
				<!-- 绑定清除历史记录的事件 -->
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
				
			</view>
			
			<!-- 列表区域 -->
			<view class="history-list">
				
				<uni-tag 
					:text="item" 
					v-for="(item, i) in histories"
					:key="i"
					@click="gotoGoodsList(item)"
				></uni-tag>
				
			</view>
			
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
			
			// 从缓存中获取到历史搜索记录
			this.historyList = JSON.parse(uni.getStorageSync('kw' || '[]'))
			
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
				
			},
			clean(){
				
				// 先将变量赋值为空数组
				this.historyList = []
				// 将历史记录缓存清空
				this.setStorageSync('kw', '[]')
				
			},
			// 跳转到商品列表页面
			gotoGoodsList(kw){
				
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
				
			}
		},
		computed:{
			// 每次将最新的搜索关键词放在数组的最前面
			histories() {
				
				return [...this.historyList.reverse()]
				
			}
			
		}
	}
</script>

<style lang="scss">

.search-box{
	
	position: sticky;
	top: 0;
	z-index: 999;
	
}

// 这是搜索商品列表的容器
.sugg-list{
	
	padding: 0 5px;
	
	// 这是每一个商品列表的样式
	.sugg-item{
		
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		
		// 商品名字样式, 单行文本省略样式
		.goods-name{
			
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			margin-left: 3px;
			
		}
	}
	
}

// 这是搜索历史的容器样式
.history-box{
	
	padding: 0 5px;
	
	// 标题样式
	.history-title{
		
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
		
	}
	
	// 列表样式
	.history-list{
		
		// 图标样式
		.uni-tag{
			
			
		}
		
	}
	
}

</style>
