
const state  = {
	
	// 购物车的数组，用来存储购物车中每个商品的信息对象
	cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	
}

const mutations = {
	
	// 传入商品对象
	addToCart(state, goods){
		
		// 如果goods中的goods_id 在 cart数组中存在
		const findResult = state.cart
		.find(
			x => x.goods_id === goods.goods_id
		)
		
		// 如果没有findResult这个对象
		// 则将商品添加到购物车中
		if(!findResult){
			
			state.cart.push(goods)
			
		}else {
			// 如果存在findResult 这个商品对象，
			// 则让这个商品的数量加加
			findResult.goods_count ++
			
		}
		
		// 将购物车中的商品信息，保存到本地
		this.commit('m_cart/saveToStorage')
		
		
	},
	// 将购物车商品缓存到本地
	saveToStorage(state){
		
		// 将最新的购物车数据缓存下来
		uni.setStorageSync('cart', JSON.stringify(state.cart))
		
	},
	
	// 更新购物车中商品的勾选状态
	updateGoodsState(state, goods){
		
		// 在购物车数组中，找到和传入的商品id 相同的商品
		// 然后赋值给 findResult 这个对象
		const findResult = state.cart.find(
			
			x => x.goods_id === goods.goods_id
		
		)
		
		// 当有这个对象时，就将商品的状态赋值给findResult.goods_state
		// 然后保存最新的值
		if(findResult){
			
			findResult.goods_state = goods.goods_state
		
			this.commit('m_cart/saveToStorage')
		}
		
	},
	// 更新商品的数量
	updateGoodsCount(state, goods){
		
		// 将购物车里面的商品的goods_id 和 传入商品的 goods_id
		// 作比较，将购物车中有这个商品的添加到 findResult 数组中
		const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
		
		if(findResult){
			
			findResult.goods_count = goods.goods_count
			
			this.commit('m_cart/saveToStorage')
			
		}
		
	},
	// 根据 id 删除对应的商品
	removeGoodsById(state, goods_id){
		
		// 将满足条件的留下来，重新赋值给cart
		state.cart = state.cart.filter(
			x => x.goods_id !== goods_id
		)
		
		// 调用m_cart 模块下的 saveToStorage 方法
		// 将最新的购物车数据保存下来
		this.commit('m_cart/saveToStorage')
		
	},
	// 更新购物车中所有的商品的勾选状态
	// 将传入的全选的状态 赋值给 每一个 商品对象的状态
	updateAllGoodsState(state, newState){
		
		state.cart.forEach(
			x => x.goods_state = newState
		)
		
		this.commit('m_cart/saveToStorage')
	}
	
}

const getters = {
	
	// 购物车中所有商品的总数量
	total(state){
		
		// 将购物车中所有的商品自己和自己进行累加
		return state.cart.reduce((total, item) => 
			
			total += item.goods_count
			
		, 0)
		
	},
	// 购物车中已勾选商品的总数量
	checkedCount(state){
	
		
		// 将已勾选的商品的数量进行累加
		return state.cart
		.filter(x => x.goods_state)
		.reduce((total, item) => 
			
			total += item.goods_count
			
		, 0)
		
	},
	// 已勾选商品的总价格
	checkedGoodsAmount(state){
		
		// x.goods_state 就是选择出已经被选中的商品
		// 将商品的 goods_count * 商品的价格
		// 然后和其他的商品的总价格进行累加
		// 最后将数字转成小数点后2为的数字
		return state.cart
		.filter(x => x.goods_state)
		.reduce((total,item) => 
			
			total += item.goods_count * item.goods_price
			
		, 0)
		.toFixed(2)
		
	}
	
}

export default {
	// 开启命名空间
	namespaced: true,
	state,
	mutations,
	getters
}