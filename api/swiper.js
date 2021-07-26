export function getSwiper(){
	
	return uni.$http.get('/api/public/v1/home/swiperdata')
	
}