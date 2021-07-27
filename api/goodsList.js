export function getGoodsList(data){
	
	return uni.$http.get('/api/public/v1/goods/search', data)
	
}