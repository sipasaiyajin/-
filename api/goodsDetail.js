export function getGoodsDetail(data){
	
	return uni.$http.get('/api/public/v1/goods/detail', data)
	
}