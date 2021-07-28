<template>
	<view class="uni-numbox">
		<!-- 这是左边的减 -->
		<view 
			@click="_calcValue('minus')" 
			class="uni-numbox__minus"
		>	
			<!-- 当 inputValue的值小于或者等于 min 或者 为 disalbed
				就显示这个 uni-numbox--disabled 样式 
				这个样式就是颜色为浅色，且按钮不能被点击
			-->
			<text 
				class="uni-numbox--text" 
				:class="{ 
					'uni-numbox--disabled': 
					inputValue <= min || disabled 
				}"
			>-</text>
		</view>
		<!-- 中间显示的数字，是个Input这样就可以自定义数量 -->
		<!--  -->
		<input 
			:disabled="disabled" 
			@blur="_onBlur" 
			class="uni-numbox__value" 
			type="number" 
			v-model="inputValue" 
		/>
		<!-- 这是右边的加 -->
		<view 
			@click="_calcValue('plus')" 
			class="uni-numbox__plus"
		>
		
			<text 
				class="uni-numbox--text" 
				:class="{ 
				'uni-numbox--disabled': 
				inputValue >= max || disabled }"
			>+</text>
			
		</view>
	</view>
</template>
<script>
	/**
	 * NumberBox 数字输入框
	 * @description 带加减按钮的数字输入框
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=31
	 * @property {Number} value 输入框当前值
	 * @property {Number} min 最小值
	 * @property {Number} max 最大值
	 * @property {Number} step 每次点击改变的间隔大小
	 * @property {Boolean} disabled = [true|false] 是否为禁用状态
	 * @event {Function} change 输入框值改变时触发的事件，参数为输入框当前的 value
	 */

	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// input框默认值
				inputValue: 0
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", newVal);
				}
			}
		},
		created() {
			this.inputValue = +this.value;
		},
		methods: {
			// 这是计算 input 值的大小来
			_calcValue(type) {
				
				if (this.disabled) {
					
					return;
					
				}
				// 获取系数
				const scale = this._getDecimalScale();
				
				// 让 inputValue 乘以这个系数
				let value = this.inputValue * scale;
				
				let step = this.step * scale;
				
				if (type === "minus") {
					
					value -= step;
					
					if (value < (this.min * scale)) {
						return;
					}
					
					if (value > (this.max * scale)) {
						value = this.max * scale
					}
					
				} else if (type === "plus") {
					
					value += step;
					
					if (value > (this.max * scale)) {
						return;
					}
					
					if (value < (this.min * scale)) {
						value = this.min * scale
					}
					
				}

				this.inputValue = String(value / scale);
			
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				// 设置这个input 的值需要变化的系数
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			// 鼠标聚焦事件
			_onBlur(event) {
				
				// 获取到input框的值
				let value = event.detail.value;
				
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				
				value = +value;
				
				// 如果input的值 大于 100 就将最大值100 赋值给 input的值
				// 如果input的值 小于 1 就将最小值1 赋值给 input的值
				if (value > this.max) {
					
					value = this.max;
					
				} else if (value < this.min) {
					
					value = this.min;
					
				}
				// 将最新的input值赋值给 inputValue变量
				this.inputValue = value;
			}
		}
	};
</script>
<style scoped>
	/* #ifdef APP-NVUE */
	/* #endif */

	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: 35px;
		line-height: 35px;
		width: 120px;
	}

	.uni-numbox__value {
		background-color: #ffffff;
		width: 40px;
		height: 35px;
		text-align: center;
		font-size: 16;
		border-width: 1rpx;
		border-style: solid;
		border-color: #e5e5e5;
		border-left-width: 0;
		border-right-width: 0;
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 35px;
		height: 35px;
		/* line-height: $box-line-height;
 */
		/* text-align: center;
 */
		font-size: 20px;
		color: #333;
		background-color: #f8f8f8;
		border-width: 1rpx;
		border-style: solid;
		border-color: #e5e5e5;
		border-top-left-radius: 3px;
		border-bottom-left-radius: 3px;
		border-right-width: 0;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 35px;
		height: 35px;
		border-width: 1rpx;
		border-style: solid;
		border-color: #e5e5e5;
		border-top-right-radius: 3px;
		border-bottom-right-radius: 3px;
		background-color: #f8f8f8;
		border-left-width: 0;
	}

	.uni-numbox--text {
		font-size: 40rpx;
		color: #333;
	}

	.uni-numbox--disabled {
		color: #c0c0c0;
	}
</style>