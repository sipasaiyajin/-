<template>
	<!-- 分类页面 -->
	<view>
		
		<!-- 使用自定义的搜索组件 -->
		<my-search @click="gotoSearch"></my-search>
		
		<!-- 总容器 -->
		<view class="scroll-view-container">
			
			<!-- 左侧滑动区域 -->
			<scroll-view 
				class="left-scroll-view"
				scroll-y="true"
				:style="{height: wh + 'px'}"
			>
				
				<block v-for="(item, i) in cateList" :key="i">
					
					<!-- 动态绑定类名 -->
					<!-- 绑定点击事件，点击哪个分类就改变哪个分类的样式 -->
					<view
						:class="['left-scroll-view-item', i === active ? 'active' : '']"
						@click="activeChanged(i)"
					>
						{{item.cat_name}}
					</view>
					
				</block>
				
				
			</scroll-view>
			
			<!-- 右侧的滑动区域 -->
			<scroll-view 
				scroll-y="true" 
				:style="{height: wh + 'px'}"
				:scroll-top="scrolTop"
			
			>
				<!-- 遍历二级分类列表 -->
				<view 
					class="cate-lv2"
					v-for="(item2, i2) in cateList2"
					:key="i2"
				>
					<!-- 二级分类标题 -->
					<view class="cate-lv2-title">
						
						/ {{item2.cat_name}}
						
					</view>
					
					<!-- 当前二级分类下的三级分类 -->
					<view class="cate-lv3-list">
						
						<!-- 三级分类的Item项 -->
						<view 
							class="cate-lv3-item"
							v-for="(item3, i3) in item2.children"
							:key="i3"
							@click="gotoGoodsList(item3)"
						>
							
							<!-- 三级分类的图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 三级分类的文本 -->
							<text>{{item3.cat_name}}</text>
							
						</view>
						
					</view>
						
				</view>
				
				
			</scroll-view>
			
			
		</view>
		
		
	</view>
</template>

<script>
	
	import { getCateList } from '../../api/cate.js'
	
	export default {
		data() {
			return {
				
				// 当前设备可用的高度
				wh: 0,
				// 这是分类的数据
				cateList: [],
				// 当前选中的分类，默认为0索引
				active: 0,
				// 二级分类的列表
				cateList2: [],
				// 距离顶部的距离
				scrollTop: 0
				
			};
		},
		onLoad(){
			
			// 获取系统的对象
			const sysInfo = uni.getSystemInfoSync()
			// 将系统的 windowHeight 高度 减去 50 然后赋值给 wh变量
			this.wh = sysInfo.windowHeight - 50
			this.getCateList()
			
		},
		methods: {
			
			// 获取分类列表的数据
			async getCateList() {
				
				const { data: res } = await getCateList()
				
				console.log(res)
				
				if(res.meta.status !== 200) return uni.$showMsg()
					
				// 将Message数据赋值给 cateList
				this.cateList = res.message
				
				// 给二级分类赋值
				this.cateList2 = res.message[0].children
				
			},
			// 点击改变active的值为传入的值
			activeChanged(i){
				
				this.active = i
				
				// 并且重新为二级分类赋值
				this.cateList2 = this.cateList[i].children 
				
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
				
			},
			// 跳转到对应的商品列表页面
			gotoGoodsList(item){
				
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
				
			},
			
			// 跳转到搜索页面
			gotoSearch(){
				
				uni.navigateTo({
					url: '/subpkg/search/search',
					animationType: 'pop-in',
					animationDuration: 200
				})
				
			}
			
			
		}
	}
</script>

<style lang="scss">

// 总容器是弹性布局
.scroll-view-container{
	display: flex;
	
	// 左侧滑动容器
	.left-scroll-view{
		
		width: 120px;
		
		// 每一个分类的样式
		.left-scroll-view-item{
			
			font-size: 12px;
			text-align: center;
			line-height: 60px;
			background-color: #F7F7F7;
			
			&.active{
				
				background-color: #FFFFFF;
				position: relative;
				
				&::before{
					
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #C00000;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					
				}
				
			}
			
		}
		
	}
	
	// 右侧滑动内容
	// 右侧二级分类的标题样式
	.cate-lv2-title{
		
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}
	
	// 右侧分类下的三级分类样式，用来布局
	.cate-lv3-list{
		
		display: flex;
		flex-wrap: wrap;
		
		// 三级分类容器样式
		.cate-lv3-item{
			
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;
			
			image{
				
				width: 60px;
				height: 60px;
				
			}
			
			text{
				
				font-size: 12px;
				
			}
			
		}
		
	}
	
}




</style>
