export function getCateList() {
	
	return uni.$http.get('/api/public/v1/categories')
	
}