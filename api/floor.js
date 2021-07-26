// 获取楼层数据
export function getFloorList(){
	
	return uni.$http.get('/api/public/v1/home/floordata')
	
}