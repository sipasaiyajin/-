export function getSearchList(data){
	
	return uni.$http.get('/api/public/v1/goods/qsearch', data)
	
}