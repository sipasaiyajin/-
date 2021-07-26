// 获取分类导航的数据
export function getNavList(){
		
	return uni.$http.get('/api/public/v1/home/catitems')
	
}